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
        Schema::create('follow_up_suggestions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('text');
            $table->string('category');
            $table->string('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('trigger_conditions')->nullable();
            $table->timestamps();
        });

        Schema::create('follow_up_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(true);
            $table->integer('max_suggestions')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_up_suggestions');
        Schema::dropIfExists('follow_up_settings');
    }
};