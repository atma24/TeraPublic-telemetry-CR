<?php

namespace Tests\Feature;

use App\Models\CitizenFeedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CitizenFeedbackPublicTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_overview_returns_disability_breakdown_counts(): void
    {
        $response = $this->getJson('/api/dashboard/overview');
        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'kpis' => ['ramp_count', 'tactile_count', 'toilet_count'],
            ],
        ]);
    }

    public function test_can_fetch_public_feedbacks_with_sanitized_pii(): void
    {
        CitizenFeedback::create([
            'tracking_code' => 'TP-2026-PUB01',
            'citizen_name' => 'John Doe',
            'citizen_email' => 'john.doe@example.com',
            'title' => 'Ramp SDN Rusak',
            'description' => 'Ramp kursi roda patah',
            'category' => 'damage',
            'status' => 'verified',
        ]);

        $response = $this->getJson('/api/feedbacks/public');
        $response->assertOk();
        $response->assertJsonStructure([
            'status',
            'data' => [
                '*' => ['id', 'tracking_code', 'title', 'category', 'status', 'confirmations_count'],
            ],
        ]);

        $content = $response->getContent();
        $this->assertStringNotContainsString('john.doe@example.com', $content);
        $this->assertStringNotContainsString('"citizen_email"', $content);
        $this->assertStringNotContainsString('"user_id"', $content);
    }

    public function test_public_feedbacks_excludes_unverified_and_rejected_statuses(): void
    {
        CitizenFeedback::create([
            'tracking_code' => 'TP-2026-SUB',
            'citizen_name' => 'Warga Satu',
            'title' => 'Belum Diverifikasi',
            'description' => 'Draft aduan',
            'category' => 'damage',
            'status' => 'submitted',
        ]);

        CitizenFeedback::create([
            'tracking_code' => 'TP-2026-REJ',
            'citizen_name' => 'Warga Dua',
            'title' => 'Ditolak',
            'description' => 'Aduan tidak valid',
            'category' => 'cleanliness',
            'status' => 'rejected',
        ]);

        $response = $this->getJson('/api/feedbacks/public');
        $response->assertOk();

        $content = $response->getContent();
        $this->assertStringNotContainsString('TP-2026-SUB', $content);
        $this->assertStringNotContainsString('TP-2026-REJ', $content);
    }

    public function test_can_confirm_citizen_feedback_urgency(): void
    {
        $feedback = CitizenFeedback::create([
            'tracking_code' => 'TP-2026-CONF1',
            'citizen_name' => 'Jane Citizen',
            'title' => 'Toilet Difabel Terkunci',
            'description' => 'Pintu toilet terkunci gembok',
            'category' => 'disability_access',
            'status' => 'verified',
            'confirmations_count' => 0,
        ]);

        $response = $this->postJson("/api/feedbacks/{$feedback->id}/confirm");
        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'confirmations_count' => 1,
        ]);

        $this->assertSame(1, $feedback->fresh()->confirmations_count);
    }

    public function test_confirm_feedback_with_invalid_id_returns_404(): void
    {
        $response = $this->postJson('/api/feedbacks/999999/confirm');
        $response->assertNotFound();
    }

    public function test_cannot_confirm_unverified_or_rejected_feedback(): void
    {
        $feedback = CitizenFeedback::create([
            'tracking_code' => 'TP-2026-UNVER',
            'citizen_name' => 'Warga Test',
            'title' => 'Belum diverifikasi',
            'description' => 'Status submitted',
            'category' => 'damage',
            'status' => 'submitted',
        ]);

        $response = $this->postJson("/api/feedbacks/{$feedback->id}/confirm");
        $response->assertNotFound();
    }
}
