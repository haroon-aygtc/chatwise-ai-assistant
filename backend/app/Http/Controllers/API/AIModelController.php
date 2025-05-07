<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\Request;

class AIModelController extends Controller
{
    protected $aiModelService;

    /**
     * Create a new controller instance.
     *
     * @param AIModelService $aiModelService
     */
    public function __construct(AIModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
        $this->middleware('auth:api')->except(['getPublicModels']);
        $this->middleware('permission:manage models')->except(['getPublicModels', 'index', 'show']);
    }

    /**
     * Get all AI models.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $models = $this->aiModelService->getAllModels();
        return response()->json(['data' => $models]);
    }

    /**
     * Get public AI models (no auth required).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPublicModels()
    {
        $models = $this->aiModelService->getPublicModels();
        return response()->json(['data' => $models]);
    }

    /**
     * Get an AI model by ID.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $model = $this->aiModelService->getModelById($id);
        return response()->json(['data' => $model]);
    }

    /**
     * Create a new AI model.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|max:255',
            'modelId' => 'required|string|max:255',
            'apiKey' => 'nullable|string',
            'baseUrl' => 'nullable|string|url',
            'isActive' => 'boolean',
            'isDefault' => 'boolean',
            'capabilities' => 'array',
            'capabilities.chat' => 'boolean',
            'capabilities.completion' => 'boolean',
            'capabilities.embeddings' => 'boolean',
            'capabilities.vision' => 'boolean',
            'pricePerToken' => 'required|numeric',
            'contextSize' => 'required|integer',
        ]);

        $model = $this->aiModelService->createModel($validated);
        return response()->json(['data' => $model, 'message' => 'AI model created successfully'], 201);
    }

    /**
     * Update an existing AI model.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'provider' => 'sometimes|string|max:255',
            'modelId' => 'sometimes|string|max:255',
            'apiKey' => 'nullable|string',
            'baseUrl' => 'nullable|string|url',
            'isActive' => 'boolean',
            'isDefault' => 'boolean',
            'capabilities' => 'sometimes|array',
            'capabilities.chat' => 'sometimes|boolean',
            'capabilities.completion' => 'sometimes|boolean',
            'capabilities.embeddings' => 'sometimes|boolean',
            'capabilities.vision' => 'sometimes|boolean',
            'pricePerToken' => 'sometimes|numeric',
            'contextSize' => 'sometimes|integer',
        ]);

        $model = $this->aiModelService->updateModel($id, $validated);
        return response()->json(['data' => $model, 'message' => 'AI model updated successfully']);
    }

    /**
     * Delete an AI model.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $this->aiModelService->deleteModel($id);
        return response()->json(['message' => 'AI model deleted successfully']);
    }

    /**
     * Set a model as the default.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDefault($id)
    {
        $model = $this->aiModelService->setDefaultModel($id);
        return response()->json(['data' => $model, 'message' => 'Default model updated successfully']);
    }

    /**
     * Test a model with a prompt.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function testModel(Request $request, $id)
    {
        $validated = $request->validate([
            'prompt' => 'required|string',
            'options' => 'sometimes|array',
        ]);

        $response = $this->aiModelService->testModel($id, $validated['prompt'], $validated['options'] ?? []);
        return response()->json(['data' => ['response' => $response]]);
    }
}
