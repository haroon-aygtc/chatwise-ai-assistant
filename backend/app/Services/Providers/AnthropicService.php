<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnthropicService extends BaseProviderService
{
    /**
     * Generate a response from Anthropic (Claude)
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
            $apiKey = $apiKey ?? env('ANTHROPIC_API_KEY');

            if (!$apiKey) {
                throw new Exception('Anthropic API key is required');
            }

            // Determine base URL
            $baseUrl = $baseUrl ?? 'https://api.anthropic.com/v1';

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

            if (isset($configuration['topK'])) {
                $data['top_k'] = $configuration['topK'];
            }

            // Make API request
            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->post("$baseUrl/messages", $data);

            if (!$response->successful()) {
                throw new Exception('Anthropic API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from response
            if (isset($responseData['content'][0]['text'])) {
                return $responseData['content'][0]['text'];
            }

            throw new Exception('Unexpected response format from Anthropic API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Anthropic');
        }
    }

    /**
     * Validate an API key with Anthropic
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $baseUrl = $baseUrl ?? 'https://api.anthropic.com/v1';

            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->get("$baseUrl/models");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Anthropic API key validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get default configuration for Anthropic
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 4096,
            'model' => 'claude-3-opus-20240229',
            'topP' => 0.9,
            'topK' => 40
        ];
    }
}
