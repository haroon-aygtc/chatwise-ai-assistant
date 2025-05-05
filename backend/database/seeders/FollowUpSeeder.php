
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
        // Create default settings
        FollowUpSetting::create([
            'enabled' => true,
            'max_suggestions' => 3,
        ]);

        // Create default suggestions
        $suggestions = [
            [
                'text' => 'Need more help?',
                'category' => 'general',
                'description' => 'General follow-up question',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'text' => 'Talk to a human agent',
                'category' => 'support',
                'description' => 'Escalation option',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'text' => 'Learn about our pricing',
                'category' => 'sales',
                'description' => 'Sales inquiry',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'text' => 'View documentation',
                'category' => 'support',
                'description' => 'Link to documentation',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'text' => 'Submit feedback',
                'category' => 'feedback',
                'description' => 'Gather user feedback',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($suggestions as $suggestion) {
            FollowUpSuggestion::create($suggestion);
        }
    }
}
