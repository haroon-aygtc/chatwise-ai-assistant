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
            'category' => $request->input('category', 'all'),
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
        ];

        $perPage = $request->input('per_page', 15);
        $templates = $this->promptTemplateService->getAllTemplates($filters, $perPage);

        return ResponseService::success($templates);
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

        return ResponseService::success($template);
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

        return ResponseService::success($template, 'Prompt template created successfully', 201);
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

        return ResponseService::success($template, 'Prompt template updated successfully');
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

        return ResponseService::success(null, 'Prompt template deleted successfully');
    }

    /**
     * Get list of all template categories
     *
     * @return JsonResponse
     */
    public function getCategories(): JsonResponse
    {
        $categories = $this->promptTemplateService->getCategories();
        return ResponseService::success($categories);
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

        return ResponseService::success(null, 'Usage count incremented successfully');
    }
}
