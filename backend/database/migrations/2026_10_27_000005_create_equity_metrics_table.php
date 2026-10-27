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
        Schema::create('equity_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('facility_categories')->nullOnDelete();
            $table->unsignedInteger('facility_count')->default(0);
            $table->decimal('ratio_per_10k_population', 8, 2)->default(0);
            $table->decimal('accessibility_score', 5, 2)->default(0);
            $table->decimal('equity_index', 5, 2)->default(0);
            $table->boolean('is_underserved')->default(false);
            $table->timestamps();

            $table->unique(['region_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equity_metrics');
    }
};
