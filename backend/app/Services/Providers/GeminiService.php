<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService extends BaseProviderService
{
    /**
     * Generate a response from Google Gemini AI
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
            $apiKey = $apiKey ?? env('GEMINI_API_KEY');

            if (!$apiKey) {
                throw new Exception('Gemini API key is required');
            }

            // Determine base URL (varies by model versions)
            $baseUrl = $baseUrl ?? 'https://generativelanguage.googleapis.com/v1';

            // Get the model ID
            $modelId = $configuration['model'];

            // Prepare request data according to Gemini API structure
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
                    'maxOutputTokens' => $configuration['maxTokens'] ?? 4096,
                ],
            ];

            // Add optional parameters if they exist in configuration
            if (isset($configuration['topP'])) {
                $data['generationConfig']['topP'] = $configuration['topP'];
            }

            if (isset($configuration['topK'])) {
                $data['generationConfig']['topK'] = $configuration['topK'];
            }

            // Make API request to the Gemini API
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post("$baseUrl/models/$modelId:generateContent?key=$apiKey", $data);

            if (!$response->successful()) {
                throw new Exception('Gemini API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from Gemini response format
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                return $responseData['candidates'][0]['content']['parts'][0]['text'];
            }

            throw new Exception('Unexpected response format from Gemini API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Gemini');
        }
    }

    /**
     * Validate an API key with Google Gemini
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $baseUrl = $baseUrl ?? 'https://generativelanguage.googleapis.com/v1';

            // Test a simple models list call with the API key
            $response = Http::get("$baseUrl/models?key=$apiKey");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Gemini API key validation error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get default configuration for Gemini
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 4096,
            'model' => 'gemini-1.5-pro',
            'topK' => 40,
            'topP' => 0.95
        ];
    }
}
