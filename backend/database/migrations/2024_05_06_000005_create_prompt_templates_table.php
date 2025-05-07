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
        Schema::create('prompt_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->longText('template');
            $table->json('variables')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('usage_count')->default(0);
            $table->timestamps();
        });

        // Insert a default system prompt template
        DB::table('prompt_templates')->insert([
            'name' => 'Default System Prompt',
            'description' => 'The default system prompt used for the AI assistant',
            'template' => 'You are a helpful assistant.',
            'variables' => json_encode([]),
            'category' => 'system',
            'is_default' => true,
            'is_active' => true,
            'usage_count' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prompt_templates');
    }
};
