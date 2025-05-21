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
        if (Schema::hasTable('system_prompts')) {
            return;
        }

        Schema::create('system_prompts', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->integer('version')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table to avoid conflicts with other migrations
        // Schema::dropIfExists('system_prompts');
    }
};
