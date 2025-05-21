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
        Schema::create('data_sources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->json('configuration')->nullable();
            $table->boolean('isActive')->default(true);
            $table->integer('priority')->default(5);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('data_source_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->boolean('enabled')->default(true);
            $table->enum('priority', ['low', 'medium', 'high', 'exclusive'])->default('medium');
            $table->boolean('includeCitation')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_sources');
        Schema::dropIfExists('data_source_settings');
    }
};