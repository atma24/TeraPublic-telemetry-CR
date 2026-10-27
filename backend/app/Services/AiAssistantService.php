<?php

namespace App\Services;

use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\EquityMetric;
use App\Models\PublicFacility;
use App\Models\Region;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AiAssistantService
{
    /**
     * Handle citizen question using Retrieval-Augmented Generation (RAG).
     *
     * @return array<string, mixed>
     */
    public function ask(string $question, ?string $citizenName = null): array
    {
        $normalizedQuestion = trim($question);
        $cacheKey = 'terapublic_rag_'.md5(strtolower($normalizedQuestion));

        // 1. Check Smart Cache (Saves API Quota & Returns in 5ms)
        $cached = Cache::get($cacheKey);
        if ($cached) {
            $cached['source'] = 'cache';

            return $cached;
        }

        // 2. Retrieve Relevant Context from PostgreSQL Database
        $context = $this->retrieveContext($normalizedQuestion);

        $apiKey = config('services.gemini.key', env('GEMINI_API_KEY'));

        // 3. Call Google Gemini 2.5 Flash if API Key is configured
        if (! empty($apiKey)) {
            $geminiResponse = $this->callGeminiApi($normalizedQuestion, $context, $apiKey, $citizenName);
            if ($geminiResponse) {
                $result = [
                    'status' => 'success',
                    'engine' => 'gemini-2.5-flash-rag',
                    'model' => 'gemini-2.5-flash',
                    'answer' => $geminiResponse,
                    'citations' => $context['citations'],
                    'matched_region' => $context['matched_region'],
                ];

                // Cache for 30 minutes
                Cache::put($cacheKey, $result, 1800);

                return $result;
            }
        }

        // 4. Fallback Local Natural Language Synthesizer (Zero-Failure Guarantee)
        $localAnswer = $this->generateLocalRAGAnswer($normalizedQuestion, $context, $citizenName);

        return [
            'status' => 'success',
            'engine' => 'terapublic-rag-local',
            'model' => 'database-deterministic-synthesizer',
            'answer' => $localAnswer,
            'citations' => $context['citations'],
            'matched_region' => $context['matched_region'],
        ];
    }

    /**
     * Multi-Entity Semantic & Keyword Retrieval from Local Database.
     * Extracts only top relevant rows (< 350 tokens) to minimize quota consumption.
     *
     * @return array<string, mixed>
     */
    protected function retrieveContext(string $question): array
    {
        $lower = strtolower($question);
        $citations = [];
        $contextLines = [];

        // A. Ticket Tracking Code Detection (e.g. TP-2026-XXXX)
        if (preg_match('/TP-\d{4}-[A-Z0-9]{4,5}/i', $question, $matches)) {
            $ticketCode = strtoupper($matches[0]);
            $ticket = CitizenFeedback::with('facility.region')
                ->where('tracking_code', $ticketCode)
                ->first();

            if ($ticket) {
                $contextLines[] = "DATA TIKET ADUAN WARGA ({$ticket->tracking_code}):";
                $contextLines[] = "- Judul: {$ticket->title}";
                $contextLines[] = "- Kategori: {$ticket->category}";
                $contextLines[] = "- Status Terkini: {$ticket->status}";
                $contextLines[] = '- Tanggapan Resmi Dinas: '.($ticket->admin_response ?? 'Sedang dalam antrean verifikasi petugas dinas terkait.');
                if ($ticket->facility) {
                    $contextLines[] = "- Lokasi Terkait: {$ticket->facility->name} (Kecamatan {$ticket->facility->region?->name})";
                }
                $citations[] = "Tiket Pengaduan: {$ticket->tracking_code}";

                return [
                    'raw_text' => implode("\n", $contextLines),
                    'matched_region' => $ticket->facility?->region?->name,
                    'citations' => $citations,
                ];
            }
        }

        // B. Detect Mentioned Region / District (44 Kecamatan DKI Jakarta)
        $regions = Region::where('level', 'district')->get();
        $matchedRegion = null;
        foreach ($regions as $reg) {
            if (Str::contains($lower, strtolower($reg->name))) {
                $matchedRegion = $reg;
                break;
            }
        }

        if ($matchedRegion) {
            $metric = EquityMetric::where('region_id', $matchedRegion->id)->first();
            $facilities = PublicFacility::where('region_id', $matchedRegion->id)->take(4)->get();
            $budgets = BudgetProject::where('region_id', $matchedRegion->id)->take(3)->get();

            $contextLines[] = "DATA WILAYAH: Kecamatan {$matchedRegion->name} ({$matchedRegion->city})";
            $contextLines[] = '- Jumlah Penduduk (BPS 2024): '.number_format($matchedRegion->population).' jiwa.';

            if ($metric) {
                $statusUnderserved = $metric->is_underserved ? 'Perlu Intervensi Tambahan (Defisit Akses)' : 'Memadai / Stabil';
                $contextLines[] = "- Rasio Fasilitas per 10.000 Penduduk: {$metric->ratio_per_10k_population}";
                $contextLines[] = "- Indeks Aksesibilitas Disabilitas: {$metric->accessibility_score}% ({$statusUnderserved})";
            }

            if ($facilities->isNotEmpty()) {
                $contextLines[] = 'Contoh Fasilitas Publik Terpetakan di Wilayah Ini:';
                foreach ($facilities as $fac) {
                    $disabilityFeatures = [];
                    if ($fac->has_wheelchair_ramp) {
                        $disabilityFeatures[] = 'Ramp Kursi Roda';
                    }
                    if ($fac->has_tactile_paving) {
                        $disabilityFeatures[] = 'Ubin Pemandu (Tactile Paving)';
                    }
                    if ($fac->has_disabled_toilet) {
                        $disabilityFeatures[] = 'Toilet Disabilitas';
                    }
                    $featStr = empty($disabilityFeatures) ? 'Belum terverifikasi ramah disabilitas' : implode(', ', $disabilityFeatures);
                    $contextLines[] = " * {$fac->name} ({$fac->status}): {$featStr}";
                    $citations[] = "Fasilitas: {$fac->name}";
                }
            }

            if ($budgets->isNotEmpty()) {
                $contextLines[] = 'Contoh Proyek Alokasi Anggaran APBD Terkait:';
                foreach ($budgets as $b) {
                    $contextLines[] = ' * '.substr($b->project_name, 0, 75).': Alokasi Rp '.number_format($b->budget_allocated)." (Progres: {$b->progress_percentage}%, Status: {$b->status})";
                    $citations[] = 'Proyek APBD: '.substr($b->project_name, 0, 50);
                }
            }
        } else {
            // C. General Macro Transparency Data (City-Wide Context)
            $totalFacilities = PublicFacility::count();
            $accessibleCount = PublicFacility::where('has_wheelchair_ramp', true)
                ->orWhere('has_tactile_paving', true)
                ->orWhere('has_disabled_toilet', true)
                ->count();
            $accessiblePct = $totalFacilities > 0 ? round(($accessibleCount / $totalFacilities) * 100, 1) : 0.0;

            $totalBudget = BudgetProject::sum('budget_allocated');
            $realizedBudget = BudgetProject::sum('budget_realized');
            $realizationRate = $totalBudget > 0 ? round(($realizedBudget / $totalBudget) * 100, 2) : 0.0;
            $totalProjects = BudgetProject::count();

            $contextLines[] = 'DATA MAKRO TRANSPARANSI DKI JAKARTA (TERAPUBLIC 2026):';
            $contextLines[] = "- Total Fasilitas Terpetakan: {$totalFacilities} unit (Sekolah Dapodik & Pasar Tradisional Pasar Jaya).";
            $contextLines[] = "- Fasilitas dengan Fitur Ramah Disabilitas: {$accessibleCount} unit ({$accessiblePct}%).";
            $contextLines[] = "- Total Proyek Belanja Modal APBD Fisik: {$totalProjects} paket.";
            $contextLines[] = '- Total Alokasi Anggaran Belanja Modal: Rp '.number_format($totalBudget).' (Terealisasi: Rp '.number_format($realizedBudget).", Serapan: {$realizationRate}%).";
            $contextLines[] = '- Machine Learning K-Means: Membagi 44 kecamatan ke dalam 3 kluster urgensi (Kritis, Moderat, dan Stabil).';
            $citations[] = 'Basis Data Agregat TeraPublic DKI Jakarta 2026';
        }

        return [
            'raw_text' => implode("\n", $contextLines),
            'matched_region' => $matchedRegion?->name,
            'citations' => array_unique(array_slice($citations, 0, 5)),
        ];
    }

    /**
     * Send prompt to Google Gemini 2.5 Flash API with custom instructions.
     */
    protected function callGeminiApi(string $question, array $context, string $apiKey, ?string $citizenName): ?string
    {
        try {
            $systemInstruction = "Anda adalah Asisten Informasi Publik TeraPublic DKI Jakarta, platform transparansi fasilitas publik, aksesibilitas disabilitas, dan anggaran APBD untuk kompetisi Web In Action (WIA) MIA 2026.\n".
                "Tugas Anda adalah melayani dan menjawab pertanyaan warga masyarakat dengan ramah, transparan, faktual, dan objektif berdasarkan Data Konteks Resmi berikut ini:\n\n".
                $context['raw_text']."\n\n".
                "Pedoman Menjawab:\n".
                "1. Jawab dalam Bahasa Indonesia yang santun, profesional, dan mudah dipahami warga.\n".
                "2. Gunakan fakta, persentase, dan nominal rupiah yang tertera pada konteks di atas.\n".
                "3. Jika data spesifik yang ditanyakan warga belum tersedia di basis data, sampaikan secara terbuka dan arahkan warga untuk mengirimkan laporan aduan melalui formulir 'Aduan Warga'.\n".
                '4. Susun jawaban secara terstruktur menggunakan Markdown yang rapi (bullet points, bolding penting).';

            $prompt = ($citizenName ? "Nama Penanya: {$citizenName}\n" : '')."Pertanyaan Warga: {$question}";

            $response = Http::timeout(12)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'system_instruction' => [
                    'parts' => [
                        ['text' => $systemInstruction],
                    ],
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $prompt],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.3, // Low temperature for high factual accuracy
                    'maxOutputTokens' => 800,
                ],
            ]);

            if ($response->successful()) {
                $candidates = $response->json('candidates');
                if (! empty($candidates[0]['content']['parts'][0]['text'])) {
                    return trim($candidates[0]['content']['parts'][0]['text']);
                }
            }
        } catch (\Throwable $e) {
            // Silently fall through to local fallback
        }

        return null;
    }

    /**
     * Deterministic Local Synthesizer when Gemini API is unavailable or offline.
     */
    protected function generateLocalRAGAnswer(string $question, array $context, ?string $citizenName): string
    {
        $greeting = $citizenName ? "Halo Bapak/Ibu {$citizenName}, terima kasih telah menghubungi Asisten Publik TeraPublic." : 'Halo, terima kasih telah menghubungi Asisten Publik TeraPublic.';

        $body = "Berikut adalah ringkasan data resmi berdasarkan sistem transparansi TeraPublic DKI Jakarta:\n\n";
        $body .= $context['raw_text']."\n\n";

        if ($context['matched_region']) {
            $body .= "💡 **Transparansi Berkelanjutan**: Apabila Anda menemukan kendala aksesibilitas disabilitas atau keterlambatan proyek di Kecamatan {$context['matched_region']}, Anda dapat langsung mengirimkan laporan resmi melalui menu **Aduan Warga** pada platform ini.";
        } else {
            $body .= "💡 **Tips**: Anda dapat menanyakan informasi spesifik seperti: *'Bagaimana fasilitas sekolah di Kecamatan Menteng?'*, *'Berapa anggaran di Kecamatan Gambir?'*, atau melacak nomor tiket aduan Anda (contoh: *'Cek status tiket TP-2026-0001'*).";
        }

        return "{$greeting}\n\n{$body}";
    }
}
