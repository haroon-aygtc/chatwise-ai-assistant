<?php

namespace App\Services;

use App\Models\DocumentCategory;
use App\Models\KnowledgeDocument;
use App\Models\KnowledgeBaseSetting;
use App\Models\KnowledgeResource;
use App\Models\FileResource;
use App\Models\DirectoryResource;
use App\Models\WebResource;
use App\Models\ResourceCollection;
use App\Models\KnowledgeProfile;
use App\Models\ContextScope;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class KnowledgeBaseService
{
    /**
     * Get all documents with pagination
     *
     * @param int $perPage
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAllDocuments(int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        $query = KnowledgeDocument::query();

        // Apply filters
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->with('category')
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Get a document by ID
     *
     * @param string $id
     * @return KnowledgeDocument|null
     */
    public function getDocumentById(string $id): ?KnowledgeDocument
    {
        return KnowledgeDocument::with('category')->find($id);
    }

    /**
     * Create a new document
     *
     * @param array $data
     * @param UploadedFile|null $file
     * @return KnowledgeDocument
     */
    public function createDocument(array $data, ?UploadedFile $file = null): KnowledgeDocument
    {
        $documentData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'content' => $data['content'] ?? '',
            'category_id' => $data['category_id'],
            'tags' => json_decode($data['tags'] ?? '[]'),
            'status' => $data['status'] ?? 'active',
        ];

        // Handle file upload
        if ($file) {
            $path = $file->store('knowledge-documents', 'public');
            $documentData['file_path'] = $path;
            $documentData['file_type'] = $file->getClientMimeType();
            $documentData['file_size'] = $file->getSize();

            // Extract content from file if not provided
            if (empty($documentData['content'])) {
                $documentData['content'] = $this->extractContentFromFile($file);
            }
        }

        return KnowledgeDocument::create($documentData);
    }

    /**
     * Extract content from uploaded file
     *
     * @param UploadedFile $file
     * @return string
     */
    protected function extractContentFromFile(UploadedFile $file): string
    {
        $content = '';

        // Simple extraction based on file type
        switch ($file->getClientMimeType()) {
            case 'text/plain':
                $content = file_get_contents($file->getRealPath());
                break;

            case 'application/pdf':
                // Simplified - would need a proper PDF parser in production
                $content = 'PDF content would be extracted here';
                break;

            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                $content = 'Word document content would be extracted here';
                break;

            default:
                $content = 'Content extraction not supported for this file type';
        }

        return $content;
    }

    /**
     * Update an existing document
     *
     * @param string $id
     * @param array $data
     * @return KnowledgeDocument|null
     */
    public function updateDocument(string $id, array $data): ?KnowledgeDocument
    {
        $document = KnowledgeDocument::find($id);

        if (!$document) {
            return null;
        }

        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['content'])) {
            $updateData['content'] = $data['content'];
        }

        if (isset($data['category_id'])) {
            $updateData['category_id'] = $data['category_id'];
        }

        if (isset($data['tags'])) {
            $updateData['tags'] = is_array($data['tags']) ? $data['tags'] : json_decode($data['tags']);
        }

        if (isset($data['status'])) {
            $updateData['status'] = $data['status'];
        }

        $document->update($updateData);
        return $document->fresh();
    }

    /**
     * Delete a document
     *
     * @param string $id
     * @return bool
     */
    public function deleteDocument(string $id): bool
    {
        $document = KnowledgeDocument::find($id);

        if (!$document) {
            return false;
        }

        // Delete the associated file if exists
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        return (bool) $document->delete();
    }

    /**
     * Search documents
     *
     * @param string $query
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchDocuments(string $query, int $perPage = 20): LengthAwarePaginator
    {
        return KnowledgeDocument::where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->orWhereJsonContains('tags', $query)
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get all categories
     *
     * @return Collection
     */
    public function getAllCategories(): Collection
    {
        return DocumentCategory::withCount('documents')->get();
    }

    /**
     * Get a category by ID
     *
     * @param string $id
     * @return DocumentCategory|null
     */
    public function getCategoryById(string $id): ?DocumentCategory
    {
        return DocumentCategory::withCount('documents')->find($id);
    }

    /**
     * Create a new category
     *
     * @param array $data
     * @return DocumentCategory
     */
    public function createCategory(array $data): DocumentCategory
    {
        return DocumentCategory::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);
    }

    /**
     * Update an existing category
     *
     * @param string $id
     * @param array $data
     * @return DocumentCategory|null
     */
    public function updateCategory(string $id, array $data): ?DocumentCategory
    {
        $category = DocumentCategory::find($id);

        if (!$category) {
            return null;
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        $category->update($updateData);
        return $category->fresh();
    }

    /**
     * Delete a category
     *
     * @param string $id
     * @return bool
     */
    public function deleteCategory(string $id): bool
    {
        $category = DocumentCategory::find($id);

        if (!$category) {
            return false;
        }

        // Delete associated documents
        $documents = KnowledgeDocument::where('category_id', $id)->get();

        foreach ($documents as $document) {
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $document->delete();
        }

        return (bool) $category->delete();
    }

    /**
     * Get knowledge base settings
     *
     * @return KnowledgeBaseSetting
     */
    public function getSettings(): KnowledgeBaseSetting
    {
        return KnowledgeBaseSetting::getCurrentSettings();
    }

    /**
     * Update knowledge base settings
     *
     * @param array $data
     * @return KnowledgeBaseSetting
     */
    public function updateSettings(array $data): KnowledgeBaseSetting
    {
        $settings = KnowledgeBaseSetting::getCurrentSettings();

        $updateData = [];

        if (isset($data['is_enabled'])) {
            $updateData['is_enabled'] = (bool) $data['is_enabled'];
        }

        if (isset($data['priority'])) {
            $updateData['priority'] = $data['priority'];
        }

        if (isset($data['include_citations'])) {
            $updateData['include_citations'] = (bool) $data['include_citations'];
        }

        $settings->update($updateData);
        return $settings->fresh();
    }

    /**
     * Get all resources with pagination
     *
     * @param int $page
     * @param int $perPage
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAllResources(int $page = 1, int $perPage = 20, array $filters = []): LengthAwarePaginator
    {
        $query = KnowledgeResource::query();

        // Apply filters
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['type'])) {
            $query->where('resource_type', $filters['type']);
        }

        if (isset($filters['collection_id'])) {
            $query->where('collection_id', $filters['collection_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['tags'])) {
            $tags = is_array($filters['tags']) ? $filters['tags'] : [$filters['tags']];
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        return $query->orderBy('created_at', 'desc')
                    ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get a resource by ID
     *
     * @param string $id
     * @param string|null $type
     * @return KnowledgeResource|null
     */
    public function getResourceById(string $id, ?string $type = null): ?KnowledgeResource
    {
        $query = KnowledgeResource::query();

        if ($type) {
            $query->where('resource_type', $type);
        }

        return $query->find($id);
    }

    /**
     * Create a new resource
     *
     * @param array $data
     * @return KnowledgeResource
     */
    public function createResource(array $data): KnowledgeResource
    {
        $resourceData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'resource_type' => $data['resourceType'],
            'collection_id' => $data['collectionId'] ?? null,
            'tags' => $data['tags'] ?? [],
            'is_active' => $data['isActive'] ?? true,
            'metadata' => $data['metadata'] ?? [],
        ];

        return KnowledgeResource::create($resourceData);
    }

    /**
     * Update an existing resource
     *
     * @param string $id
     * @param array $data
     * @return KnowledgeResource|null
     */
    public function updateResource(string $id, array $data): ?KnowledgeResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource) {
            return null;
        }

        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['collectionId'])) {
            $updateData['collection_id'] = $data['collectionId'];
        }

        if (isset($data['tags'])) {
            $updateData['tags'] = $data['tags'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = $data['metadata'];
        }

        $resource->update($updateData);
        return $resource->fresh();
    }

    /**
     * Delete a resource
     *
     * @param string $id
     * @return bool
     */
    public function deleteResource(string $id): bool
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource) {
            return false;
        }

        // Handle specific resource type cleanup
        switch ($resource->resource_type) {
            case 'FILE_UPLOAD':
                // Delete the associated file if exists
                $fileResource = FileResource::where('resource_id', $id)->first();
                if ($fileResource && $fileResource->file_path) {
                    Storage::disk('public')->delete($fileResource->file_path);
                    $fileResource->delete();
                }
                break;

            case 'DIRECTORY':
                // Delete the directory resource
                DirectoryResource::where('resource_id', $id)->delete();
                break;

            case 'WEB':
                // Delete the web resource
                WebResource::where('resource_id', $id)->delete();
                break;
        }

        return (bool) $resource->delete();
    }

    /**
     * Search resources
     *
     * @param array $searchData
     * @return LengthAwarePaginator
     */
    public function searchResources(array $searchData): LengthAwarePaginator
    {
        $query = KnowledgeResource::query();

        if (isset($searchData['query']) && !empty($searchData['query'])) {
            $searchQuery = $searchData['query'];
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                  ->orWhere('description', 'like', "%{$searchQuery}%")
                  ->orWhereJsonContains('tags', $searchQuery);
            });
        }

        if (isset($searchData['resourceTypes']) && !empty($searchData['resourceTypes'])) {
            $query->whereIn('resource_type', $searchData['resourceTypes']);
        }

        if (isset($searchData['collectionIds']) && !empty($searchData['collectionIds'])) {
            $query->whereIn('collection_id', $searchData['collectionIds']);
        }

        if (isset($searchData['isActive'])) {
            $query->where('is_active', (bool) $searchData['isActive']);
        }

        $perPage = $searchData['perPage'] ?? 20;
        $page = $searchData['page'] ?? 1;

        return $query->orderBy('created_at', 'desc')
                    ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Upload a file
     *
     * @param array $data
     * @param UploadedFile $file
     * @return FileResource
     */
    public function uploadFile(array $data, UploadedFile $file): FileResource
    {
        // Create the base resource
        $resourceData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'resource_type' => 'FILE_UPLOAD',
            'collection_id' => $data['collectionId'] ?? null,
            'tags' => $data['tags'] ?? [],
            'is_active' => $data['isActive'] ?? true,
            'metadata' => $data['metadata'] ?? [],
        ];

        $resource = KnowledgeResource::create($resourceData);

        // Store the file
        $path = $file->store('knowledge-base/files', 'public');

        // Create the file resource
        $fileResource = FileResource::create([
            'resource_id' => $resource->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'content' => $this->extractContentFromFile($file),
            'is_processed' => true,
        ]);

        return $fileResource;
    }

    /**
     * Update a file resource
     *
     * @param string $id
     * @param array $data
     * @return FileResource|null
     */
    public function updateFileResource(string $id, array $data): ?FileResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'FILE_UPLOAD') {
            return null;
        }

        // Update the base resource
        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['collectionId'])) {
            $updateData['collection_id'] = $data['collectionId'];
        }

        if (isset($data['tags'])) {
            $updateData['tags'] = $data['tags'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = $data['metadata'];
        }

        $resource->update($updateData);

        // Update the file resource
        $fileResource = FileResource::where('resource_id', $id)->first();

        if (!$fileResource) {
            return null;
        }

        $fileUpdateData = [];

        if (isset($data['isProcessed'])) {
            $fileUpdateData['is_processed'] = (bool) $data['isProcessed'];
        }

        $fileResource->update($fileUpdateData);
        return $fileResource->fresh();
    }

    /**
     * Reprocess a file
     *
     * @param string $id
     * @return FileResource|null
     */
    public function reprocessFile(string $id): ?FileResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'FILE_UPLOAD') {
            return null;
        }

        $fileResource = FileResource::where('resource_id', $id)->first();

        if (!$fileResource) {
            return null;
        }

        // In a real implementation, this would trigger a background job to reprocess the file
        // For now, we'll just mark it as processed
        $fileResource->update([
            'is_processed' => true,
        ]);

        return $fileResource->fresh();
    }

    /**
     * Create a directory resource
     *
     * @param array $data
     * @return DirectoryResource
     */
    public function createDirectory(array $data): DirectoryResource
    {
        // Create the base resource
        $resourceData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'resource_type' => 'DIRECTORY',
            'collection_id' => $data['collectionId'] ?? null,
            'tags' => $data['tags'] ?? [],
            'is_active' => $data['isActive'] ?? true,
            'metadata' => $data['metadata'] ?? [],
        ];

        $resource = KnowledgeResource::create($resourceData);

        // Create the directory resource
        $directoryResource = DirectoryResource::create([
            'resource_id' => $resource->id,
            'path' => $data['path'],
            'recursive' => $data['recursive'] ?? false,
            'file_types' => $data['fileTypes'] ?? ['pdf', 'doc', 'docx', 'txt'],
            'include_patterns' => $data['includePatterns'] ?? [],
            'exclude_patterns' => $data['excludePatterns'] ?? [],
            'last_synced_at' => null,
            'is_synced' => false,
        ]);

        return $directoryResource;
    }

    /**
     * Update a directory resource
     *
     * @param string $id
     * @param array $data
     * @return DirectoryResource|null
     */
    public function updateDirectory(string $id, array $data): ?DirectoryResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'DIRECTORY') {
            return null;
        }

        // Update the base resource
        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['collectionId'])) {
            $updateData['collection_id'] = $data['collectionId'];
        }

        if (isset($data['tags'])) {
            $updateData['tags'] = $data['tags'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = $data['metadata'];
        }

        $resource->update($updateData);

        // Update the directory resource
        $directoryResource = DirectoryResource::where('resource_id', $id)->first();

        if (!$directoryResource) {
            return null;
        }

        $dirUpdateData = [];

        if (isset($data['path'])) {
            $dirUpdateData['path'] = $data['path'];
        }

        if (isset($data['recursive'])) {
            $dirUpdateData['recursive'] = (bool) $data['recursive'];
        }

        if (isset($data['fileTypes'])) {
            $dirUpdateData['file_types'] = $data['fileTypes'];
        }

        if (isset($data['includePatterns'])) {
            $dirUpdateData['include_patterns'] = $data['includePatterns'];
        }

        if (isset($data['excludePatterns'])) {
            $dirUpdateData['exclude_patterns'] = $data['excludePatterns'];
        }

        $directoryResource->update($dirUpdateData);
        return $directoryResource->fresh();
    }

    /**
     * Sync a directory
     *
     * @param string $id
     * @return DirectoryResource|null
     */
    public function syncDirectory(string $id): ?DirectoryResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'DIRECTORY') {
            return null;
        }

        $directoryResource = DirectoryResource::where('resource_id', $id)->first();

        if (!$directoryResource) {
            return null;
        }

        // In a real implementation, this would trigger a background job to sync the directory
        // For now, we'll just mark it as synced
        $directoryResource->update([
            'last_synced_at' => now(),
            'is_synced' => true,
        ]);

        return $directoryResource->fresh();
    }

    /**
     * Create a web resource
     *
     * @param array $data
     * @return WebResource
     */
    public function createWebResource(array $data): WebResource
    {
        // Create the base resource
        $resourceData = [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'resource_type' => 'WEB',
            'collection_id' => $data['collectionId'] ?? null,
            'tags' => $data['tags'] ?? [],
            'is_active' => $data['isActive'] ?? true,
            'metadata' => $data['metadata'] ?? [],
        ];

        $resource = KnowledgeResource::create($resourceData);

        // Create the web resource
        $webResource = WebResource::create([
            'resource_id' => $resource->id,
            'url' => $data['url'],
            'scraping_depth' => $data['scrapingDepth'] ?? 1,
            'include_selector_patterns' => $data['includeSelectorPatterns'] ?? [],
            'exclude_selector_patterns' => $data['excludeSelectorPatterns'] ?? [],
            'last_scraped_at' => null,
            'scraping_status' => 'NEVER_SCRAPED',
            'content' => '',
        ]);

        return $webResource;
    }

    /**
     * Update a web resource
     *
     * @param string $id
     * @param array $data
     * @return WebResource|null
     */
    public function updateWebResource(string $id, array $data): ?WebResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'WEB') {
            return null;
        }

        // Update the base resource
        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['collectionId'])) {
            $updateData['collection_id'] = $data['collectionId'];
        }

        if (isset($data['tags'])) {
            $updateData['tags'] = $data['tags'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['metadata'])) {
            $updateData['metadata'] = $data['metadata'];
        }

        $resource->update($updateData);

        // Update the web resource
        $webResource = WebResource::where('resource_id', $id)->first();

        if (!$webResource) {
            return null;
        }

        $webUpdateData = [];

        if (isset($data['url'])) {
            $webUpdateData['url'] = $data['url'];
        }

        if (isset($data['scrapingDepth'])) {
            $webUpdateData['scraping_depth'] = $data['scrapingDepth'];
        }

        if (isset($data['includeSelectorPatterns'])) {
            $webUpdateData['include_selector_patterns'] = $data['includeSelectorPatterns'];
        }

        if (isset($data['excludeSelectorPatterns'])) {
            $webUpdateData['exclude_selector_patterns'] = $data['excludeSelectorPatterns'];
        }

        $webResource->update($webUpdateData);

        // If scrapeNow is true, trigger scraping
        if (isset($data['scrapeNow']) && $data['scrapeNow']) {
            return $this->scrapeWebResource($id);
        }

        return $webResource->fresh();
    }

    /**
     * Scrape a web resource
     *
     * @param string $id
     * @return WebResource|null
     */
    public function scrapeWebResource(string $id): ?WebResource
    {
        $resource = KnowledgeResource::find($id);

        if (!$resource || $resource->resource_type !== 'WEB') {
            return null;
        }

        $webResource = WebResource::where('resource_id', $id)->first();

        if (!$webResource) {
            return null;
        }

        // In a real implementation, this would trigger a background job to scrape the web resource
        // For now, we'll just mark it as scraped
        $webResource->update([
            'last_scraped_at' => now(),
            'scraping_status' => 'SCRAPED',
            'content' => 'Scraped content would be here',
        ]);

        return $webResource->fresh();
    }

    /**
     * Get all collections
     *
     * @return Collection
     */
    public function getAllCollections(): Collection
    {
        return ResourceCollection::all();
    }

    /**
     * Get a collection by ID
     *
     * @param string $id
     * @return ResourceCollection|null
     */
    public function getCollectionById(string $id): ?ResourceCollection
    {
        return ResourceCollection::find($id);
    }

    /**
     * Create a new collection
     *
     * @param array $data
     * @return ResourceCollection
     */
    public function createCollection(array $data): ResourceCollection
    {
        return ResourceCollection::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['isActive'] ?? true,
        ]);
    }

    /**
     * Update a collection
     *
     * @param string $id
     * @param array $data
     * @return ResourceCollection|null
     */
    public function updateCollection(string $id, array $data): ?ResourceCollection
    {
        $collection = ResourceCollection::find($id);

        if (!$collection) {
            return null;
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        $collection->update($updateData);
        return $collection->fresh();
    }

    /**
     * Delete a collection
     *
     * @param string $id
     * @return bool
     */
    public function deleteCollection(string $id): bool
    {
        $collection = ResourceCollection::find($id);

        if (!$collection) {
            return false;
        }

        // Update resources to remove collection_id
        KnowledgeResource::where('collection_id', $id)->update(['collection_id' => null]);

        return (bool) $collection->delete();
    }

    /**
     * Get all knowledge profiles
     *
     * @return Collection
     */
    public function getAllProfiles(): Collection
    {
        return KnowledgeProfile::all();
    }

    /**
     * Get a knowledge profile by ID
     *
     * @param string $id
     * @return KnowledgeProfile|null
     */
    public function getProfileById(string $id): ?KnowledgeProfile
    {
        return KnowledgeProfile::find($id);
    }

    /**
     * Create a new knowledge profile
     *
     * @param array $data
     * @return KnowledgeProfile
     */
    public function createProfile(array $data): KnowledgeProfile
    {
        return KnowledgeProfile::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['isActive'] ?? true,
            'collection_ids' => $data['collectionIds'] ?? [],
            'resource_ids' => $data['resourceIds'] ?? [],
            'settings' => $data['settings'] ?? [],
        ]);
    }

    /**
     * Update a knowledge profile
     *
     * @param string $id
     * @param array $data
     * @return KnowledgeProfile|null
     */
    public function updateProfile(string $id, array $data): ?KnowledgeProfile
    {
        $profile = KnowledgeProfile::find($id);

        if (!$profile) {
            return null;
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['collectionIds'])) {
            $updateData['collection_ids'] = $data['collectionIds'];
        }

        if (isset($data['resourceIds'])) {
            $updateData['resource_ids'] = $data['resourceIds'];
        }

        if (isset($data['settings'])) {
            $updateData['settings'] = $data['settings'];
        }

        $profile->update($updateData);
        return $profile->fresh();
    }

    /**
     * Delete a knowledge profile
     *
     * @param string $id
     * @return bool
     */
    public function deleteProfile(string $id): bool
    {
        $profile = KnowledgeProfile::find($id);

        if (!$profile) {
            return false;
        }

        return (bool) $profile->delete();
    }

    /**
     * Get all context scopes
     *
     * @return Collection
     */
    public function getAllContextScopes(): Collection
    {
        return ContextScope::all();
    }

    /**
     * Get a context scope by ID
     *
     * @param string $id
     * @return ContextScope|null
     */
    public function getContextScopeById(string $id): ?ContextScope
    {
        return ContextScope::find($id);
    }

    /**
     * Create a new context scope
     *
     * @param array $data
     * @return ContextScope
     */
    public function createContextScope(array $data): ContextScope
    {
        return ContextScope::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['isActive'] ?? true,
            'scope_type' => $data['scopeType'],
            'conditions' => $data['conditions'] ?? [],
        ]);
    }

    /**
     * Update a context scope
     *
     * @param string $id
     * @param array $data
     * @return ContextScope|null
     */
    public function updateContextScope(string $id, array $data): ?ContextScope
    {
        $scope = ContextScope::find($id);

        if (!$scope) {
            return null;
        }

        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }

        if (isset($data['isActive'])) {
            $updateData['is_active'] = (bool) $data['isActive'];
        }

        if (isset($data['scopeType'])) {
            $updateData['scope_type'] = $data['scopeType'];
        }

        if (isset($data['conditions'])) {
            $updateData['conditions'] = $data['conditions'];
        }

        $scope->update($updateData);
        return $scope->fresh();
    }

    /**
     * Delete a context scope
     *
     * @param string $id
     * @return bool
     */
    public function deleteContextScope(string $id): bool
    {
        $scope = ContextScope::find($id);

        if (!$scope) {
            return false;
        }

        return (bool) $scope->delete();
    }
}
