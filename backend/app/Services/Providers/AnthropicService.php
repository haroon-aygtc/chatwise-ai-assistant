<?php

namespace App\Services\Providers;

use App\Services\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class AnthropicService implements AIProviderInterface
{
    /**
     * The API key for Anthropic.
     *
     * @var string|null
     */
    protected $apiKey;

    /**
     * The base URL for Anthropic API.
     *
     * @var string
     */
    protected $baseUrl;

    /**
     * Create a new Anthropic service instance.
     */
    public function __construct()
    {
        $this->apiKey = config('ai.providers.anthropic.api_key');
        $this->baseUrl = config('ai.providers.anthropic.base_url', 'https://api.anthropic.com');
    }

    /**
     * Generate a chat completion.
     *
     * @param string $prompt The prompt to generate a completion for
     * @param array $options Additional options for the completion
     * @return string The generated completion
     * @throws Exception If the API request fails
     */
    public function generateChatCompletion(string $prompt, array $options = []): string
    {
        try {
            $model = $options['model'] ?? 'claude-3-opus-20240229';
            $maxTokens = $options['max_tokens'] ?? 1000;
            $temperature = $options['temperature'] ?? 0.7;
            $topP = $options['top_p'] ?? 1.0;
            $systemPrompt = $options['system_prompt'] ?? 'You are a helpful assistant.';

            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/v1/messages", [
                'model' => $model,
                'max_tokens' => $maxTokens,
                'temperature' => $temperature,
                'top_p' => $topP,
                'system' => $systemPrompt,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ]
            ]);

            if ($response->successful()) {
                $result = $response->json();
                return $result['content'][0]['text'] ?? 'No response generated';
            }

            Log::error('Anthropic API error: ' . $response->body());
            throw new Exception('Failed to generate completion: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Anthropic service error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate a text completion.
     *
     * @param string $prompt The prompt to generate a completion for
     * @param array $options Additional options for the completion
     * @return string The generated completion
     * @throws Exception If the API request fails
     */
    public function generateTextCompletion(string $prompt, array $options = []): string
    {
        // Anthropic doesn't have a separate text completion endpoint, so we use the chat endpoint
        return $this->generateChatCompletion($prompt, $options);
    }

    /**
     * Generate embeddings for a text.
     *
     * @param string $text The text to generate embeddings for
     * @param array $options Additional options for the embeddings
     * @return array The generated embeddings
     * @throws Exception If the API request fails
     */
    public function generateEmbeddings(string $text, array $options = []): array
    {
        try {
            $model = $options['model'] ?? 'claude-3-opus-20240229';

            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ])->post("{$this->baseUrl}/v1/embeddings", [
                'model' => $model,
                'input' => $text,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                return $result['embedding'] ?? [];
            }

            Log::error('Anthropic API error: ' . $response->body());
            throw new Exception('Failed to generate embeddings: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Anthropic service error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Set the API key.
     *
     * @param string $apiKey The API key to use
     * @return void
     */
    public function setApiKey(string $apiKey): void
    {
        $this->apiKey = $apiKey;
    }

    /**
     * Set the base URL.
     *
     * @param string $baseUrl The base URL to use
     * @return void
     */
    public function setBaseUrl(string $baseUrl): void
    {
        $this->baseUrl = $baseUrl;
    }
}
