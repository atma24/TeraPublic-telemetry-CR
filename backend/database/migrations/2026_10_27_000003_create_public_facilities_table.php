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
        Schema::create('public_facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('facility_categories')->cascadeOnDelete();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->string('name');
            $table->string('sub_category')->nullable(); // e.g. SD, SMP, SMA, SMK, Pasar Rakyat
            $table->string('npsn')->nullable()->index();
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('status')->default('operational'); // operational, renovation, closed
            $table->boolean('is_state_owned')->default(true);
            $table->unsignedInteger('capacity')->default(0);
            $table->boolean('has_wheelchair_ramp')->default(false);
            $table->boolean('has_tactile_paving')->default(false);
            $table->boolean('has_disabled_toilet')->default(false);
            $table->string('public_transport_nearby')->nullable();
            $table->json('additional_specs')->nullable();
            $table->timestamps();

            $table->index(['latitude', 'longitude']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('public_facilities');
    }
};
