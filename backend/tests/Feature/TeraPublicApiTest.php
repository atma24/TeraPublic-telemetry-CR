<?php

namespace Tests\Feature;

use App\Models\PublicFacility;
use App\Models\User;
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

    public function test_ml_analytics_clustering_endpoint_returns_k_means_clusters(): void
    {
        $response = $this->getJson('/api/analytics/ml-clustering');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('algorithm', 'K-Means Multi-Dimensional Clustering')
            ->assertJsonStructure([
                'status',
                'algorithm',
                'model_metadata' => [
                    'k',
                    'features',
                    'total_districts_analyzed',
                ],
                'summary' => [
                    'critical_count',
                    'moderate_count',
                    'stable_count',
                    'anomalies_detected',
                ],
                'clusters',
                'policy_recommendations',
            ]);

        $this->assertEquals(3, count($response->json('clusters')));
    }

    public function test_dashboard_overview_endpoint_returns_kpis(): void
    {
        $response = $this->getJson('/api/dashboard/overview');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data' => [
                    'kpis' => [
                        'total_facilities',
                        'accessible_facilities',
                        'accessibility_percentage',
                        'total_budget_allocated',
                        'total_budget_realized',
                        'realization_percentage',
                        'total_projects',
                        'total_districts',
                        'underserved_districts',
                    ],
                    'top_underserved',
                    'city_breakdown',
                ],
            ]);
    }

    public function test_dashboard_budget_predictions_endpoint_returns_ml_forecasts(): void
    {
        $response = $this->getJson('/api/dashboard/budget-predictions');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'model',
                'models_applied',
                'time_series_forecast' => [
                    'historical_months',
                    'forecasted_months',
                    'year_end_summary' => [
                        'fiscal_year',
                        'total_allocated',
                        'predicted_total_realized',
                        'predicted_absorption_percentage',
                    ],
                ],
                'district_absorption_risks' => [
                    'summary' => [
                        'total_districts',
                        'high_risk_count',
                        'medium_risk_count',
                        'low_risk_count',
                    ],
                    'rankings',
                ],
                'budget_2027_recommendations' => [
                    'fiscal_year_target',
                    'total_target_pool',
                    'top_priority_districts',
                ],
                'policy_insights',
            ]);
    }

    public function test_full_dashboard_endpoint_returns_combined_payload(): void
    {
        $response = $this->getJson('/api/dashboard');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'dashboard_overview',
                'apbd_ml_predictions',
                'district_clustering',
            ]);
    }

    public function test_unauthenticated_user_cannot_submit_feedback(): void
    {
        $response = $this->postJson('/api/feedback', [
            'title' => 'Laporan Anonim',
            'description' => 'Mencoba lapor tanpa login',
            'category' => 'damage',
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_citizen_can_submit_and_view_my_feedbacks(): void
    {
        $citizen = User::where('email', 'warga@terapublic.jakarta.go.id')->first();
        $token = $citizen->createToken('test-token')->plainTextToken;
        $facility = PublicFacility::first();

        $payload = [
            'facility_id' => $facility ? $facility->id : null,
            'title' => 'Ramp kursi roda tertutup lapak',
            'description' => 'Akses jalur ramp kursi roda di pintu timur terhalang lapak semi-permanen.',
            'category' => 'disability_access',
            'latitude' => -6.1751,
            'longitude' => 106.8441,
        ];

        $postResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/feedback', $payload);

        $postResponse->assertStatus(201)
            ->assertJsonPath('status', 'success');

        $trackingCode = $postResponse->json('data.tracking_code');
        $this->assertNotEmpty($trackingCode);
        $this->assertStringStartsWith('TP-', $trackingCode);

        // Citizen views their submitted feedbacks
        $myFeedbacksResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/citizen/feedbacks');

        $myFeedbacksResponse->assertStatus(200)
            ->assertJsonPath('status', 'success');

        $this->assertGreaterThan(0, $myFeedbacksResponse->json('total'));

        // Public can track feedback by code
        $trackResponse = $this->getJson("/api/feedback/track/{$trackingCode}");
        $trackResponse->assertStatus(200)
            ->assertJsonPath('data.tracking_code', $trackingCode)
            ->assertJsonPath('data.title', $payload['title']);
    }

    public function test_citizen_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Siti Rahma',
            'email' => 'siti@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.user.role', 'citizen')
            ->assertJsonStructure(['data' => ['access_token']]);
    }

    public function test_admin_can_login_and_crud_master_data(): void
    {
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'admin@terapublic.jakarta.go.id',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('data.user.role', 'admin');

        $token = $loginResponse->json('data.access_token');
        $headers = ['Authorization' => 'Bearer '.$token];

        // 1. Create facility
        $facilityResponse = $this->withHeaders($headers)
            ->postJson('/api/admin/facilities', [
                'category_id' => 1,
                'region_id' => 1,
                'name' => 'SDN Unggulan Menteng',
                'latitude' => -6.18,
                'longitude' => 106.83,
                'status' => 'operational',
            ]);
        $facilityResponse->assertStatus(201);
        $facilityId = $facilityResponse->json('data.id');

        // 2. Create budget project
        $budgetResponse = $this->withHeaders($headers)
            ->postJson('/api/admin/budget-projects', [
                'region_id' => 1,
                'facility_id' => $facilityId,
                'project_name' => 'Renovasi Toilet Disabilitas SDN Unggulan',
                'fiscal_year' => 2026,
                'funding_source' => 'APBD DKI',
                'budget_allocated' => 150000000,
                'status' => 'planning',
            ]);
        $budgetResponse->assertStatus(201);

        // 3. View all citizen feedbacks
        $feedbackListResponse = $this->withHeaders($headers)
            ->getJson('/api/admin/feedbacks');
        $feedbackListResponse->assertStatus(200);
    }

    public function test_citizen_cannot_access_admin_routes(): void
    {
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'warga@terapublic.jakarta.go.id',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('data.user.role', 'citizen');

        $token = $loginResponse->json('data.access_token');

        // Citizen trying to access admin endpoint
        $forbiddenResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/admin/facilities', [
                'category_id' => 1,
                'region_id' => 1,
                'name' => 'Unauthorized School',
                'latitude' => -6.18,
                'longitude' => 106.83,
                'status' => 'operational',
            ]);

        $forbiddenResponse->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    public function test_authenticated_user_can_chat_with_ai_assistant(): void
    {
        $citizen = User::where('email', 'warga@terapublic.jakarta.go.id')->first();
        $token = $citizen->createToken('ai-test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/assistant/chat', [
                'message' => 'Bagaimana kondisi fasilitas dan sekolah di Kecamatan Menteng?',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'engine',
                'answer',
                'citations',
            ]);

        $this->assertNotEmpty($response->json('answer'));
    }
}
