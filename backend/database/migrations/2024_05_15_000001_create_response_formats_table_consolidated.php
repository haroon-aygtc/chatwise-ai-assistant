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
        // Skip if table already exists
        if (Schema::hasTable('response_formats')) {
            return;
        }

        Schema::create('response_formats', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('format');
            $table->string('length');
            $table->string('tone');
            $table->text('content')->nullable();
            $table->text('system_instructions')->nullable();
            $table->boolean('is_default')->default(false);
            $table->json('options');
            $table->json('parameters')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table to avoid conflicts with other migrations
        // Schema::dropIfExists('response_formats');
    }
};
