<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ModelProvider;
use App\Services\ModelProviderService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModelProviderController extends Controller
{
    protected $providerService;

    /**
     * Create a new controller instance.
     *
     * @param ModelProviderService $providerService
     */
    public function __construct(ModelProviderService $providerService)
    {
        $this->providerService = $providerService;
    }

    /**
     * Get all model providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $providers = $this->providerService->getAllProviders();
            return response()->json(['data' => $providers]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch providers: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get active model providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActiveProviders()
    {
        try {
            $providers = $this->providerService->getActiveProviders();
            return response()->json(['data' => $providers]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch active providers: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get provider by ID.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $provider = $this->providerService->getProviderById($id);
            return response()->json(['data' => $provider]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch provider: ' . $e->getMessage()], 404);
        }
    }

    /**
     * Create a new provider.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'apiKeyName' => 'required|string|max:255',
            'apiKeyRequired' => 'boolean',
            'baseUrlRequired' => 'boolean',
            'baseUrlName' => 'nullable|string|max:255',
            'isActive' => 'boolean',
            'logoUrl' => 'nullable|string',
        ]);

        try {
            $provider = $this->providerService->createProvider($validated);
            return response()->json(['data' => $provider, 'message' => 'Provider created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create provider: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing provider.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'apiKeyName' => 'sometimes|string|max:255',
            'apiKeyRequired' => 'boolean',
            'baseUrlRequired' => 'boolean',
            'baseUrlName' => 'nullable|string|max:255',
            'isActive' => 'boolean',
            'logoUrl' => 'nullable|string',
        ]);

        try {
            $provider = $this->providerService->updateProvider($id, $validated);
            return response()->json(['data' => $provider, 'message' => 'Provider updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update provider: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a provider.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->providerService->deleteProvider($id);
            return response()->json(['message' => 'Provider deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete provider: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get models for a specific provider.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProviderModels($id)
    {
        try {
            $models = $this->providerService->getProviderModels($id);
            return response()->json(['data' => $models]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch provider models: ' . $e->getMessage()], 500);
        }
    }
}
