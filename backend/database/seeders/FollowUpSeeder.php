<?php

namespace Database\Seeders;

use App\Models\FollowUpSetting;
use App\Models\FollowUpSuggestion;
use Illuminate\Database\Seeder;

class FollowUpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default follow-up settings
        FollowUpSetting::create([
            'enabled' => true,
            'max_suggestions' => 3,
        ]);

        // Create sample follow-up suggestions
        $suggestions = [
            [
                'text' => 'Tell me more about that',
                'category' => 'general',
                'description' => 'Ask for more details about the previously mentioned topic',
                'order' => 1,
                'is_active' => true,
                'trigger_conditions' => ['min_message_length' => 20],
            ],
            [
                'text' => 'How does this compare to competitors?',
                'category' => 'business',
                'description' => 'Ask for competitive analysis',
                'order' => 2,
                'is_active' => true,
                'trigger_conditions' => ['topic' => 'business'],
            ],
            [
                'text' => 'What are the next steps?',
                'category' => 'general',
                'description' => 'Ask about the action plan',
                'order' => 3,
                'is_active' => true,
                'trigger_conditions' => [],
            ],
            [
                'text' => 'Can you provide some examples?',
                'category' => 'general',
                'description' => 'Request concrete examples',
                'order' => 4,
                'is_active' => true,
                'trigger_conditions' => [],
            ],
            [
                'text' => 'What are the potential challenges?',
                'category' => 'business',
                'description' => 'Ask about potential obstacles',
                'order' => 5,
                'is_active' => true,
                'trigger_conditions' => ['topic' => 'business'],
            ],
        ];

        foreach ($suggestions as $suggestion) {
            FollowUpSuggestion::create($suggestion);
        }
    }
}
