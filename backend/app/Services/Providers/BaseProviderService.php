<?php

namespace App\Services\Providers;

use Exception;
use Illuminate\Support\Facades\Log;

abstract class BaseProviderService
{
    /**
     * Generate a response from the provider's API.
     *
     * @param string $prompt
     * @param array $configuration
     * @param string|null $apiKey
     * @param string|null $baseUrl
     * @param array $options
     * @return string
     * @throws Exception
     */
    abstract public function generateResponse(
        string $prompt,
        array $configuration,
        ?string $apiKey = null,
        ?string $baseUrl = null,
        array $options = []
    ): string;

    /**
     * Validate an API key with the provider's API.
     *
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return bool
     */
    abstract public function validateApiKey(string $apiKey, ?string $baseUrl = null): bool;

    /**
     * Get default configuration for the provider.
     *
     * @return array
     */
    abstract public function getDefaultConfiguration(): array;

    /**
     * Validate configuration against required fields.
     *
     * @param array $configuration
     * @param array $requiredFields
     * @return array
     * @throws Exception
     */
    protected function validateConfiguration(array $configuration, array $requiredFields = []): array
    {
        foreach ($requiredFields as $field) {
            if (!isset($configuration[$field])) {
                throw new Exception("Missing required configuration field: {$field}");
            }
        }

        return $configuration;
    }

    /**
     * Handle API errors consistently.
     *
     * @param Exception $exception
     * @param string $providerName
     * @throws Exception
     */
    protected function handleApiError(Exception $exception, string $providerName): void
    {
        $errorMessage = "{$providerName} API error: " . $exception->getMessage();
        Log::error($errorMessage);
        throw new Exception($errorMessage);
    }
}
