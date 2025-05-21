<?php

namespace App\Services;

use App\Models\SystemPrompt;
use Illuminate\Support\Facades\Log;
use Exception;

class SystemPromptService
{
    /**
     * Get the currently active system prompt.
     *
     * @return SystemPrompt
     */
    public function getActivePrompt()
    {
        try {
            $prompt = SystemPrompt::where('is_active', true)->latest()->first();

            // If no active prompt, return the latest one and activate it
            if (!$prompt) {
                $prompt = SystemPrompt::latest()->first();

                // If there are no prompts at all, create a default one
                if (!$prompt) {
                    $prompt = $this->createDefaultPrompt();
                } else {
                    $prompt->is_active = true;
                    $prompt->save();
                }
            }

            return $prompt;
        } catch (Exception $e) {
            Log::error('Error fetching active system prompt: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get all system prompts.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPrompts()
    {
        try {
            return SystemPrompt::orderBy('created_at', 'desc')->get();
        } catch (Exception $e) {
            Log::error('Error fetching system prompts: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get a system prompt by ID.
     *
     * @param string $id
     * @return SystemPrompt
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getPromptById($id)
    {
        return SystemPrompt::findOrFail($id);
    }

    /**
     * Create a new system prompt.
     *
     * @param array $promptData
     * @return SystemPrompt
     */
    public function createPrompt(array $promptData)
    {
        try {
            // If this prompt is set as active, deactivate all others
            if (isset($promptData['is_active']) && $promptData['is_active']) {
                $this->deactivateAllPrompts();
            }

            // Set default version
            if (!isset($promptData['version'])) {
                $promptData['version'] = 1;
            }

            return SystemPrompt::create($promptData);
        } catch (Exception $e) {
            Log::error('Error creating system prompt: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Update an existing system prompt.
     *
     * @param string $id
     * @param array $promptData
     * @return SystemPrompt
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function updatePrompt($id, array $promptData)
    {
        $prompt = SystemPrompt::findOrFail($id);

        // If this prompt is being set as active, deactivate all others
        if (isset($promptData['is_active']) && $promptData['is_active'] && !$prompt->is_active) {
            $this->deactivateAllPrompts();
        }

        // If the content changed, increment version
        if (isset($promptData['content']) && $promptData['content'] !== $prompt->content) {
            $promptData['version'] = $prompt->version + 1;
        }

        $prompt->update($promptData);
        return $prompt;
    }

    /**
     * Delete a system prompt.
     *
     * @param string $id
     * @return bool
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function deletePrompt($id)
    {
        $prompt = SystemPrompt::findOrFail($id);

        // Don't allow deleting the only prompt or the active one
        $count = SystemPrompt::count();
        if ($count <= 1 || $prompt->is_active) {
            throw new Exception('Cannot delete the only prompt or the active prompt');
        }

        return $prompt->delete();
    }

    /**
     * Activate a specific system prompt.
     *
     * @param string $id
     * @return SystemPrompt
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function activatePrompt($id)
    {
        // Deactivate all prompts
        $this->deactivateAllPrompts();

        // Activate the specified prompt
        $prompt = SystemPrompt::findOrFail($id);
        $prompt->is_active = true;
        $prompt->save();

        return $prompt;
    }

    /**
     * Deactivate all system prompts.
     *
     * @return void
     */
    private function deactivateAllPrompts()
    {
        SystemPrompt::where('is_active', true)->update(['is_active' => false]);
    }

    /**
     * Create a default system prompt.
     *
     * @return SystemPrompt
     */
    private function createDefaultPrompt()
    {
        return SystemPrompt::create([
            'content' => 'You are a helpful AI assistant for our company. Answer customer questions accurately and professionally.',
            'version' => 1,
            'is_active' => true
        ]);
    }
}
