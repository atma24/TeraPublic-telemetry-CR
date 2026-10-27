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
        Schema::create('citizen_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('facility_id')->nullable()->constrained('public_facilities')->nullOnDelete();
            $table->string('tracking_code')->unique(); // e.g. TP-2026-0001
            $table->string('citizen_name');
            $table->string('citizen_email')->nullable();
            $table->string('title');
            $table->text('description');
            $table->string('category')->default('damage'); // damage, disability_access, project_delay, cleanliness
            $table->string('photo_url')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('status')->default('submitted'); // submitted, verified, in_review, resolved, rejected
            $table->text('admin_response')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index('tracking_code');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizen_feedbacks');
    }
};
