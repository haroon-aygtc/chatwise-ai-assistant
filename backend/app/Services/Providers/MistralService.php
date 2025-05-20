<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MistralService extends BaseProviderService
{
    /**
     * Generate a response from Mistral AI
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
            $apiKey = $apiKey ?? env('MISTRAL_API_KEY');

            if (!$apiKey) {
                throw new Exception('Mistral API key is required');
            }

            // Determine base URL
            $baseUrl = $baseUrl ?? 'https://api.mistral.ai/v1';

            // Prepare request data
            $data = [
                'model' => $configuration['model'],
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $configuration['maxTokens'] ?? 4096,
                'temperature' => $configuration['temperature'] ?? 0.7,
            ];

            // Add optional parameters if they exist in configuration
            if (isset($configuration['topP'])) {
                $data['top_p'] = $configuration['topP'];
            }

            if (isset($configuration['safePrompt'])) {
                $data['safe_prompt'] = $configuration['safePrompt'];
            }

            // Make API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->post("$baseUrl/chat/completions", $data);

            if (!$response->successful()) {
                throw new Exception('Mistral API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from response
            if (isset($responseData['choices'][0]['message']['content'])) {
                return $responseData['choices'][0]['message']['content'];
            }

            throw new Exception('Unexpected response format from Mistral API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Mistral');
        }
    }

    /**
     * Validate an API key with Mistral
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $baseUrl = $baseUrl ?? 'https://api.mistral.ai/v1';

            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->get("$baseUrl/models");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Mistral API key validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get default configuration for Mistral
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 4096,
            'model' => 'mistral-large-latest',
            'topP' => 0.9,
            'safePrompt' => false
        ];
    }
}
