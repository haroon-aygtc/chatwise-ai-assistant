<?php

namespace App\Services;

use App\Models\AIModel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Exception;

class AIModelService
{
    /**
     * Get all AI models.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllModels()
    {
        return AIModel::all();
    }

    /**
     * Get public AI models (active and default only).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPublicModels()
    {
        return AIModel::where('isActive', true)->get();
    }

    /**
     * Get an AI model by ID.
     *
     * @param string $id
     * @return AIModel
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getModelById($id)
    {
        return AIModel::findOrFail($id);
    }

    /**
     * Create a new AI model.
     *
     * @param array $modelData
     * @return AIModel
     */
    public function createModel(array $modelData)
    {
        // If this is marked as default, unset all other defaults
        if (isset($modelData['isDefault']) && $modelData['isDefault']) {
            $this->unsetDefaultModels();
        }

        return AIModel::create($modelData);
    }

    /**
     * Update an existing AI model.
     *
     * @param string $id
     * @param array $modelData
     * @return AIModel
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function updateModel($id, array $modelData)
    {
        $model = AIModel::findOrFail($id);

        // If this is being set as default, unset all other defaults
        if (isset($modelData['isDefault']) && $modelData['isDefault'] && !$model->isDefault) {
            $this->unsetDefaultModels();
        }

        $model->update($modelData);
        return $model;
    }

    /**
     * Delete an AI model.
     *
     * @param string $id
     * @return bool
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function deleteModel($id)
    {
        $model = AIModel::findOrFail($id);
        return $model->delete();
    }

    /**
     * Set a model as the default.
     *
     * @param string $id
     * @return AIModel
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function setDefaultModel($id)
    {
        // Unset current defaults
        $this->unsetDefaultModels();

        // Set the new default
        $model = AIModel::findOrFail($id);
        $model->update(['isDefault' => true]);
        
        return $model;
    }

    /**
     * Unset isDefault flag from all models.
     */
    private function unsetDefaultModels()
    {
        AIModel::where('isDefault', true)->update(['isDefault' => false]);
    }

    /**
     * Test a model with a prompt.
     *
     * @param string $id
     * @param string $prompt
     * @param array $options
     * @return string
     * @throws Exception
     */
    public function testModel($id, $prompt, array $options = [])
    {
        try {
            $model = AIModel::findOrFail($id);
            
            // This would normally connect to the appropriate AI provider API
            // For now, we're just returning a mock response
            return "This is a test response from the {$model->name} model. Your prompt was: '{$prompt}'";
            
            // In a real implementation, we would use the model's configuration to send a request to the appropriate API
            /*
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$model->apiKey}",
                'Content-Type' => 'application/json',
            ])->post($model->baseUrl ?: 'https://api.example.com/v1/completions', [
                'model' => $model->modelId,
                'prompt' => $prompt,
                'max_tokens' => $options['max_tokens'] ?? 100,
                'temperature' => $options['temperature'] ?? 0.7,
            ]);
            
            if ($response->successful()) {
                return $response->json()['choices'][0]['text'];
            }
            
            throw new Exception('API request failed: ' . $response->body());
            */
        } catch (Exception $e) {
            Log::error('Error testing AI model: ' . $e->getMessage());
            throw $e;
        }
    }
}
