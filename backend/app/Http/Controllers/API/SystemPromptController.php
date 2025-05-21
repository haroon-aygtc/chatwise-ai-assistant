<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SystemPrompt;
use App\Services\SystemPromptService;
use Illuminate\Http\Request;

class SystemPromptController extends Controller
{
    protected $systemPromptService;

    /**
     * Create a new controller instance.
     *
     * @param SystemPromptService $systemPromptService
     */
    public function __construct(SystemPromptService $systemPromptService)
    {
        $this->systemPromptService = $systemPromptService;
    }

    /**
     * Get the current active system prompt.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentPrompt()
    {
        try {
            $prompt = $this->systemPromptService->getActivePrompt();
            return response()->json(['data' => $prompt]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch active system prompt: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all system prompts.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $prompts = $this->systemPromptService->getAllPrompts();
            return response()->json(['data' => $prompts]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch system prompts: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get a specific system prompt.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $prompt = $this->systemPromptService->getPromptById($id);
            return response()->json(['data' => $prompt]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch system prompt: ' . $e->getMessage()], 404);
        }
    }

    /**
     * Create a new system prompt.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'is_active' => 'boolean',
        ]);

        try {
            $prompt = $this->systemPromptService->createPrompt($validated);
            return response()->json(['data' => $prompt, 'message' => 'System prompt created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create system prompt: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing system prompt.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'sometimes|string',
            'is_active' => 'boolean',
        ]);

        try {
            $prompt = $this->systemPromptService->updatePrompt($id, $validated);
            return response()->json(['data' => $prompt, 'message' => 'System prompt updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update system prompt: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a system prompt.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->systemPromptService->deletePrompt($id);
            return response()->json(['message' => 'System prompt deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete system prompt: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Activate a specific system prompt.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function activate($id)
    {
        try {
            $prompt = $this->systemPromptService->activatePrompt($id);
            return response()->json(['data' => $prompt, 'message' => 'System prompt activated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate system prompt: ' . $e->getMessage()], 500);
        }
    }
}
