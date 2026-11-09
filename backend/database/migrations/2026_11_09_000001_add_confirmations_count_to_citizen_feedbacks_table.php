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
        Schema::table('citizen_feedbacks', function (Blueprint $table) {
            $table->unsignedInteger('confirmations_count')->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citizen_feedbacks', function (Blueprint $table) {
            $table->dropColumn('confirmations_count');
        });
    }
};
