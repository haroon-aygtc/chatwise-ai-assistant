
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
        Schema::create('response_formats', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('format');
            $table->string('length');
            $table->string('tone');
            $table->boolean('is_default')->default(false);
            $table->json('options');
            $table->timestamps();
        });

        // Insert a default response format
        DB::table('response_formats')->insert([
            'name' => 'Default Format',
            'description' => 'Standard response format with paragraphs and bullet points',
            'format' => 'paragraphs',
            'length' => 'medium',
            'tone' => 'professional',
            'is_default' => true,
            'options' => json_encode([
                'useHeadings' => true,
                'useBulletPoints' => true,
                'includeLinks' => true,
                'formatCodeBlocks' => true
            ]),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_formats');
    }
};
