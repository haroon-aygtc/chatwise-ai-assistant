<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleAIService extends BaseProviderService
{
    /**
     * Generate a response from Google AI (Gemini)
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
            $apiKey = $apiKey ?? env('GOOGLE_AI_API_KEY');

            if (!$apiKey) {
                throw new Exception('Google AI API key is required');
            }

            // Determine base URL
            $baseUrl = $baseUrl ?? 'https://generativelanguage.googleapis.com/v1';
            $model = $configuration['model'];

            // Prepare request data
            $data = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => $configuration['temperature'] ?? 0.7,
                    'maxOutputTokens' => $configuration['maxTokens'] ?? 2048,
                ]
            ];

            // Add top_p if provided
            if (isset($configuration['topP'])) {
                $data['generationConfig']['topP'] = $configuration['topP'];
            }

            // Add safety settings if provided
            if (isset($configuration['safetySettings']) && is_array($configuration['safetySettings'])) {
                $data['safetySettings'] = $configuration['safetySettings'];
            }

            // Make API request
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("$baseUrl/models/$model:generateContent?key=$apiKey", $data);

            if (!$response->successful()) {
                throw new Exception('Google AI API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from response
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                return $responseData['candidates'][0]['content']['parts'][0]['text'];
            }

            throw new Exception('Unexpected response format from Google AI API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Google AI');
        }
    }

    /**
     * Validate an API key with Google AI
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $baseUrl = $baseUrl ?? 'https://generativelanguage.googleapis.com/v1';

            $response = Http::get("$baseUrl/models?key=$apiKey");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Google AI API key validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get default configuration for Google AI
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 2048,
            'model' => 'gemini-pro',
            'topP' => 0.95
        ];
    }
}
