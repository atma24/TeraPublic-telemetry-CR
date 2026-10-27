<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budget_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facility_id')->nullable()->constrained('public_facilities')->nullOnDelete();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->string('project_name');
            $table->unsignedSmallInteger('fiscal_year')->default(2026);
            $table->string('funding_source')->default('APBD_DKI'); // APBN, APBD_DKI, DAK
            $table->decimal('budget_allocated', 15, 2);
            $table->decimal('budget_realized', 15, 2)->default(0);
            $table->string('status')->default('in_progress'); // planning, procurement, in_progress, completed
            $table->string('contractor_name')->nullable();
            $table->date('start_date')->nullable();
            $table->date('target_completion_date')->nullable();
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->json('progress_reports')->nullable();
            $table->timestamps();

            $table->index(['fiscal_year', 'funding_source']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_projects');
    }
};
