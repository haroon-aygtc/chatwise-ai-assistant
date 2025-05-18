<?php

namespace App\Services;

use App\Models\FollowUpSuggestion;
use App\Models\FollowUpSetting;
use Illuminate\Support\Str;

class FollowUpService
{
    /**
     * Get all follow-up suggestions.
     */
    public function getAllSuggestions()
    {
        return FollowUpSuggestion::orderBy('order')->get();
    }

    /**
     * Get a specific follow-up suggestion by ID.
     */
    public function getSuggestionById(string $id)
    {
        return FollowUpSuggestion::findOrFail($id);
    }

    /**
     * Create a new follow-up suggestion.
     */
    public function createSuggestion(array $data)
    {
        // Set the order if not provided
        if (!isset($data['order'])) {
            $maxOrder = FollowUpSuggestion::max('order') ?: 0;
            $data['order'] = $maxOrder + 1;
        }

        return FollowUpSuggestion::create($data);
    }

    /**
     * Update an existing follow-up suggestion.
     */
    public function updateSuggestion(string $id, array $data)
    {
        $suggestion = FollowUpSuggestion::findOrFail($id);
        $suggestion->update($data);
        return $suggestion;
    }

    /**
     * Delete a follow-up suggestion.
     */
    public function deleteSuggestion(string $id)
    {
        $suggestion = FollowUpSuggestion::findOrFail($id);
        $suggestion->delete();
        return true;
    }

    /**
     * Reorder suggestions.
     */
    public function reorderSuggestions(array $orderedIds)
    {
        foreach ($orderedIds as $index => $id) {
            FollowUpSuggestion::where('id', $id)->update(['order' => $index + 1]);
        }
        return $this->getAllSuggestions();
    }

    /**
     * Move a suggestion up in order.
     */
    public function moveSuggestionUp(string $id)
    {
        $suggestion = FollowUpSuggestion::findOrFail($id);
        $previousSuggestion = FollowUpSuggestion::where('order', '<', $suggestion->order)
            ->orderBy('order', 'desc')
            ->first();

        if ($previousSuggestion) {
            $tempOrder = $suggestion->order;
            $suggestion->order = $previousSuggestion->order;
            $previousSuggestion->order = $tempOrder;

            $suggestion->save();
            $previousSuggestion->save();
        }

        return $this->getAllSuggestions();
    }

    /**
     * Move a suggestion down in order.
     */
    public function moveSuggestionDown(string $id)
    {
        $suggestion = FollowUpSuggestion::findOrFail($id);
        $nextSuggestion = FollowUpSuggestion::where('order', '>', $suggestion->order)
            ->orderBy('order')
            ->first();

        if ($nextSuggestion) {
            $tempOrder = $suggestion->order;
            $suggestion->order = $nextSuggestion->order;
            $nextSuggestion->order = $tempOrder;

            $suggestion->save();
            $nextSuggestion->save();
        }

        return $this->getAllSuggestions();
    }

    /**
     * Get follow-up settings.
     */
    public function getSettings()
    {
        return FollowUpSetting::first() ?? FollowUpSetting::create([
            'enabled' => true,
            'max_suggestions' => 3,
        ]);
    }

    /**
     * Update follow-up settings.
     */
    public function updateSettings(array $data)
    {
        $settings = $this->getSettings();
        $settings->update($data);
        return $settings;
    }

    /**
     * Test follow-up suggestions with a sample response.
     */
    public function testSuggestions()
    {
        $settings = $this->getSettings();
        $suggestionCount = min($settings->max_suggestions, 5);

        if (!$settings->enabled) {
            return [
                'response' => $this->getDefaultResponse(),
                'followUps' => [],
                'settings' => [
                    'enabled' => false,
                    'max_suggestions' => $settings->max_suggestions,
                ],
            ];
        }

        $suggestions = FollowUpSuggestion::where('is_active', true)
            ->orderBy('order')
            ->limit($suggestionCount)
            ->get();

        return [
            'response' => $this->getDefaultResponse(),
            'followUps' => $suggestions,
            'settings' => [
                'enabled' => true,
                'max_suggestions' => $settings->max_suggestions,
            ],
        ];
    }

    /**
     * Generate a default test response.
     */
    private function getDefaultResponse()
    {
        return "Our product offers several powerful features designed to enhance your customer experience. The AI-powered chat provides intelligent responses based on your business knowledge. We also offer multi-channel support, allowing seamless integration with your website, mobile app, and social media platforms.";
    }
}
