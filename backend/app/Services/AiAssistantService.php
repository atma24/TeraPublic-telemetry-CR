<?php

namespace App\Services;

use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\EquityMetric;
use App\Models\FacilityCategory;
use App\Models\PublicFacility;
use App\Models\Region;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiAssistantService
{
    private const INTENT_TICKET = 'ticket';

    private const INTENT_DISTRICT_RANKING = 'district_ranking';

    private const INTENT_ACCESSIBILITY = 'accessibility';

    private const INTENT_BUDGET = 'budget';

    private const INTENT_FACILITY = 'facility';

    private const INTENT_GENERAL = 'general';

    /**
     * Handle citizen question using Retrieval-Augmented Generation (RAG).
     *
     * @return array<string, mixed>
     */
    public function ask(string $question, ?string $citizenName = null): array
    {
        $normalizedQuestion = trim($question);
        $cacheKey = 'terapublic_rag_'.md5(Str::lower($normalizedQuestion).'|'.($citizenName ?? ''));

        // 1. Check Smart Cache (Saves API Quota & Returns in 5ms)
        $cached = Cache::get($cacheKey);
        if (is_array($cached)) {
            $cached['source'] = 'cache';

            return $cached;
        }

        // 2. Retrieve Relevant Context from PostgreSQL Database
        $context = $this->retrieveContext($normalizedQuestion);

        $apiKey = config('services.gemini.key');

        // 3. Call Google Gemini if API Key is configured
        if (! empty($apiKey)) {
            $geminiResponse = $this->callGeminiApi($normalizedQuestion, $context, $apiKey, $citizenName);
            if ($geminiResponse !== null) {
                $model = config('services.gemini.model', 'gemini-2.5-flash');

                $result = [
                    'status' => 'success',
                    'engine' => $model.'-rag',
                    'model' => $model,
                    'intent' => $context['intent'],
                    'answer' => $geminiResponse,
                    'citations' => $context['citations'],
                    'matched_region' => $context['matched_region'],
                ];

                // Cache for 10 minutes
                Cache::put($cacheKey, $result, 600);

                return $result;
            }
        }

        // 4. Fallback Local Natural Language Synthesizer (Zero-Failure Guarantee)
        $localAnswer = $this->generateLocalRAGAnswer($normalizedQuestion, $context, $citizenName);

        return [
            'status' => 'success',
            'engine' => 'terapublic-rag-local',
            'model' => 'database-deterministic-synthesizer',
            'intent' => $context['intent'],
            'answer' => $localAnswer,
            'citations' => $context['citations'],
            'matched_region' => $context['matched_region'],
        ];
    }

    /**
     * Intent-aware retrieval from the local database.
     * Extracts only the rows relevant to the question (< 350 tokens) to minimize quota consumption.
     *
     * @return array<string, mixed>
     */
    protected function retrieveContext(string $question): array
    {
        $lower = Str::lower($question);
        $citations = [];

        // A. Ticket Tracking Code Detection (e.g. TP-2026-XXXX)
        if (preg_match('/TP-\d{4}-[A-Z0-9]{4,5}/i', $question, $matches)) {
            $ticket = CitizenFeedback::with('facility.region')
                ->where('tracking_code', strtoupper($matches[0]))
                ->first();

            if ($ticket) {
                $lines = ["DATA TIKET ADUAN WARGA ({$ticket->tracking_code}):"];
                $lines[] = "- Judul: {$ticket->title}";
                $lines[] = "- Kategori: {$ticket->category}";
                $lines[] = "- Status terkini: {$ticket->status}";
                $lines[] = '- Tanggapan resmi dinas: '.($ticket->admin_response ?? 'Sedang dalam antrean verifikasi petugas dinas terkait.');
                if ($ticket->facility) {
                    $lines[] = "- Lokasi terkait: {$ticket->facility->name} (Kecamatan {$ticket->facility->region?->name})";
                }
                $citations[] = "Tiket Pengaduan: {$ticket->tracking_code}";

                return $this->contextResult(
                    $lines,
                    self::INTENT_TICKET,
                    $ticket->facility?->region?->name,
                    $citations
                );
            }
        }

        $matchedRegion = $this->matchRegion($lower);
        $intent = $this->detectIntent($lower, $matchedRegion);

        if ($intent === self::INTENT_DISTRICT_RANKING) {
            [$lines] = $this->buildDistrictRankingContext($lower, $citations);
            if ($matchedRegion) {
                array_unshift($lines, "WILAYAH YANG DISEBUT: Kecamatan {$matchedRegion->name} ({$matchedRegion->city}).");
            }
        } elseif ($matchedRegion) {
            [$lines] = $this->buildRegionContext($matchedRegion, $intent, $lower, $citations);
        } else {
            [$lines] = match ($intent) {
                self::INTENT_ACCESSIBILITY => $this->buildAccessibilityContext($lower, $citations),
                self::INTENT_BUDGET => $this->buildBudgetContext($lower, $citations),
                self::INTENT_FACILITY => $this->buildFacilityContext($lower, $citations),
                default => $this->buildGeneralContext($citations),
            };
        }

        return $this->contextResult($lines, $intent, $matchedRegion?->name, $citations);
    }

    /**
     * @param  array<int, string>  $lines
     * @param  array<int, string>  $citations
     * @return array<string, mixed>
     */
    protected function contextResult(array $lines, string $intent, ?string $matchedRegion, array $citations): array
    {
        $lines = array_values(array_filter($lines, fn (string $line): bool => trim($line) !== ''));

        return [
            'raw_text' => implode("\n", $lines),
            'intent' => $intent,
            'matched_region' => $matchedRegion,
            'citations' => array_slice(array_values(array_unique($citations)), 0, 8),
        ];
    }

    /**
     * Find the longest district name mentioned in the question.
     */
    protected function matchRegion(string $lower): ?Region
    {
        $matchedRegion = null;
        $matchedLength = 0;

        foreach (Region::where('level', 'district')->get(['id', 'name', 'city', 'population']) as $region) {
            $name = Str::lower($region->name);

            if (Str::length($name) >= 4 && Str::contains($lower, $name) && Str::length($name) > $matchedLength) {
                $matchedRegion = $region;
                $matchedLength = Str::length($name);
            }
        }

        return $matchedRegion;
    }

    /**
     * Classify the question so the retriever can select the right data source.
     */
    protected function detectIntent(string $lower, ?Region $matchedRegion = null): string
    {
        $wantsRanking = Str::contains($lower, [
            'paling', 'tertinggal', 'terendah', 'terburuk', 'prioritas', 'prioritaskan',
            'kluster', 'cluster', 'pemerataan', 'disparitas', 'kesenjangan', 'kritis',
            'moderat', 'stabil', 'ranking', 'peringkat', 'urutkan', 'membutuhkan', 'butuh',
        ]);

        $aboutAccessibility = Str::contains($lower, [
            'disabilitas', 'difabel', 'aksesibilitas', 'ramp', 'kursi roda', 'tactile',
            'ubin pemandu', 'toilet', 'inklus', 'ramah',
        ]);

        $aboutBudget = Str::contains($lower, [
            'anggaran', 'apbd', 'realisasi', 'serapan', 'belanja', 'biaya', 'pagu',
            'alokasi', 'proyek', 'paket', 'progress', 'progres', 'terlambat', 'kontrak',
            'dana', 'rupiah',
        ]);

        $aboutFacility = Str::contains($lower, [
            'fasilitas', 'sekolah', 'pasar', 'sma', 'smk', 'smp', 'sd ', 'dapodik',
            'pasar jaya', 'gedung', 'unit',
        ]);

        $aboutArea = $matchedRegion !== null || Str::contains($lower, ['kecamatan', 'wilayah', 'daerah']);

        if ($wantsRanking && ($aboutAccessibility || $aboutBudget || $aboutFacility || $aboutArea)) {
            return self::INTENT_DISTRICT_RANKING;
        }

        if ($aboutAccessibility) {
            return self::INTENT_ACCESSIBILITY;
        }

        if ($aboutBudget) {
            return self::INTENT_BUDGET;
        }

        if ($aboutFacility) {
            return self::INTENT_FACILITY;
        }

        return self::INTENT_GENERAL;
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildDistrictRankingContext(string $lower, array &$citations): array
    {
        $categoryId = null;
        $categoryLabel = 'fasilitas umum';

        if (Str::contains($lower, ['sekolah', 'sma', 'smk', 'smp', 'sd ', 'dapodik'])) {
            $categoryId = FacilityCategory::where('name', 'like', '%Sekolah%')->value('id');
            $categoryLabel = 'sekolah';
        } elseif (Str::contains($lower, ['pasar'])) {
            $categoryId = FacilityCategory::where('name', 'like', '%Pasar%')->value('id');
            $categoryLabel = 'pasar';
        }

        $metrics = EquityMetric::with(['region' => function ($query) use ($categoryId): void {
            $query->select('id', 'name', 'city', 'population');

            if ($categoryId) {
                $query->withCount([
                    'facilities as category_facility_count' => fn (Builder $facilityQuery) => $facilityQuery->where('category_id', $categoryId),
                ]);
            }
        }])->get();

        $metrics = $metrics
            ->sortBy(function (EquityMetric $metric) use ($categoryId): float {
                if ($categoryId && $metric->region) {
                    $population = max(1, (int) $metric->region->population);

                    return ((int) $metric->region->category_facility_count / $population) * 10000;
                }

                return (float) $metric->ratio_per_10k_population;
            })
            ->take(8)
            ->values();

        $lines = ["RANKING KECAMATAN BERDASARKAN RASIO {$categoryLabel} & AKSESIBILITAS (terendah = paling membutuhkan):"];

        if ($metrics->isEmpty()) {
            $lines[] = 'Data pemerataan kecamatan belum tersedia di basis data.';

            return [$lines];
        }

        foreach ($metrics as $index => $metric) {
            $regionName = $metric->region?->name ?? 'Tidak diketahui';
            $status = $metric->is_underserved ? 'defisit akses' : 'relatif stabil';

            if ($categoryId && $metric->region) {
                $population = max(1, (int) $metric->region->population);
                $categoryRatio = round(((int) $metric->region->category_facility_count / $population) * 10000, 2);
                $categoryCount = (int) $metric->region->category_facility_count;
                $lines[] = ($index + 1).". Kecamatan {$regionName}: {$categoryCount} {$categoryLabel}, rasio {$categoryRatio} {$categoryLabel} per 10.000 penduduk, aksesibilitas {$metric->accessibility_score}% ({$status}).";
            } else {
                $lines[] = ($index + 1).". Kecamatan {$regionName}: rasio {$metric->ratio_per_10k_population} fasilitas per 10.000 penduduk, aksesibilitas {$metric->accessibility_score}% ({$status}), jumlah fasilitas {$metric->facility_count}.";
            }

            $citations[] = "Pemerataan: {$regionName}";
        }

        $underserved = EquityMetric::where('is_underserved', true)->count();
        $totalDistricts = Region::where('level', 'district')->count();
        $lines[] = "Total kecamatan berstatus defisit akses: {$underserved} dari {$totalDistricts}.";

        return [$lines];
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildAccessibilityContext(string $lower, array &$citations): array
    {
        $totalFacilities = PublicFacility::count();
        $accessibleCount = PublicFacility::where(function (Builder $query): void {
            $query->where('has_wheelchair_ramp', true)
                ->orWhere('has_tactile_paving', true)
                ->orWhere('has_disabled_toilet', true);
        })->count();
        $accessiblePercentage = $totalFacilities > 0 ? round(($accessibleCount / $totalFacilities) * 100, 1) : 0.0;

        $lines = ['RINGKASAN AKSESIBILITAS DISABILITAS DKI JAKARTA:'];
        $lines[] = "- Total fasilitas terpetakan: {$totalFacilities} unit.";
        $lines[] = "- Fasilitas dengan minimal satu fitur ramah disabilitas: {$accessibleCount} unit ({$accessiblePercentage}%).";

        $facilityQuery = PublicFacility::with('region:id,name')->orderBy('name');
        $this->applyAccessibilityFilter($facilityQuery, $lower);
        $facilities = $facilityQuery->take(10)->get();

        $this->appendFacilityLines($lines, $citations, $facilities, 'Fasilitas yang sesuai dengan pertanyaan');

        return [$lines];
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildBudgetContext(string $lower, array &$citations): array
    {
        $lines = [];
        $this->appendBudgetSummary($lines);

        $topProjects = BudgetProject::with('region:id,name')
            ->orderByDesc('budget_allocated')
            ->take(8)
            ->get();
        $this->appendBudgetLines($lines, $citations, $topProjects, 'Proyek dengan alokasi terbesar');

        $keywords = $this->extractKeywords($lower);
        if ($keywords !== []) {
            $matchedProjects = BudgetProject::with('region:id,name')
                ->where(function (Builder $query) use ($keywords): void {
                    foreach ($keywords as $keyword) {
                        $query->orWhere('project_name', 'like', "%{$keyword}%");
                    }
                })
                ->orderByDesc('budget_allocated')
                ->take(5)
                ->get();

            if ($matchedProjects->isNotEmpty()) {
                $this->appendBudgetLines($lines, $citations, $matchedProjects, 'Proyek yang cocok dengan kata kunci pertanyaan');
            }
        }

        if (Str::contains($lower, ['terlambat', 'belum selesai', 'progres', 'progress', 'realisasi rendah', 'serapan rendah'])) {
            $lowProgressProjects = BudgetProject::with('region:id,name')
                ->where('progress_percentage', '<', 50)
                ->orderBy('progress_percentage')
                ->take(5)
                ->get();
            $this->appendBudgetLines($lines, $citations, $lowProgressProjects, 'Proyek dengan progres terendah');
        }

        return [$lines];
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildFacilityContext(string $lower, array &$citations): array
    {
        $lines = ['RINGKASAN FASILITAS PUBLIK DKI JAKARTA:'];
        $lines[] = '- Total fasilitas terpetakan: '.PublicFacility::count().' unit.';

        foreach (FacilityCategory::withCount('facilities')->get() as $category) {
            $lines[] = "- Kategori {$category->name}: {$category->facilities_count} unit.";
        }

        $query = PublicFacility::with(['region:id,name', 'category:id,name'])->orderBy('name');

        if (Str::contains($lower, ['sekolah', 'sma', 'smk', 'smp', 'sd ', 'dapodik'])) {
            $query->whereHas('category', fn (Builder $categoryQuery) => $categoryQuery->where('name', 'like', '%Sekolah%'));
        } elseif (Str::contains($lower, ['pasar'])) {
            $query->whereHas('category', fn (Builder $categoryQuery) => $categoryQuery->where('name', 'like', '%Pasar%'));
        }

        if (Str::contains($lower, ['disabilitas', 'ramah', 'aksesibilitas', 'ramp', 'kursi roda', 'tactile', 'toilet'])) {
            $this->applyAccessibilityFilter($query, $lower);
        }

        $keywords = $this->extractKeywords($lower);
        if ($keywords !== []) {
            $query->where(function (Builder $keywordQuery) use ($keywords): void {
                foreach ($keywords as $keyword) {
                    $keywordQuery->orWhere('name', 'like', "%{$keyword}%");
                }
            });
        }

        $facilities = $query->take(10)->get();
        $this->appendFacilityLines($lines, $citations, $facilities, 'Fasilitas yang sesuai dengan pertanyaan');

        return [$lines];
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildGeneralContext(array &$citations): array
    {
        $totalFacilities = PublicFacility::count();
        $accessibleCount = PublicFacility::where(function (Builder $query): void {
            $query->where('has_wheelchair_ramp', true)
                ->orWhere('has_tactile_paving', true)
                ->orWhere('has_disabled_toilet', true);
        })->count();
        $accessiblePercentage = $totalFacilities > 0 ? round(($accessibleCount / $totalFacilities) * 100, 1) : 0.0;

        $totalBudget = (float) BudgetProject::sum('budget_allocated');
        $realizedBudget = (float) BudgetProject::sum('budget_realized');
        $realizationRate = $totalBudget > 0 ? round(($realizedBudget / $totalBudget) * 100, 2) : 0.0;
        $totalProjects = BudgetProject::count();
        $fiscalYears = BudgetProject::query()->distinct()->orderBy('fiscal_year')->pluck('fiscal_year');

        $lines = ['DATA MAKRO TRANSPARANSI DKI JAKARTA (TERAPUBLIC 2026):'];
        $lines[] = "- Total fasilitas terpetakan: {$totalFacilities} unit (Sekolah Dapodik & Pasar Tradisional Pasar Jaya).";
        $lines[] = "- Fasilitas dengan fitur ramah disabilitas: {$accessibleCount} unit ({$accessiblePercentage}%).";
        $lines[] = "- Total proyek belanja modal APBD fisik: {$totalProjects} paket.";
        $lines[] = '- Total alokasi anggaran belanja modal: Rp '.number_format($totalBudget).' (Terealisasi: Rp '.number_format($realizedBudget).", Serapan: {$realizationRate}%).";
        if ($fiscalYears->isNotEmpty()) {
            $lines[] = '- Tahun anggaran tersedia: '.$fiscalYears->implode(', ').'.';
        }
        $lines[] = '- Machine Learning K-Means: Membagi 44 kecamatan ke dalam 3 kluster urgensi (Kritis, Moderat, dan Stabil).';

        $citations[] = 'Basis Data Agregat TeraPublic DKI Jakarta 2026';

        return [$lines];
    }

    /**
     * @param  array<int, string>  $citations
     * @return array{0: array<int, string>}
     */
    protected function buildRegionContext(Region $region, string $intent, string $lower, array &$citations): array
    {
        $lines = ["DATA WILAYAH: Kecamatan {$region->name} ({$region->city})"];
        $lines[] = '- Jumlah penduduk (BPS 2024): '.number_format((int) $region->population).' jiwa.';

        $metric = EquityMetric::where('region_id', $region->id)->first();
        if ($metric) {
            $status = $metric->is_underserved ? 'Perlu intervensi tambahan (defisit akses)' : 'Memadai / stabil';
            $lines[] = "- Rasio fasilitas per 10.000 penduduk: {$metric->ratio_per_10k_population}.";
            $lines[] = "- Indeks aksesibilitas disabilitas: {$metric->accessibility_score}% ({$status}).";
        }

        if ($intent === self::INTENT_ACCESSIBILITY) {
            $facilityQuery = PublicFacility::with('region:id,name')
                ->where('region_id', $region->id)
                ->orderBy('name');
            $this->applyAccessibilityFilter($facilityQuery, $lower);
            $facilities = $facilityQuery->take(10)->get();
            $this->appendFacilityLines($lines, $citations, $facilities, 'Fasilitas di wilayah ini');
        } elseif ($intent === self::INTENT_BUDGET) {
            $this->appendBudgetSummary($lines, $region);
            $budgets = BudgetProject::with('region:id,name')
                ->where('region_id', $region->id)
                ->orderByDesc('budget_allocated')
                ->take(6)
                ->get();
            $this->appendBudgetLines($lines, $citations, $budgets, 'Proyek dengan alokasi terbesar di wilayah ini');
        } elseif ($intent === self::INTENT_FACILITY) {
            $facilities = PublicFacility::with('region:id,name')
                ->where('region_id', $region->id)
                ->orderBy('name')
                ->take(10)
                ->get();
            $this->appendFacilityLines($lines, $citations, $facilities, 'Fasilitas publik terpetakan di wilayah ini');
        } else {
            $facilities = PublicFacility::with('region:id,name')
                ->where('region_id', $region->id)
                ->orderBy('name')
                ->take(4)
                ->get();
            $this->appendFacilityLines($lines, $citations, $facilities, 'Contoh fasilitas publik di wilayah ini');

            $budgets = BudgetProject::with('region:id,name')
                ->where('region_id', $region->id)
                ->orderByDesc('budget_allocated')
                ->take(3)
                ->get();
            $this->appendBudgetLines($lines, $citations, $budgets, 'Contoh proyek APBD di wilayah ini');
        }

        return [$lines];
    }

    /**
     * @param  array<int, string>  $lines
     * @param  array<int, string>  $citations
     */
    protected function appendFacilityLines(array &$lines, array &$citations, Collection $facilities, string $heading): void
    {
        if ($facilities->isEmpty()) {
            $lines[] = "{$heading}: tidak ada data fasilitas yang cocok di basis data.";

            return;
        }

        $lines[] = "{$heading}:";
        foreach ($facilities as $facility) {
            $regionName = $facility->region?->name;
            $location = $regionName ? " (Kecamatan {$regionName})" : '';
            $lines[] = " * {$facility->name}{$location} — {$this->facilityFeatures($facility)}";
            $citations[] = "Fasilitas: {$facility->name}";
        }
    }

    /**
     * @param  array<int, string>  $lines
     * @param  array<int, string>  $citations
     */
    protected function appendBudgetLines(array &$lines, array &$citations, Collection $budgets, string $heading): void
    {
        if ($budgets->isEmpty()) {
            $lines[] = "{$heading}: tidak ada data proyek yang cocok di basis data.";

            return;
        }

        $lines[] = "{$heading}:";
        foreach ($budgets as $budget) {
            $regionName = $budget->region?->name;
            $location = $regionName ? " (Kecamatan {$regionName})" : '';
            $lines[] = ' * '.Str::limit($budget->project_name, 80).$location
                ." — Tahun {$budget->fiscal_year}, Alokasi Rp ".number_format((float) $budget->budget_allocated)
                .', Realisasi Rp '.number_format((float) $budget->budget_realized)
                ." (Progres {$budget->progress_percentage}%, Status: {$budget->status})";
            $citations[] = 'Proyek APBD: '.Str::limit($budget->project_name, 50);
        }
    }

    /**
     * @param  array<int, string>  $lines
     */
    protected function appendBudgetSummary(array &$lines, ?Region $region = null): void
    {
        $query = BudgetProject::query();

        if ($region) {
            $query->where('region_id', $region->id);
        }

        $total = (float) (clone $query)->sum('budget_allocated');
        $realized = (float) (clone $query)->sum('budget_realized');
        $count = (clone $query)->count();
        $rate = $total > 0 ? round(($realized / $total) * 100, 2) : 0.0;
        $years = (clone $query)->distinct()->orderBy('fiscal_year')->pluck('fiscal_year');

        $lines[] = $region
            ? "RINGKASAN ANGGARAN Kecamatan {$region->name}:"
            : 'RINGKASAN ANGGARAN APBD DKI JAKARTA:';
        $lines[] = "- Total paket proyek: {$count}.";
        $lines[] = '- Total alokasi: Rp '.number_format($total).'.';
        $lines[] = '- Total realisasi: Rp '.number_format($realized)." (Serapan: {$rate}%).";
        if ($years->isNotEmpty()) {
            $lines[] = '- Tahun anggaran tersedia: '.$years->implode(', ').'.';
        }
    }

    protected function facilityFeatures(PublicFacility $facility): string
    {
        $features = [];

        if ($facility->has_wheelchair_ramp) {
            $features[] = 'Ramp Kursi Roda';
        }
        if ($facility->has_tactile_paving) {
            $features[] = 'Ubin Pemandu (Tactile Paving)';
        }
        if ($facility->has_disabled_toilet) {
            $features[] = 'Toilet Disabilitas';
        }

        return $features === [] ? 'belum terverifikasi ramah disabilitas' : implode(', ', $features);
    }

    /**
     * Decide whether the question asks for facilities that have or lack accessibility features.
     */
    protected function accessibilityFilterDirection(string $lower): ?bool
    {
        if (Str::contains($lower, ['belum', 'tidak memiliki', 'tidak punya', 'tanpa', 'tidak ada', 'kurang', 'minim'])) {
            return false;
        }

        if (Str::contains($lower, ['sudah', 'punya', 'memiliki', 'tersedia', 'dilengkapi', 'ramah disabilitas'])) {
            return true;
        }

        return null;
    }

    protected function applyAccessibilityFilter(Builder $query, string $lower): void
    {
        $direction = $this->accessibilityFilterDirection($lower);

        if ($direction === null) {
            return;
        }

        $features = [];
        if (Str::contains($lower, ['ramp', 'kursi roda'])) {
            $features[] = 'has_wheelchair_ramp';
        }
        if (Str::contains($lower, ['tactile', 'ubin pemandu'])) {
            $features[] = 'has_tactile_paving';
        }
        if (Str::contains($lower, ['toilet'])) {
            $features[] = 'has_disabled_toilet';
        }

        if ($features === []) {
            if ($direction) {
                $query->where(function (Builder $featureQuery): void {
                    $featureQuery->where('has_wheelchair_ramp', true)
                        ->orWhere('has_tactile_paving', true)
                        ->orWhere('has_disabled_toilet', true);
                });
            } else {
                $query->where('has_wheelchair_ramp', false)
                    ->where('has_tactile_paving', false)
                    ->where('has_disabled_toilet', false);
            }

            return;
        }

        foreach ($features as $feature) {
            $query->where($feature, $direction);
        }
    }

    /**
     * @return array<int, string>
     */
    protected function extractKeywords(string $lower): array
    {
        preg_match_all('/[a-z]{4,}/', $lower, $matches);

        $stopwords = [
            'yang', 'dan', 'atau', 'untuk', 'dengan', 'dari', 'pada', 'adalah', 'apa',
            'bagaimana', 'berapa', 'mana', 'kecamatan', 'kelurahan', 'kota', 'jakarta',
            'tahun', 'terbaru', 'paling', 'membutuhkan', 'butuh', 'fasilitas', 'sekolah',
            'pasar', 'anggaran', 'proyek', 'data', 'info', 'informasi', 'tolong',
            'sebutkan', 'daftar', 'status', 'realisasi', 'alokasi', 'serapan', 'belanja',
            'total', 'semua', 'saat', 'ini', 'itu', 'bisa', 'apakah', 'mengenai',
            'terkait', 'detail', 'rinci', 'contoh', 'mohon', 'bantu', 'jelaskan',
            'terhadap', 'dalam', 'oleh', 'sebagai', 'akan', 'sudah', 'belum', 'tidak',
            'punya', 'memiliki', 'ada', 'tersedia', 'unit', 'paket', 'wilayah',
            'daerah', 'pemerintah', 'provinsi',
        ];

        return array_slice(array_values(array_unique(array_diff($matches[0], $stopwords))), 0, 4);
    }

    /**
     * Send prompt to Google Gemini API with custom instructions.
     *
     * @param  array<string, mixed>  $context
     */
    protected function callGeminiApi(string $question, array $context, string $apiKey, ?string $citizenName): ?string
    {
        $model = config('services.gemini.model', 'gemini-2.5-flash');
        $timeout = (int) config('services.gemini.timeout', 12);

        try {
            $systemInstruction = "Anda adalah Asisten Informasi Publik TeraPublic DKI Jakarta, platform transparansi fasilitas publik, aksesibilitas disabilitas, dan anggaran APBD untuk kompetisi Web In Action (WIA) MIA 2026.\n".
                "Tugas Anda adalah melayani dan menjawab pertanyaan warga masyarakat dengan ramah, transparan, faktual, dan objektif berdasarkan Data Konteks Resmi berikut ini:\n\n".
                $context['raw_text']."\n\n".
                "Jenis pertanyaan (intent): {$context['intent']}.\n".
                "Pedoman Menjawab:\n".
                "1. Jawab langsung inti pertanyaan warga pada kalimat pertama, lalu jelaskan singkat.\n".
                "2. Gunakan fakta, persentase, dan nominal rupiah yang tertera pada konteks di atas.\n".
                "3. Jangan mengulang seluruh data makro jika tidak relevan dengan pertanyaan.\n".
                "4. Jika data spesifik yang ditanyakan warga belum tersedia di basis data, sampaikan secara terbuka dan arahkan warga untuk mengirimkan laporan aduan melalui formulir 'Aduan Warga'.\n".
                '5. Susun jawaban secara terstruktur menggunakan Markdown yang rapi (bullet points, bolding penting).';

            $prompt = ($citizenName ? "Nama Penanya: {$citizenName}\n" : '')."Pertanyaan Warga: {$question}";

            $response = Http::connectTimeout(5)
                ->timeout($timeout)
                ->acceptJson()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
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
                        'temperature' => 0.2, // Low temperature for high factual accuracy
                        'maxOutputTokens' => 900,
                    ],
                ]);

            if ($response->successful()) {
                $candidates = $response->json('candidates');
                if (! empty($candidates[0]['content']['parts'][0]['text'])) {
                    return trim($candidates[0]['content']['parts'][0]['text']);
                }

                Log::warning('Gemini RAG returned no text candidate', [
                    'intent' => $context['intent'],
                    'finish_reason' => $candidates[0]['finishReason'] ?? null,
                ]);

                return null;
            }

            Log::warning('Gemini RAG request failed', [
                'status' => $response->status(),
                'intent' => $context['intent'],
                'body' => Str::limit($response->body(), 300),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Gemini RAG request threw an exception', [
                'intent' => $context['intent'],
                'message' => $e->getMessage(),
            ]);
        }

        return null;
    }

    /**
     * Deterministic Local Synthesizer when Gemini API is unavailable or offline.
     *
     * @param  array<string, mixed>  $context
     */
    protected function generateLocalRAGAnswer(string $question, array $context, ?string $citizenName): string
    {
        $greeting = $citizenName
            ? "Halo Bapak/Ibu {$citizenName}, terima kasih telah menghubungi Asisten Publik TeraPublic."
            : 'Halo, terima kasih telah menghubungi Asisten Publik TeraPublic.';

        $intro = match ($context['intent'] ?? self::INTENT_GENERAL) {
            self::INTENT_TICKET => 'Berikut status tiket aduan Anda berdasarkan data TeraPublic:',
            self::INTENT_DISTRICT_RANKING => 'Berikut kecamatan yang paling membutuhkan perhatian berdasarkan rasio fasilitas dan skor aksesibilitas:',
            self::INTENT_ACCESSIBILITY => 'Berikut data aksesibilitas fasilitas yang relevan dengan pertanyaan Anda:',
            self::INTENT_BUDGET => 'Berikut ringkasan anggaran yang relevan dengan pertanyaan Anda:',
            self::INTENT_FACILITY => 'Berikut data fasilitas publik yang relevan dengan pertanyaan Anda:',
            default => 'Berikut data resmi yang tersedia di TeraPublic DKI Jakarta:',
        };

        $body = $intro."\n\n".$context['raw_text'];

        if ($context['matched_region']) {
            $body .= "\n\n💡 **Transparansi Berkelanjutan**: Apabila Anda menemukan kendala aksesibilitas disabilitas atau keterlambatan proyek di Kecamatan {$context['matched_region']}, Anda dapat langsung mengirimkan laporan resmi melalui menu **Aduan Warga** pada platform ini.";
        } else {
            $body .= "\n\n💡 **Tips**: Anda dapat menanyakan informasi spesifik seperti: *'Bagaimana fasilitas sekolah di Kecamatan Menteng?'*, *'Berapa anggaran di Kecamatan Gambir?'*, atau melacak nomor tiket aduan Anda (contoh: *'Cek status tiket TP-2026-0001'*).";
        }

        return "{$greeting}\n\n{$body}";
    }
}
