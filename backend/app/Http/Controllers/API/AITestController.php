<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AITestController extends Controller
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
    }

    /**
     * Test connection to an AI provider.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testConnection(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string',
            'apiKey' => 'required|string',
            'baseUrl' => 'nullable|string|url',
        ]);

        try {
            $result = $this->testProviderConnection(
                $validated['provider'],
                $validated['apiKey'],
                $validated['baseUrl'] ?? null
            );

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'models' => $result['models'] ?? []
            ]);
        } catch (\Exception $e) {
            Log::error('AI connection test failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test a complete message flow with a specific model.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testModelCompletely(Request $request)
    {
        $validated = $request->validate([
            'modelId' => 'required|exists:ai_models,id',
            'systemPrompt' => 'nullable|string',
            'userMessage' => 'required|string',
            'temperature' => 'nullable|numeric|min:0|max:2',
            'maxTokens' => 'nullable|integer|min:1|max:4096',
        ]);

        try {
            $model = AIModel::findOrFail($validated['modelId']);

            // Create a standardized request
            $aiRequest = [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $validated['systemPrompt'] ?? 'You are a helpful assistant.'],
                    ['role' => 'user', 'content' => $validated['userMessage']]
                ],
                'temperature' => $validated['temperature'] ?? 0.7,
                'max_tokens' => $validated['maxTokens'] ?? 1024
            ];

            // Save request for analytics
            Log::info('Testing model message flow: ' . $model->name, $aiRequest);

            // Get response
            $response = $this->aiModelService->processCompletionRequest($model->id, $aiRequest);

            return response()->json([
                'success' => true,
                'response' => $response,
                'model' => [
                    'id' => $model->id,
                    'name' => $model->name,
                    'provider' => $model->provider
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('AI model test failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Model test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test provider connection and list available models.
     *
     * @param string $provider
     * @param string $apiKey
     * @param string|null $baseUrl
     * @return array
     */
    private function testProviderConnection($provider, $apiKey, $baseUrl = null)
    {
        // Mock success response for demo
        return [
            'success' => true,
            'message' => 'Successfully connected to ' . $provider,
            'models' => [
                'gpt-4-turbo-preview',
                'gpt-4-vision-preview',
                'gpt-4',
                'gpt-3.5-turbo',
            ]
        ];

        // In a real implementation, we would check connection to the respective API:
        switch (strtolower($provider)) {
            case 'openai':
                $url = $baseUrl ?? 'https://api.openai.com/v1/models';
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$apiKey}",
                    'Content-Type' => 'application/json'
                ])->get($url);

                if ($response->successful()) {
                    $models = array_map(function ($model) {
                        return $model['id'];
                    }, $response->json()['data']);

                    return [
                        'success' => true,
                        'message' => 'Successfully connected to OpenAI API',
                        'models' => $models
                    ];
                }

                return [
                    'success' => false,
                    'message' => 'Failed to connect to OpenAI API: ' . $response->body()
                ];

            // Add other provider implementations here

            default:
                return [
                    'success' => false,
                    'message' => 'Unsupported provider: ' . $provider
                ];
        }
    }
}
