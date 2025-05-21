<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Requests\UpdateSettingsRequest;
use App\Http\Requests\CreateResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Http\Requests\CreateFileRequest;
use App\Http\Requests\UpdateFileRequest;
use App\Http\Requests\CreateDirectoryRequest;
use App\Http\Requests\UpdateDirectoryRequest;
use App\Http\Requests\CreateWebResourceRequest;
use App\Http\Requests\UpdateWebResourceRequest;
use App\Http\Requests\CreateCollectionRequest;
use App\Http\Requests\UpdateCollectionRequest;
use App\Http\Requests\CreateKnowledgeProfileRequest;
use App\Http\Requests\UpdateKnowledgeProfileRequest;
use App\Http\Requests\CreateContextScopeRequest;
use App\Http\Requests\UpdateContextScopeRequest;
use App\Http\Requests\SearchResourcesRequest;
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
     * Get all data sources
     */
    public function getAllDataSources(): JsonResponse
    {
        try {
            $dataSources = $this->knowledgeBaseService->getAllDataSources();
            return $this->responseService->success($dataSources);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get data source by ID
     */
    public function getDataSourceById(string $id): JsonResponse
    {
        try {
            $dataSource = $this->knowledgeBaseService->getDataSourceById($id);
            if (!$dataSource) {
                return $this->responseService->error('Data source not found', 404);
            }
            return $this->responseService->success($dataSource);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new data source
     */
    public function createDataSource(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $dataSource = $this->knowledgeBaseService->createDataSource($data);
            return $this->responseService->success($dataSource, 'Data source created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a data source
     */
    public function updateDataSource(string $id, Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $dataSource = $this->knowledgeBaseService->updateDataSource($id, $data);
            if (!$dataSource) {
                return $this->responseService->error('Data source not found', 404);
            }
            return $this->responseService->success($dataSource, 'Data source updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a data source
     */
    public function deleteDataSource(string $id): JsonResponse
    {
        try {
            $result = $this->knowledgeBaseService->deleteDataSource($id);
            if (!$result) {
                return $this->responseService->error('Data source not found', 404);
            }
            return $this->responseService->success(null, 'Data source deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Test a data source
     */
    public function testDataSource(string $id, Request $request): JsonResponse
    {
        try {
            $query = $request->input('query');
            $result = $this->knowledgeBaseService->testDataSource($id, $query);
            return $this->responseService->success($result);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get data source settings
     */
    public function getDataSourceSettings(): JsonResponse
    {
        try {
            $settings = $this->knowledgeBaseService->getDataSourceSettings();
            return $this->responseService->success($settings);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update data source settings
     */
    public function updateDataSourceSettings(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $settings = $this->knowledgeBaseService->updateDataSourceSettings($data);
            return $this->responseService->success($settings, 'Data source settings updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
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

    /**
     * Get all resources
     */
    public function getAllResources(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 20);
            $page = $request->get('page', 1);

            // Sanitize and normalize filters
            $filters = [];

            if ($request->has('type')) {
                $filters['type'] = $request->get('type');
            }

            if ($request->has('collection_id')) {
                $filters['collection_id'] = $request->get('collection_id');
            }

            if ($request->has('is_active')) {
                $filters['is_active'] = filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN);
            }

            if ($request->has('search')) {
                $filters['search'] = $request->get('search');
            }

            if ($request->has('tags')) {
                $filters['tags'] = is_array($request->get('tags'))
                    ? $request->get('tags')
                    : explode(',', $request->get('tags'));
            }

            // Get resources with pagination and filtering
            $resources = $this->knowledgeBaseService->getAllResources(
                (int) $page,
                (int) $perPage,
                $filters
            );

            return $this->responseService->success($resources);
        } catch (\Exception $e) {
            // Log detailed error
            \Log::error("Error fetching knowledge base resources: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            return $this->responseService->error(
                'Failed to retrieve knowledge base resources: ' . $e->getMessage()
            );
        }
    }

    /**
     * Get resource by ID
     */
    public function getResourceById(string $id, Request $request): JsonResponse
    {
        try {
            $type = $request->get('type');
            $resource = $this->knowledgeBaseService->getResourceById($id, $type);

            if (!$resource) {
                return $this->responseService->error('Resource not found', 404);
            }

            return $this->responseService->success($resource);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new resource
     */
    public function createResource(CreateResourceRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->createResource($data);
            return $this->responseService->success($resource, 'Resource created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a resource
     */
    public function updateResource(string $id, UpdateResourceRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->updateResource($id, $data);

            if (!$resource) {
                return $this->responseService->error('Resource not found', 404);
            }

            return $this->responseService->success($resource, 'Resource updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a resource
     */
    public function deleteResource(string $id): JsonResponse
    {
        try {
            $result = $this->knowledgeBaseService->deleteResource($id);

            if (!$result) {
                return $this->responseService->error('Resource not found', 404);
            }

            return $this->responseService->success(null, 'Resource deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Search resources
     */
    public function searchResources(SearchResourcesRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resources = $this->knowledgeBaseService->searchResources($data);
            return $this->responseService->success($resources);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Upload a file
     */
    public function uploadFile(CreateFileRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $file = $request->file('file');

            if (!$file) {
                return $this->responseService->error('No file uploaded', 400);
            }

            $resource = $this->knowledgeBaseService->uploadFile($data, $file);
            return $this->responseService->success($resource, 'File uploaded successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a file resource
     */
    public function updateFileResource(string $id, UpdateFileRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->updateFileResource($id, $data);

            if (!$resource) {
                return $this->responseService->error('File resource not found', 404);
            }

            return $this->responseService->success($resource, 'File resource updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Reprocess a file
     */
    public function reprocessFile(string $id): JsonResponse
    {
        try {
            $resource = $this->knowledgeBaseService->reprocessFile($id);

            if (!$resource) {
                return $this->responseService->error('File resource not found', 404);
            }

            return $this->responseService->success($resource, 'File reprocessed successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a directory resource
     */
    public function createDirectory(CreateDirectoryRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->createDirectory($data);
            return $this->responseService->success($resource, 'Directory created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a directory resource
     */
    public function updateDirectory(string $id, UpdateDirectoryRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->updateDirectory($id, $data);

            if (!$resource) {
                return $this->responseService->error('Directory resource not found', 404);
            }

            return $this->responseService->success($resource, 'Directory updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Sync a directory
     */
    public function syncDirectory(string $id): JsonResponse
    {
        try {
            $resource = $this->knowledgeBaseService->syncDirectory($id);

            if (!$resource) {
                return $this->responseService->error('Directory resource not found', 404);
            }

            return $this->responseService->success($resource, 'Directory synced successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a web resource
     */
    public function createWebResource(CreateWebResourceRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->createWebResource($data);
            return $this->responseService->success($resource, 'Web resource created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a web resource
     */
    public function updateWebResource(string $id, UpdateWebResourceRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $resource = $this->knowledgeBaseService->updateWebResource($id, $data);

            if (!$resource) {
                return $this->responseService->error('Web resource not found', 404);
            }

            return $this->responseService->success($resource, 'Web resource updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Scrape a web resource
     */
    public function scrapeWebResource(string $id): JsonResponse
    {
        try {
            $resource = $this->knowledgeBaseService->scrapeWebResource($id);

            if (!$resource) {
                return $this->responseService->error('Web resource not found', 404);
            }

            return $this->responseService->success($resource, 'Web resource scraped successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get all collections
     */
    public function getAllCollections(): JsonResponse
    {
        try {
            $collections = $this->knowledgeBaseService->getAllCollections();
            return $this->responseService->success($collections);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get collection by ID
     */
    public function getCollectionById(string $id): JsonResponse
    {
        try {
            $collection = $this->knowledgeBaseService->getCollectionById($id);

            if (!$collection) {
                return $this->responseService->error('Collection not found', 404);
            }

            return $this->responseService->success($collection);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new collection
     */
    public function createCollection(CreateCollectionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $collection = $this->knowledgeBaseService->createCollection($data);
            return $this->responseService->success($collection, 'Collection created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a collection
     */
    public function updateCollection(string $id, UpdateCollectionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $collection = $this->knowledgeBaseService->updateCollection($id, $data);

            if (!$collection) {
                return $this->responseService->error('Collection not found', 404);
            }

            return $this->responseService->success($collection, 'Collection updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a collection
     */
    public function deleteCollection(string $id): JsonResponse
    {
        try {
            $result = $this->knowledgeBaseService->deleteCollection($id);

            if (!$result) {
                return $this->responseService->error('Collection not found', 404);
            }

            return $this->responseService->success(null, 'Collection deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get all knowledge profiles
     */
    public function getAllProfiles(): JsonResponse
    {
        try {
            $profiles = $this->knowledgeBaseService->getAllProfiles();
            return $this->responseService->success($profiles);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get knowledge profile by ID
     */
    public function getProfileById(string $id): JsonResponse
    {
        try {
            $profile = $this->knowledgeBaseService->getProfileById($id);

            if (!$profile) {
                return $this->responseService->error('Knowledge profile not found', 404);
            }

            return $this->responseService->success($profile);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new knowledge profile
     */
    public function createProfile(CreateKnowledgeProfileRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $profile = $this->knowledgeBaseService->createProfile($data);
            return $this->responseService->success($profile, 'Knowledge profile created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a knowledge profile
     */
    public function updateProfile(string $id, UpdateKnowledgeProfileRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $profile = $this->knowledgeBaseService->updateProfile($id, $data);

            if (!$profile) {
                return $this->responseService->error('Knowledge profile not found', 404);
            }

            return $this->responseService->success($profile, 'Knowledge profile updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a knowledge profile
     */
    public function deleteProfile(string $id): JsonResponse
    {
        try {
            $result = $this->knowledgeBaseService->deleteProfile($id);

            if (!$result) {
                return $this->responseService->error('Knowledge profile not found', 404);
            }

            return $this->responseService->success(null, 'Knowledge profile deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get all context scopes
     */
    public function getAllContextScopes(): JsonResponse
    {
        try {
            $scopes = $this->knowledgeBaseService->getAllContextScopes();
            return $this->responseService->success($scopes);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get context scope by ID
     */
    public function getContextScopeById(string $id): JsonResponse
    {
        try {
            $scope = $this->knowledgeBaseService->getContextScopeById($id);

            if (!$scope) {
                return $this->responseService->error('Context scope not found', 404);
            }

            return $this->responseService->success($scope);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new context scope
     */
    public function createContextScope(CreateContextScopeRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $scope = $this->knowledgeBaseService->createContextScope($data);
            return $this->responseService->success($scope, 'Context scope created successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update a context scope
     */
    public function updateContextScope(string $id, UpdateContextScopeRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $scope = $this->knowledgeBaseService->updateContextScope($id, $data);

            if (!$scope) {
                return $this->responseService->error('Context scope not found', 404);
            }

            return $this->responseService->success($scope, 'Context scope updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a context scope
     */
    public function deleteContextScope(string $id): JsonResponse
    {
        try {
            $result = $this->knowledgeBaseService->deleteContextScope($id);

            if (!$result) {
                return $this->responseService->error('Context scope not found', 404);
            }

            return $this->responseService->success(null, 'Context scope deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Upload a document (legacy method)
     */
    public function uploadDocument(Request $request): JsonResponse
    {
        try {
            $file = $request->file('file');

            if (!$file) {
                return $this->responseService->error('No file uploaded', 400);
            }

            $data = $request->all();
            $document = $this->knowledgeBaseService->createDocument($data, $file);
            return $this->responseService->success($document, 'Document uploaded successfully', 201);
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }
}
