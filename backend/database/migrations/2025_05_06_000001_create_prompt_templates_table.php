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
        // Skip this migration as the table was already created in 2024_05_06_000005_create_prompt_templates_table.php
        if (Schema::hasTable('prompt_templates')) {
            // The table already exists, no need to create it again
            return;
        }

        // This code should never run since the table should already exist,
        // but we'll keep it as a fallback
        Schema::create('prompt_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('template');
            $table->json('variables')->nullable();
            $table->string('category')->default('general');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('usage_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do nothing as we didn't create the table in this migration
    }
};
