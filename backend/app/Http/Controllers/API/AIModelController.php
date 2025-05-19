<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAIModelRequest;
use App\Http\Requests\UpdateAIModelRequest;
use App\Http\Requests\TestModelRequest;
use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AIModelController extends Controller
{
    protected $aiModelService;

    public function __construct(AIModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
    }

    /**
     * Get all AI models
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $models = $this->aiModelService->getAllModels();
        return response()->json(['data' => $models]);
    }

    /**
     * Get models by provider
     *
     * @param string $provider
     * @return JsonResponse
     */
    public function getByProvider(string $provider): JsonResponse
    {
        $models = $this->aiModelService->getModelsByProvider($provider);
        return response()->json(['data' => $models]);
    }

    /**
     * Get public models (no auth required)
     *
     * @return JsonResponse
     */
    public function getPublicModels(): JsonResponse
    {
        $models = $this->aiModelService->getPublicModels();
        return response()->json(['data' => $models]);
    }

    /**
     * Get a specific model by ID
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $model = $this->aiModelService->getModelById($id);
        return response()->json(['data' => $model]);
    }

    /**
     * Create a new AI model
     *
     * @param CreateAIModelRequest $request
     * @return JsonResponse
     */
    public function store(CreateAIModelRequest $request): JsonResponse
    {
        $model = $this->aiModelService->createModel($request->validated());
        return response()->json(['data' => $model], 201);
    }

    /**
     * Update an existing AI model
     *
     * @param UpdateAIModelRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(UpdateAIModelRequest $request, string $id): JsonResponse
    {
        $model = $this->aiModelService->updateModel($id, $request->validated());
        return response()->json(['data' => $model]);
    }

    /**
     * Delete an AI model
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $this->aiModelService->deleteModel($id);
        return response()->json(['success' => true]);
    }

    /**
     * Set a model as the default
     *
     * @param string $id
     * @return JsonResponse
     */
    public function setDefault(string $id): JsonResponse
    {
        $model = $this->aiModelService->setDefaultModel($id);
        return response()->json(['data' => $model]);
    }

    /**
     * Test a model with a prompt
     *
     * @param TestModelRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function testModel(TestModelRequest $request, string $id): JsonResponse
    {
        $response = $this->aiModelService->testModel(
            $id,
            $request->input('prompt'),
            $request->input('options', [])
        );

        return response()->json(['data' => ['response' => $response]]);
    }

    /**
     * Test a model configuration without saving
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function testConfiguration(Request $request): JsonResponse
    {
        $this->validate($request, [
            'provider' => 'required|string',
            'configuration' => 'required|array',
            'prompt' => 'required|string',
            'apiKey' => 'nullable|string',
            'baseUrl' => 'nullable|string',
        ]);

        $response = $this->aiModelService->testModelConfiguration(
            $request->input('provider'),
            $request->input('configuration'),
            $request->input('prompt'),
            $request->input('apiKey'),
            $request->input('baseUrl')
        );

        return response()->json(['data' => ['response' => $response]]);
    }
}
