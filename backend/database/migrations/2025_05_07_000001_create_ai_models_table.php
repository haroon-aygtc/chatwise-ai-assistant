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
            $table->id();
            $table->string('name');
            $table->string('provider');
            $table->string('modelId');
            $table->text('apiKey')->nullable();
            $table->string('baseUrl')->nullable();
            $table->boolean('isActive')->default(true);
            $table->boolean('isDefault')->default(false);
            $table->json('capabilities')->nullable();
            $table->decimal('pricePerToken', 10, 8)->default(0);
            $table->integer('contextSize')->default(4096);
            $table->timestamps();
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
