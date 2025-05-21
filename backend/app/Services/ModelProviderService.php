<?php

namespace App\Services;

use App\Models\ModelProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class ModelProviderService
{
    /**
     * Get all providers.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProviders()
    {
        try {
            Log::info('Fetching all model providers');
            return ModelProvider::all();
        } catch (Exception $e) {
            Log::error('Error fetching model providers: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get active providers.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveProviders()
    {
        try {
            Log::info('Fetching active model providers');
            return ModelProvider::where('isActive', true)->get();
        } catch (Exception $e) {
            Log::error('Error fetching active model providers: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Get a provider by ID.
     *
     * @param string $id
     * @return ModelProvider
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getProviderById($id)
    {
        return ModelProvider::with('models')->findOrFail($id);
    }

    /**
     * Create a new provider.
     *
     * @param array $providerData
     * @return ModelProvider
     */
    public function createProvider(array $providerData)
    {
        try {
            // Generate slug from name
            $providerData['slug'] = Str::slug($providerData['name']);

            Log::info('Creating new model provider', $providerData);
            return ModelProvider::create($providerData);
        } catch (Exception $e) {
            Log::error('Error creating model provider: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Update an existing provider.
     *
     * @param string $id
     * @param array $providerData
     * @return ModelProvider
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function updateProvider($id, array $providerData)
    {
        $provider = ModelProvider::findOrFail($id);

        // Update slug if name changes
        if (isset($providerData['name'])) {
            $providerData['slug'] = Str::slug($providerData['name']);
        }

        Log::info('Updating model provider: ' . $id, $providerData);
        $provider->update($providerData);
        return $provider;
    }

    /**
     * Delete a provider.
     *
     * @param string $id
     * @return bool
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function deleteProvider($id)
    {
        $provider = ModelProvider::findOrFail($id);
        Log::info('Deleting model provider: ' . $id);
        return $provider->delete();
    }

    /**
     * Get all models for a specific provider.
     *
     * @param string $id
     * @return \Illuminate\Database\Eloquent\Collection
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getProviderModels($id)
    {
        $provider = ModelProvider::findOrFail($id);
        return $provider->models;
    }
}
