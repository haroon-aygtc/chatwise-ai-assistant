<?php

namespace App\Services;

use App\Models\DocumentCategory;
use App\Models\KnowledgeDocument;
use App\Models\KnowledgeBaseSetting;
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
}
