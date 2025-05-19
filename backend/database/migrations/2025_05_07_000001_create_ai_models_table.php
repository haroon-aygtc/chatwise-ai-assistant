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
        Schema::create('ai_models', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('provider');
            $table->string('version');
            $table->text('description')->nullable();
            $table->text('api_key')->nullable();
            $table->string('base_url')->nullable();
            $table->string('model_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_public')->default(false);
            $table->float('temperature')->nullable();
            $table->integer('max_tokens')->nullable();
            $table->json('configuration')->nullable();
            $table->json('context')->nullable();
            $table->json('capabilities')->nullable();
            $table->float('price_per_token')->nullable();
            $table->integer('context_size')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_models');
    }
};
