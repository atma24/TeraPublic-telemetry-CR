<?php

namespace Tests\Feature;

use App\Models\CitizenFeedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CitizenFeedbackMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_citizen_feedbacks_table_has_confirmations_count_column(): void
    {
        $this->assertTrue(Schema::hasColumn('citizen_feedbacks', 'confirmations_count'));
    }

    public function test_citizen_feedback_model_casts_confirmations_count_to_integer(): void
    {
        $feedback = new CitizenFeedback(['confirmations_count' => '5']);
        $this->assertSame(5, $feedback->confirmations_count);
    }
}
