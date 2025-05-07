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
        Schema::create('model_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('apiKeyName');
            $table->boolean('apiKeyRequired')->default(true);
            $table->boolean('baseUrlRequired')->default(false);
            $table->string('baseUrlName')->nullable();
            $table->boolean('isActive')->default(true);
            $table->string('logoUrl')->nullable();
            $table->timestamps();
        });

        // Add foreign key to ai_models table
        Schema::table('ai_models', function (Blueprint $table) {
            $table->foreignId('provider_id')->nullable()->after('provider')
                ->constrained('model_providers')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_models', function (Blueprint $table) {
            $table->dropConstrainedForeignId('provider_id');
        });
        Schema::dropIfExists('model_providers');
    }
};
