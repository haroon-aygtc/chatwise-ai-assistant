<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePromptTemplateRequest;
use App\Http\Requests\UpdatePromptTemplateRequest;
use App\Services\PromptTemplateService;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromptTemplateController extends Controller
{
    /**
     * @var PromptTemplateService
     */
    protected $promptTemplateService;

    /**
     * PromptTemplateController constructor.
     *
     * @param PromptTemplateService $promptTemplateService
     */
    public function __construct(PromptTemplateService $promptTemplateService)
    {
        $this->promptTemplateService = $promptTemplateService;
    }

    /**
     * Get all prompt templates with optional filtering
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->input('search'),
            'category' => $request->input('category'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
        ];

        $perPage = $request->input('per_page', 15);
        $templates = $this->promptTemplateService->getAllTemplates($filters, $perPage);

        return ResponseService::success(['templates' => $templates]);
    }

    /**
     * Get a single prompt template by ID
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $template = $this->promptTemplateService->getTemplateById($id);

        if (!$template) {
            return ResponseService::error('Prompt template not found', null, 404);
        }

        return ResponseService::success(['template' => $template]);
    }

    /**
     * Create a new prompt template
     *
     * @param CreatePromptTemplateRequest $request
     * @return JsonResponse
     */
    public function store(CreatePromptTemplateRequest $request): JsonResponse
    {
        $data = $request->validated();
        $template = $this->promptTemplateService->createTemplate($data);

        return ResponseService::success(['template' => $template], 'Prompt template created successfully', 201);
    }

    /**
     * Update a prompt template
     *
     * @param UpdatePromptTemplateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdatePromptTemplateRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $template = $this->promptTemplateService->updateTemplate($id, $data);

        if (!$template) {
            return ResponseService::error('Prompt template not found', null, 404);
        }

        return ResponseService::success(['template' => $template], 'Prompt template updated successfully');
    }

    /**
     * Delete a prompt template
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->promptTemplateService->deleteTemplate($id);

        if (!$result) {
            return ResponseService::error('Prompt template not found or cannot be deleted', null, 404);
        }

        return ResponseService::success(['success' => true], 'Prompt template deleted successfully');
    }

    /**
     * Get list of all template categories
     *
     * @return JsonResponse
     */
    public function getCategories(): JsonResponse
    {
        $categories = $this->promptTemplateService->getCategories();
        return ResponseService::success(['categories' => $categories]);
    }

    /**
     * Increment template usage count
     *
     * @param int $id
     * @return JsonResponse
     */
    public function incrementUsage(int $id): JsonResponse
    {
        $result = $this->promptTemplateService->incrementUsageCount($id);

        if (!$result) {
            return ResponseService::error('Prompt template not found', null, 404);
        }

        return ResponseService::success(['success' => true], 'Usage count incremented successfully');
    }

    /**
     * Get pre-defined templates from the library
     *
     * @return JsonResponse
     */
    public function getLibrary(): JsonResponse
    {
        $templates = $this->promptTemplateService->getTemplateLibrary();
        return ResponseService::success(['templates' => $templates]);
    }

    /**
     * Test a template with variables and optionally with an AI model
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function testTemplate(Request $request, int $id): JsonResponse
    {
        $variables = $request->input('variables', []);
        $modelId = $request->input('modelId');

        $result = $this->promptTemplateService->testTemplate($id, $variables, $modelId);

        if (!$result) {
            return ResponseService::error('Failed to test template', null, 400);
        }

        return ResponseService::success($result);
    }

    /**
     * Get the system prompt
     *
     * @return JsonResponse
     */
    public function getSystemPrompt(): JsonResponse
    {
        $systemPrompt = $this->promptTemplateService->getSystemPrompt();
        return ResponseService::success(['systemPrompt' => $systemPrompt]);
    }

    /**
     * Update the system prompt
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateSystemPrompt(Request $request): JsonResponse
    {
        $content = $request->input('content');

        if (empty($content)) {
            return ResponseService::error('System prompt content is required', null, 400);
        }

        $result = $this->promptTemplateService->updateSystemPrompt($content);

        if (!$result) {
            return ResponseService::error('Failed to update system prompt', null, 500);
        }

        return ResponseService::success(['success' => true], 'System prompt updated successfully');
    }
}
