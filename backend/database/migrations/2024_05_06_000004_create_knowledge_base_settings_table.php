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
        Schema::create('knowledge_base_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_enabled')->default(true);
            $table->enum('priority', ['low', 'medium', 'high', 'exclusive'])->default('medium');
            $table->boolean('include_citations')->default(true);
            $table->timestamps();
        });

        // Insert default settings
        DB::table('knowledge_base_settings')->insert([
            'is_enabled' => true,
            'priority' => 'medium',
            'include_citations' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base_settings');
    }
};
