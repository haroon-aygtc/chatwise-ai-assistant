<?php

namespace App\Services;

use App\Models\AIModel;
use App\Services\Providers\OpenAIService;
use App\Services\Providers\GoogleAIService;
use App\Services\Providers\AnthropicService;
use App\Services\Providers\HuggingFaceService;
use App\Services\Providers\MistralService;
use App\Services\Providers\GroqService;
use App\Services\Providers\TogetherAIService;
use App\Services\Providers\OpenRouterService;
use App\Services\Providers\CustomProviderService;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Collection;
use Exception;

class AIModelService
{
    protected $providerServices = [];

    public function __construct(
        OpenAIService $openAIService,
        GoogleAIService $googleAIService,
        AnthropicService $anthropicService,
        HuggingFaceService $huggingFaceService,
        MistralService $mistralService,
        GroqService $groqService,
        TogetherAIService $togetherAIService,
        OpenRouterService $openRouterService,
        CustomProviderService $customProviderService
    ) {
        $this->providerServices = [
            'OpenAI' => $openAIService,
            'Google' => $googleAIService,
            'Anthropic' => $anthropicService,
            'HuggingFace' => $huggingFaceService,
            'Mistral' => $mistralService,
            'Groq' => $groqService,
            'TogetherAI' => $togetherAIService,
            'OpenRouter' => $openRouterService,
            'Custom' => $customProviderService,
        ];
    }

    /**
     * Get all AI models
     *
     * @return Collection
     */
    public function getAllModels(): Collection
    {
        return AIModel::all();
    }

    /**
     * Get models by provider
     *
     * @param string $provider
     * @return Collection
     */
    public function getModelsByProvider(string $provider): Collection
    {
        return AIModel::where('provider', $provider)->get();
    }

    /**
     * Get public AI models (no auth required)
     *
     * @return Collection
     */
    public function getPublicModels(): Collection
    {
        return AIModel::where('is_public', true)->get();
    }

    /**
     * Get a specific AI model by ID
     *
     * @param string $id
     * @return AIModel
     * @throws Exception
     */
    public function getModelById(string $id): AIModel
    {
        $model = AIModel::find($id);

        if (!$model) {
            throw new Exception("AI model not found");
        }

        return $model;
    }

    /**
     * Create a new AI model
     *
     * @param array $data
     * @return AIModel
     */
    public function createModel(array $data): AIModel
    {
        // Ensure configuration has required fields
        if (!isset($data['configuration'])) {
            $data['configuration'] = [
                'temperature' => $data['temperature'] ?? 0.7,
                'maxTokens' => $data['maxTokens'] ?? 2048,
                'model' => $data['modelId'] ?? null,
            ];
        }

        return AIModel::create($data);
    }

    /**
     * Update an existing AI model
     *
     * @param string $id
     * @param array $data
     * @return AIModel
     * @throws Exception
     */
    public function updateModel(string $id, array $data): AIModel
    {
        $model = $this->getModelById($id);

        // Update configuration if temperature or maxTokens are provided
        if (isset($data['configuration']) &&
            (isset($data['temperature']) || isset($data['maxTokens']))) {

            $data['configuration'] = array_merge($data['configuration'], [
                'temperature' => $data['temperature'] ?? $data['configuration']['temperature'] ?? null,
                'maxTokens' => $data['maxTokens'] ?? $data['configuration']['maxTokens'] ?? null,
            ]);
        }

        $model->update($data);
        return $model->fresh();
    }

    /**
     * Delete an AI model
     *
     * @param string $id
     * @return bool
     * @throws Exception
     */
    public function deleteModel(string $id): bool
    {
        $model = $this->getModelById($id);
        return $model->delete();
    }

    /**
     * Set a model as the default
     *
     * @param string $id
     * @return AIModel
     * @throws Exception
     */
    public function setDefaultModel(string $id): AIModel
    {
        $model = $this->getModelById($id);

        // Reset all models to non-default
        AIModel::where('is_default', true)->update(['is_default' => false]);

        // Set this model as default
        $model->is_default = true;
        $model->save();

        return $model;
    }

    /**
     * Test a model with a prompt
     *
     * @param string $id
     * @param string $prompt
     * @param array $options
     * @return string
     * @throws Exception
     */
    public function testModel(string $id, string $prompt, array $options = []): string
    {
        $model = $this->getModelById($id);

        if (!isset($this->providerServices[$model->provider])) {
            throw new Exception("Provider service not found for {$model->provider}");
        }

        $providerService = $this->providerServices[$model->provider];

        return $providerService->generateResponse(
            $prompt,
            $model->configuration,
            $model->apiKey,
            $model->baseUrl,
            $options
        );
    }

    /**
     * Test a model configuration without saving
     *
     * @param string $provider
     * @param array $configuration
     * @param string $prompt
     * @param string|null $apiKey
     * @param string|null $baseUrl
     * @return string
     * @throws Exception
     */
    public function testModelConfiguration(
        string $provider,
        array $configuration,
        string $prompt,
        ?string $apiKey = null,
        ?string $baseUrl = null
    ): string {
        if (!isset($this->providerServices[$provider])) {
            throw new Exception("Provider service not found for {$provider}");
        }

        $providerService = $this->providerServices[$provider];

        return $providerService->generateResponse(
            $prompt,
            $configuration,
            $apiKey,
            $baseUrl
        );
    }

    /**
     * Validate API key for a provider
     *
     * @param string $provider
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateProviderApiKey(string $provider, string $apiKey, ?string $baseUrl = null): bool
    {
        if (!isset($this->providerServices[$provider])) {
            return false;
        }

        $providerService = $this->providerServices[$provider];

        try {
            return $providerService->validateApiKey($apiKey, $baseUrl);
        } catch (Exception $e) {
            Log::error("API key validation error: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Get default configuration for a provider
     *
     * @param string $provider
     * @return array
     */
    public function getProviderDefaultConfiguration(string $provider): array
    {
        if (!isset($this->providerServices[$provider])) {
            return [
                'temperature' => 0.7,
                'maxTokens' => 2048,
            ];
        }

        return $this->providerServices[$provider]->getDefaultConfiguration();
    }
}
