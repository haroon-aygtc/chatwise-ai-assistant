<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\FollowUpSuggestionRequest;
use App\Http\Requests\UpdateFollowUpSettingsRequest;
use App\Services\FollowUpService;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class FollowUpController extends Controller
{
    protected $followUpService;
    protected $responseService;

    public function __construct(FollowUpService $followUpService, ResponseService $responseService)
    {
        $this->followUpService = $followUpService;
        $this->responseService = $responseService;
    }

    /**
     * Get all follow-up suggestions.
     */
    public function getAllSuggestions()
    {
        $suggestions = $this->followUpService->getAllSuggestions();
        return $this->responseService->success($suggestions);
    }

    /**
     * Get a specific follow-up suggestion.
     */
    public function getSuggestionById(string $id)
    {
        $suggestion = $this->followUpService->getSuggestionById($id);
        return $this->responseService->success($suggestion);
    }

    /**
     * Create a new follow-up suggestion.
     */
    public function createSuggestion(FollowUpSuggestionRequest $request)
    {
        $suggestion = $this->followUpService->createSuggestion($request->validated());
        return $this->responseService->success($suggestion, 'Suggestion created successfully');
    }

    /**
     * Update an existing follow-up suggestion.
     */
    public function updateSuggestion(string $id, FollowUpSuggestionRequest $request)
    {
        $suggestion = $this->followUpService->updateSuggestion($id, $request->validated());
        return $this->responseService->success($suggestion, 'Suggestion updated successfully');
    }

    /**
     * Delete a follow-up suggestion.
     */
    public function deleteSuggestion(string $id)
    {
        $this->followUpService->deleteSuggestion($id);
        return $this->responseService->success(null, 'Suggestion deleted successfully');
    }

    /**
     * Reorder suggestions.
     */
    public function reorderSuggestions(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'string',
        ]);

        $suggestions = $this->followUpService->reorderSuggestions($request->ordered_ids);
        return $this->responseService->success($suggestions, 'Suggestions reordered successfully');
    }

    /**
     * Move a suggestion up in order.
     */
    public function moveSuggestionUp(string $id)
    {
        $suggestions = $this->followUpService->moveSuggestionUp($id);
        return $this->responseService->success($suggestions, 'Suggestion moved up successfully');
    }

    /**
     * Move a suggestion down in order.
     */
    public function moveSuggestionDown(string $id)
    {
        $suggestions = $this->followUpService->moveSuggestionDown($id);
        return $this->responseService->success($suggestions, 'Suggestion moved down successfully');
    }

    /**
     * Get follow-up settings.
     */
    public function getSettings()
    {
        $settings = $this->followUpService->getSettings();
        return $this->responseService->success($settings);
    }

    /**
     * Update follow-up settings.
     */
    public function updateSettings(UpdateFollowUpSettingsRequest $request)
    {
        $settings = $this->followUpService->updateSettings($request->validated());
        return $this->responseService->success($settings, 'Settings updated successfully');
    }

    /**
     * Test follow-up suggestions.
     */
    public function testSuggestions()
    {
        $result = $this->followUpService->testSuggestions();
        return $this->responseService->success($result);
    }
}
