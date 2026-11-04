<?php

namespace Tests\Feature;

use App\Models\BudgetProject;
use App\Models\CitizenFeedback;
use App\Models\EquityMetric;
use App\Models\FacilityCategory;
use App\Models\PublicFacility;
use App\Models\Region;
use App\Services\AiAssistantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AssistantTest extends TestCase
{
    use RefreshDatabase;

    private AiAssistantService $assistant;

    private Region $menteng;

    private Region $gambir;

    private FacilityCategory $schoolCategory;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.gemini.key' => null,
            'services.gemini.model' => 'gemini-2.5-flash',
            'services.gemini.timeout' => 5,
        ]);

        $this->assistant = app(AiAssistantService::class);

        $this->schoolCategory = FacilityCategory::create([
            'name' => 'Sekolah',
            'slug' => 'sekolah',
        ]);

        $pasarCategory = FacilityCategory::create([
            'name' => 'Pasar Tradisional',
            'slug' => 'pasar-tradisional',
        ]);

        $this->menteng = Region::create([
            'code' => '317101',
            'name' => 'MENTENG',
            'city' => 'Kota Jakarta Pusat',
            'level' => 'district',
            'population' => 10000,
            'area_km2' => 6.5,
        ]);

        $this->gambir = Region::create([
            'code' => '317102',
            'name' => 'GAMBIR',
            'city' => 'Kota Jakarta Pusat',
            'level' => 'district',
            'population' => 10000,
            'area_km2' => 7.5,
        ]);

        PublicFacility::create([
            'category_id' => $this->schoolCategory->id,
            'region_id' => $this->menteng->id,
            'name' => 'SMAN 1 MENTENG',
            'sub_category' => 'SMA',
            'latitude' => -6.2,
            'longitude' => 106.8,
            'has_wheelchair_ramp' => false,
            'has_tactile_paving' => false,
            'has_disabled_toilet' => false,
        ]);

        PublicFacility::create([
            'category_id' => $this->schoolCategory->id,
            'region_id' => $this->menteng->id,
            'name' => 'SMAN 2 MENTENG',
            'sub_category' => 'SMA',
            'latitude' => -6.21,
            'longitude' => 106.81,
            'has_wheelchair_ramp' => true,
            'has_tactile_paving' => true,
            'has_disabled_toilet' => true,
        ]);

        PublicFacility::create([
            'category_id' => $pasarCategory->id,
            'region_id' => $this->menteng->id,
            'name' => 'PASAR MENTENG',
            'sub_category' => 'Pasar Rakyat',
            'latitude' => -6.22,
            'longitude' => 106.82,
        ]);

        PublicFacility::create([
            'category_id' => $this->schoolCategory->id,
            'region_id' => $this->gambir->id,
            'name' => 'SMAN 3 GAMBIR',
            'sub_category' => 'SMA',
            'latitude' => -6.17,
            'longitude' => 106.83,
            'has_wheelchair_ramp' => true,
        ]);

        BudgetProject::create([
            'region_id' => $this->menteng->id,
            'project_name' => 'Revitalisasi Sekolah Menteng',
            'fiscal_year' => 2026,
            'budget_allocated' => 1000000000,
            'budget_realized' => 250000000,
            'status' => 'in_progress',
            'progress_percentage' => 25,
        ]);

        BudgetProject::create([
            'region_id' => $this->gambir->id,
            'project_name' => 'Pembangunan Pasar Gambir',
            'fiscal_year' => 2025,
            'budget_allocated' => 2000000000,
            'budget_realized' => 500000000,
            'status' => 'in_progress',
            'progress_percentage' => 40,
        ]);

        EquityMetric::create([
            'region_id' => $this->menteng->id,
            'facility_count' => 3,
            'ratio_per_10k_population' => 3.0,
            'accessibility_score' => 66.67,
            'equity_index' => 80,
            'is_underserved' => true,
        ]);

        EquityMetric::create([
            'region_id' => $this->gambir->id,
            'facility_count' => 1,
            'ratio_per_10k_population' => 1.0,
            'accessibility_score' => 100,
            'equity_index' => 100,
            'is_underserved' => false,
        ]);

        CitizenFeedback::create([
            'facility_id' => null,
            'tracking_code' => 'TP-2026-TEST',
            'citizen_name' => 'Warga Uji',
            'title' => 'Ramp sekolah rusak',
            'description' => 'Ramp kursi roda di sekolah ini rusak dan tidak bisa digunakan.',
            'category' => 'disability_access',
            'status' => 'in_review',
            'admin_response' => 'Sedang diperiksa oleh suku dinas pendidikan.',
        ]);
    }

    public function test_different_questions_produce_different_intents_and_answers(): void
    {
        $budget = $this->assistant->ask('Bagaimana realisasi anggaran tahun ini?', 'Budi');
        $accessibility = $this->assistant->ask('Sekolah mana yang belum memiliki ramp kursi roda?', 'Budi');

        $this->assertSame('budget', $budget['intent']);
        $this->assertSame('accessibility', $accessibility['intent']);
        $this->assertNotSame($budget['answer'], $accessibility['answer']);
        $this->assertStringContainsString('Revitalisasi Sekolah Menteng', $budget['answer']);
        $this->assertStringContainsString('SMAN 1 MENTENG', $accessibility['answer']);
        $this->assertStringNotContainsString('SMAN 2 MENTENG', $accessibility['answer']);
    }

    public function test_region_question_returns_region_specific_context(): void
    {
        $result = $this->assistant->ask('Bagaimana kondisi akses disabilitas fasilitas publik di Kecamatan Menteng?', 'Budi');

        $this->assertSame('accessibility', $result['intent']);
        $this->assertSame('MENTENG', $result['matched_region']);
        $this->assertStringContainsString('SMAN 1 MENTENG', $result['answer']);
        $this->assertStringContainsString('Rasio fasilitas per 10.000 penduduk', $result['answer']);
    }

    public function test_district_ranking_puts_the_lowest_ratio_first(): void
    {
        $result = $this->assistant->ask('Kecamatan mana yang paling membutuhkan fasilitas sekolah?', 'Budi');

        $this->assertSame('district_ranking', $result['intent']);
        $this->assertLessThan(
            strpos($result['answer'], 'Kecamatan MENTENG'),
            strpos($result['answer'], 'Kecamatan GAMBIR')
        );
    }

    public function test_ticket_tracking_returns_the_ticket_status(): void
    {
        $result = $this->assistant->ask('Cek status tiket TP-2026-TEST', 'Budi');

        $this->assertSame('ticket', $result['intent']);
        $this->assertStringContainsString('TP-2026-TEST', $result['answer']);
        $this->assertStringContainsString('in_review', $result['answer']);
        $this->assertStringContainsString('Sedang diperiksa oleh suku dinas pendidikan.', $result['answer']);
    }

    public function test_gemini_receives_the_retrieved_context(): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::preventStrayRequests();
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    ['content' => ['parts' => [['text' => 'Jawaban dari Gemini']]]],
                ],
            ]),
        ]);

        $result = $this->assistant->ask('Sekolah mana yang belum memiliki ramp kursi roda?', 'Budi');

        $this->assertSame('Jawaban dari Gemini', $result['answer']);
        $this->assertSame('gemini-2.5-flash-rag', $result['engine']);

        Http::assertSent(function (Request $request): bool {
            return str_contains($request->body(), 'SMAN 1 MENTENG')
                && str_contains($request->body(), 'Jenis pertanyaan (intent): accessibility');
        });
    }

    public function test_gemini_failure_falls_back_to_the_local_answer(): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::preventStrayRequests();
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => 'overloaded'], 503),
        ]);

        $result = $this->assistant->ask('Sekolah mana yang belum memiliki ramp kursi roda?', 'Budi');

        $this->assertSame('terapublic-rag-local', $result['engine']);
        $this->assertStringContainsString('SMAN 1 MENTENG', $result['answer']);
    }

    public function test_cache_is_scoped_per_citizen_name(): void
    {
        config(['services.gemini.key' => 'test-key']);
        Http::preventStrayRequests();
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    ['content' => ['parts' => [['text' => 'Jawaban dari Gemini']]]],
                ],
            ]),
        ]);

        $this->assistant->ask('Apa itu TeraPublic?', 'Budi');
        $this->assistant->ask('Apa itu TeraPublic?', 'Sari');

        // Two different names must not share one cache entry.
        Http::assertSentCount(2);

        $cached = $this->assistant->ask('Apa itu TeraPublic?', 'Sari');

        Http::assertSentCount(2);
        $this->assertSame('cache', $cached['source']);
    }
}
