<?php

namespace Database\Seeders;

use App\Models\ResponseFormat;
use Illuminate\Database\Seeder;

class ResponseFormatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default conversational format
        ResponseFormat::create([
            'name' => 'Default Conversational',
            'description' => 'A natural, conversational response format for general use',
            'format' => 'conversational',
            'length' => 'medium',
            'tone' => 'professional',
            'is_default' => true,
            'options' => [
                'useHeadings' => false,
                'useBulletPoints' => false,
                'includeLinks' => true,
                'formatCodeBlocks' => true,
            ],
        ]);

        // Structured format with headings
        ResponseFormat::create([
            'name' => 'Structured Content',
            'description' => 'A structured format with headings and sections',
            'format' => 'structured',
            'length' => 'detailed',
            'tone' => 'professional',
            'is_default' => false,
            'options' => [
                'useHeadings' => true,
                'useBulletPoints' => true,
                'includeLinks' => true,
                'formatCodeBlocks' => true,
            ],
        ]);

        // Bullet points format
        ResponseFormat::create([
            'name' => 'Concise Bullet Points',
            'description' => 'A concise format using bullet points for quick scanning',
            'format' => 'bullet-points',
            'length' => 'concise',
            'tone' => 'professional',
            'is_default' => false,
            'options' => [
                'useHeadings' => false,
                'useBulletPoints' => true,
                'includeLinks' => true,
                'formatCodeBlocks' => false,
            ],
        ]);

        // Step by step format
        ResponseFormat::create([
            'name' => 'Step by Step Guide',
            'description' => 'A detailed step-by-step format for instructions and tutorials',
            'format' => 'step-by-step',
            'length' => 'detailed',
            'tone' => 'friendly',
            'is_default' => false,
            'options' => [
                'useHeadings' => true,
                'useBulletPoints' => false,
                'includeLinks' => true,
                'formatCodeBlocks' => true,
            ],
        ]);
    }
}