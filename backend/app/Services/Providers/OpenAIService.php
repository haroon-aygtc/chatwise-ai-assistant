<?php

namespace App\Services\Providers;

use Exception;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class OpenAIService extends BaseProviderService
{
    /**
     * Generate a response from OpenAI
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

            // Set API key for this request if provided
            if ($apiKey) {
                Config::set('openai.api_key', $apiKey);
            }

            // Set base URL for this request if provided
            if ($baseUrl) {
                Config::set('openai.base_url', $baseUrl);
            }

            // Prepare the request parameters
            $params = [
                'model' => $configuration['model'],
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => $configuration['temperature'] ?? 0.7,
                'max_tokens' => $configuration['maxTokens'] ?? 2048,
            ];

            // Add optional parameters if they exist in configuration
            if (isset($configuration['topP'])) {
                $params['top_p'] = $configuration['topP'];
            }

            if (isset($configuration['frequencyPenalty'])) {
                $params['frequency_penalty'] = $configuration['frequencyPenalty'];
            }

            if (isset($configuration['presencePenalty'])) {
                $params['presence_penalty'] = $configuration['presencePenalty'];
            }

            // Add organization header if provided
            if (isset($configuration['organization']) && !empty($configuration['organization'])) {
                Config::set('openai.organization', $configuration['organization']);
            }

            // Make the API call
            $result = OpenAI::chat()->create($params);

            // Extract and return the response text
            return $result->choices[0]->message->content;

        } catch (Exception $e) {
            $this->handleApiError($e, 'OpenAI');
        }
    }

    /**
     * Validate an API key with OpenAI
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool
    {
        try {
            $url = $baseUrl ? rtrim($baseUrl, '/') . '/models' : 'https://api.openai.com/v1/models';

            $response = Http::withHeaders([
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json',
            ])->get($url);

            return $response->successful();
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Get default configuration for OpenAI
     *
     * @return array
     */
    public function getDefaultConfiguration(): array
    {
        return [
            'temperature' => 0.7,
            'maxTokens' => 4096,
            'model' => 'gpt-4o',
            'topP' => 1,
            'frequencyPenalty' => 0,
            'presencePenalty' => 0
        ];
    }
}
