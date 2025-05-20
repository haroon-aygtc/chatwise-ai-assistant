<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CustomProviderService extends BaseProviderService
{
    /**
     * Generate a response from a custom LLM provider
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
            $configuration = $this->validateConfiguration($configuration, ['baseUrl', 'endpoint', 'requestFormat']);

            // Use provided API key or fall back to env
            $apiKey = $apiKey ?? $configuration['apiKey'] ?? null;

            // Determine base URL and endpoint
            $baseUrl = $baseUrl ?? $configuration['baseUrl'];
            $endpoint = $configuration['endpoint'];
            $requestFormat = $configuration['requestFormat'];

            // Prepare request data based on format
            $data = [];

            // Replace placeholders in the request format
            $requestData = json_decode($requestFormat, true);
            $this->replacePromptPlaceholders($requestData, $prompt, $configuration);
            $data = $requestData;

            // Set up headers
            $headers = [
                'Content-Type' => 'application/json',
            ];

            // Add API key to headers if available
            if ($apiKey) {
                $authHeaderType = $configuration['authHeaderType'] ?? 'Bearer';
                $headers['Authorization'] = "{$authHeaderType} {$apiKey}";
            }

            // Make API request
            $response = Http::withHeaders($headers)->post("{$baseUrl}/{$endpoint}", $data);

            if (!$response->successful()) {
                throw new Exception('Custom provider API error: ' . $response->body());
            }

            $responseData = $response->json();

            // Extract text from response using the response path
            $responsePath = $configuration['responsePath'] ?? '';
            $content = $this->extractContentByPath($responseData, $responsePath);

            if ($content) {
                return $content;
            }

            throw new Exception('Unexpected response format from custom provider API');

        } catch (Exception $e) {
            $this->handleApiError($e, 'Custom provider');
        }
    }

    /**
     * Extract content from nested JSON response using dot notation path
     *
     * @param array $data
     * @param string $path
     * @return string|null
     */
    private function extractContentByPath(array $data, string $path): ?string
    {
        if (empty($path)) {
            // If no path is specified, try to find a content field in the response
            if (isset($data['content'])) {
                return $data['content'];
            } elseif (isset($data['text'])) {
                return $data['text'];
            } elseif (isset($data['message']['content'])) {
                return $data['message']['content'];
            } else {
                return json_encode($data); // Return entire response as JSON string
            }
        }

        $keys = explode('.', $path);
        $current = $data;

        foreach ($keys as $key) {
            if (is_array($current) && isset($current[$key])) {
                $current = $current[$key];
            } else {
                return null;
            }
        }

        if (is_string($current)) {
            return $current;
        }

        return json_encode($current);
    }

    /**
     * Replace placeholders in the request format with actual values
     *
     * @param array &$data Reference to data structure
     * @param string $prompt The user prompt
     * @param array $configuration Additional configuration
     * @return void
     */
    private function replacePromptPlaceholders(array &$data, string $prompt, array $configuration): void
    {
        array_walk_recursive($data, function (&$value) use ($prompt, $configuration) {
            if (is_string($value)) {
                // Replace {{prompt}} with the actual prompt
                $value = str_replace('{{prompt}}', $prompt, $value);

                // Replace other configuration values
                foreach ($configuration as $configKey => $configValue) {
                    if (is_scalar($configValue)) {
                        $value = str_replace("{{{$configKey}}}", (string)$configValue, $value);
                    }
                }
            }
        });
    }

    /**
     * Validate an API key with the custom provider
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        // For custom providers, we'll assume the key is valid if it's not empty
        // Users should validate their setup separately
        return !empty($apiKey);
    }

    /**
     * Get default configuration for custom provider
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'baseUrl' => 'https://api.example.com',
            'endpoint' => 'v1/completions',
            'authHeaderType' => 'Bearer',
            'requestFormat' => json_encode([
                'model' => 'default-model',
                'prompt' => '{{prompt}}',
                'max_tokens' => 2048,
                'temperature' => 0.7
            ]),
            'responsePath' => 'choices.0.text'
        ];
    }
}
