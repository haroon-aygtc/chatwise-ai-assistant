<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the table exists before modifying it
        if (Schema::hasTable('response_formats')) {
            // Drop columns that aren't in the new schema
            Schema::table('response_formats', function (Blueprint $table) {
                $table->dropColumn(['content', 'system_instructions', 'parameters']);
            });

            // Add new columns
            Schema::table('response_formats', function (Blueprint $table) {
                $table->string('format')->after('description');
                $table->string('length')->after('format');
                $table->string('tone')->after('length');
                $table->json('options')->after('is_default');
            });
        } else {
            // Create the table if it doesn't exist (shouldn't happen, but just in case)
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
        }

        // Check if there's any data in the table
        if (DB::table('response_formats')->count() === 0) {
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the original schema if possible
        if (Schema::hasTable('response_formats')) {
            Schema::table('response_formats', function (Blueprint $table) {
                $table->dropColumn(['format', 'length', 'tone', 'options']);
                $table->text('content')->nullable();
                $table->text('system_instructions')->nullable();
                $table->json('parameters')->nullable();
            });
        }
    }
};
