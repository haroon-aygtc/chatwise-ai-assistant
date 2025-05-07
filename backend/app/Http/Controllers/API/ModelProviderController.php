<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ModelProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ModelProviderController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth:api')->except(['index']);
        $this->middleware('permission:manage models')->except(['index', 'show']);
    }

    /**
     * Get all model providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $providers = ModelProvider::where('isActive', true)->get();
        return response()->json(['data' => $providers]);
    }

    /**
     * Get model provider by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $provider = ModelProvider::with('models')->findOrFail($id);
        return response()->json(['data' => $provider]);
    }

    /**
     * Create a new model provider.
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
            'logoUrl' => 'nullable|string|url',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        $provider = ModelProvider::create($validated);
        return response()->json(['data' => $provider, 'message' => 'Model provider created successfully'], 201);
    }

    /**
     * Update an existing model provider.
     *
     * @param Request $request
     * @param int $id
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
            'logoUrl' => 'nullable|string|url',
        ]);

        // Update slug if name changes
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $provider = ModelProvider::findOrFail($id);
        $provider->update($validated);
        
        return response()->json(['data' => $provider, 'message' => 'Model provider updated successfully']);
    }

    /**
     * Delete a model provider.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $provider = ModelProvider::findOrFail($id);
        $provider->delete();
        
        return response()->json(['message' => 'Model provider deleted successfully']);
    }
}
