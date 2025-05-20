<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HuggingFaceService extends BaseProviderService
{
    /**
     * Generate a response from Hugging Face
     *
     * @param string $prompt
     * @param array $configuration
     * @param string|null $apiKey
     * @param string|null $baseUrl
     * @param array $options
     * @return string
     * @throws Exception
     */
    public function generateResponse(
        string $prompt,
        array $configuration,
        ?string $apiKey = null,
        ?string $baseUrl = null,
        array $options = []
    ): string {
        try {
            // Validate configuration
            $configuration = $this->validateConfiguration($configuration, ['model']);

            // Use provided API key or fall back to env
            $apiKey = $apiKey ?? env('HUGGINGFACE_API_KEY');

            if (!$apiKey) {
                throw new Exception('Hugging Face API key is required');
            }

            // Determine base URL
            $baseUrl = $baseUrl ?? 'https://api-inference.huggingface.co/models';

            // Get the model ID
            $modelId = $configuration['model'];

            // Prepare request data
            $data = [
                'inputs' => $prompt,
                'parameters' => [
                    'max_new_tokens' => $configuration['maxTokens'] ?? 1024,
                    'temperature' => $configuration['temperature'] ?? 0.7,
                    'return_full_text' => false
                ]
            ];

            // Add optional parameters if they exist in configuration
            if (isset($configuration['topP'])) {
                $data['parameters']['top_p'] = $configuration['topP'];
            }

            if (isset($configuration['topK'])) {
                $data['parameters']['top_k'] = $configuration['topK'];
            }

            // Make API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->post("$baseUrl/$modelId", $data);

            if (!$response->successful()) {
                throw new Exception('Hugging Face API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from response
            if (is_array($responseData) && !empty($responseData[0]) && isset($responseData[0]['generated_text'])) {
                return $responseData[0]['generated_text'];
            }

            throw new Exception('Unexpected response format from Hugging Face API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Hugging Face');
        }
    }

    /**
     * Validate an API key with Hugging Face
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $baseUrl = $baseUrl ?? 'https://huggingface.co/api';

            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->get("$baseUrl/whoami");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Hugging Face API key validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get default configuration for Hugging Face
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 1024,
            'model' => 'mistralai/Mistral-7B-Instruct-v0.2',
            'topK' => 50,
            'topP' => 0.9
        ];
    }
}
