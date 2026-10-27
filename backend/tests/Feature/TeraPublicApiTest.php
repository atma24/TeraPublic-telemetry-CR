<?php

namespace Tests\Feature;

use App\Models\PublicFacility;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeraPublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed initial data
        $this->seed();
    }

    public function test_api_ping_returns_success(): void
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('app', 'TeraPublic API');
    }

    public function test_can_list_facilities_with_pagination(): void
    {
        $response = $this->getJson('/api/facilities?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'latitude',
                        'longitude',
                        'has_wheelchair_ramp',
                        'category',
                        'region',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'total',
                ],
            ]);

        $this->assertGreaterThan(0, $response->json('meta.total'));
    }

    public function test_can_filter_facilities_by_disability_ramp(): void
    {
        $response = $this->getJson('/api/facilities?has_wheelchair_ramp=1');

        $response->assertStatus(200);
        $data = $response->json('data');
        foreach ($data as $item) {
            $this->assertTrue((bool) $item['has_wheelchair_ramp']);
        }
    }

    public function test_geojson_endpoint_returns_feature_collection(): void
    {
        $response = $this->getJson('/api/regions/geojson');

        $response->assertStatus(200)
            ->assertJsonPath('type', 'FeatureCollection')
            ->assertJsonStructure([
                'type',
                'features' => [
                    '*' => [
                        'type',
                        'properties' => [
                            'name',
                            'city',
                            'population',
                            'facility_count',
                            'ratio_per_10k',
                            'is_underserved',
                        ],
                    ],
                ],
            ]);
    }

    public function test_budget_projects_endpoint_returns_financial_summary(): void
    {
        $response = $this->getJson('/api/budget-projects');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'summary' => [
                    'total_projects',
                    'total_budget_allocated',
                    'total_budget_realized',
                    'realization_percentage',
                ],
                'data',
            ]);
    }

    public function test_equity_endpoint_ranks_underserved_districts(): void
    {
        $response = $this->getJson('/api/equity');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'summary' => [
                    'total_districts',
                    'underserved_count',
                    'adequate_count',
                ],
                'rankings',
            ]);
    }

    public function test_citizens_can_submit_and_track_feedback(): void
    {
        $facility = PublicFacility::first();

        $payload = [
            'facility_id' => $facility ? $facility->id : null,
            'citizen_name' => 'Budi Santoso',
            'citizen_email' => 'budi@example.com',
            'title' => 'Ramp kursi roda tertutup pedagang',
            'description' => 'Akses ramp kursi roda di pintu timur terhalang lapak semi-permanen.',
            'category' => 'disability_access',
            'latitude' => -6.1751,
            'longitude' => 106.8441,
        ];

        $postResponse = $this->postJson('/api/feedback', $payload);

        $postResponse->assertStatus(201)
            ->assertJsonPath('status', 'success');

        $trackingCode = $postResponse->json('data.tracking_code');
        $this->assertNotEmpty($trackingCode);
        $this->assertStringStartsWith('TP-', $trackingCode);

        // Track the ticket
        $trackResponse = $this->getJson("/api/feedback/track/{$trackingCode}");
        $trackResponse->assertStatus(200)
            ->assertJsonPath('data.tracking_code', $trackingCode)
            ->assertJsonPath('data.title', $payload['title']);
    }
}
