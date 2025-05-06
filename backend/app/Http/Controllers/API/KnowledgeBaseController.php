<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Requests\UpdateSettingsRequest;
use App\Services\KnowledgeBaseService;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KnowledgeBaseController extends Controller
{
    protected $knowledgeBaseService;
    protected $responseService;

    public function __construct(
        KnowledgeBaseService $knowledgeBaseService,
        ResponseService $responseService
    ) {
        $this->knowledgeBaseService = $knowledgeBaseService;
        $this->responseService = $responseService;
    }

    /**
     * Get all documents
     */
    public function getAllDocuments(): JsonResponse
    {
        try {
            $documents = $this->knowledgeBaseService->getAllDocuments();
            return $this->responseService->success($documents);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get document by ID
     */
    public function getDocumentById(string $id): JsonResponse
    {
        try {
            $document = $this->knowledgeBaseService->getDocumentById($id);
            return $this->responseService->success($document);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create new document
     */
    public function createDocument(CreateDocumentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $file = $request->hasFile('file') ? $request->file('file') : null;

            $document = $this->knowledgeBaseService->createDocument($data, $file);
            return $this->responseService->success($document, 'Document created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update existing document
     */
    public function updateDocument(string $id, UpdateDocumentRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $document = $this->knowledgeBaseService->updateDocument($id, $data);
            return $this->responseService->success($document, 'Document updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete document
     */
    public function deleteDocument(string $id): JsonResponse
    {
        try {
            $this->knowledgeBaseService->deleteDocument($id);
            return $this->responseService->success(null, 'Document deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get all categories
     */
    public function getAllCategories(): JsonResponse
    {
        try {
            $categories = $this->knowledgeBaseService->getAllCategories();
            return $this->responseService->success($categories);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get category by ID
     */
    public function getCategoryById(string $id): JsonResponse
    {
        try {
            $category = $this->knowledgeBaseService->getCategoryById($id);
            return $this->responseService->success($category);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create new category
     */
    public function createCategory(CreateCategoryRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $category = $this->knowledgeBaseService->createCategory($data);
            return $this->responseService->success($category, 'Category created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update existing category
     */
    public function updateCategory(string $id, UpdateCategoryRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $category = $this->knowledgeBaseService->updateCategory($id, $data);
            return $this->responseService->success($category, 'Category updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete category
     */
    public function deleteCategory(string $id): JsonResponse
    {
        try {
            $this->knowledgeBaseService->deleteCategory($id);
            return $this->responseService->success(null, 'Category deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get knowledge base settings
     */
    public function getSettings(): JsonResponse
    {
        try {
            $settings = $this->knowledgeBaseService->getSettings();
            return $this->responseService->success($settings);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update knowledge base settings
     */
    public function updateSettings(UpdateSettingsRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $settings = $this->knowledgeBaseService->updateSettings($data);
            return $this->responseService->success($settings, 'Settings updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Search documents
     */
    public function searchDocuments(Request $request): JsonResponse
    {
        try {
            $query = $request->get('query', '');
            $documents = $this->knowledgeBaseService->searchDocuments($query);
            return $this->responseService->success($documents);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }
}
