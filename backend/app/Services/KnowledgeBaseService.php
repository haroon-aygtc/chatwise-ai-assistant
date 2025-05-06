<?php

namespace App\Services;

use App\Models\DocumentCategory;
use App\Models\KnowledgeDocument;
use App\Models\KnowledgeBaseSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class KnowledgeBaseService
{
    /**
     * Get all documents
     */
    public function getAllDocuments(): Collection
    {
        return KnowledgeDocument::with('category')->get();
    }

    /**
     * Get document by ID
     */
    public function getDocumentById(string $id): KnowledgeDocument
    {
        return KnowledgeDocument::with('category')->findOrFail($id);
    }

    /**
     * Create a new document
     */
    public function createDocument(array $data, ?UploadedFile $file = null): KnowledgeDocument
    {
        $document = new KnowledgeDocument();
        $document->title = $data['title'];
        $document->description = $data['description'] ?? null;
        $document->content = $data['content'] ?? '';
        $document->category_id = $data['category_id'] ?? null;
        $document->tags = $data['tags'] ?? [];
        $document->status = 'processing';

        if ($file) {
            $filePath = $file->store('knowledge-base', 'public');
            $document->file_path = $filePath;
            $document->file_type = $file->getClientOriginalExtension();
            $document->file_size = $file->getSize();

            // Extract content based on file type if no content provided
            if (empty($data['content'])) {
                $document->content = $this->extractContentFromFile($file);
            }
        }

        $document->save();

        // Schedule a job to process the document for indexing
        // This would be implemented in a real application
        // dispatch(new ProcessKnowledgeDocument($document));

        return $document;
    }

    /**
     * Update an existing document
     */
    public function updateDocument(string $id, array $data): KnowledgeDocument
    {
        $document = KnowledgeDocument::findOrFail($id);

        if (isset($data['title'])) {
            $document->title = $data['title'];
        }

        if (array_key_exists('description', $data)) {
            $document->description = $data['description'];
        }

        if (isset($data['content'])) {
            $document->content = $data['content'];
        }

        if (array_key_exists('category_id', $data)) {
            $document->category_id = $data['category_id'];
        }

        if (isset($data['tags'])) {
            $document->tags = $data['tags'];
        }

        if (isset($data['status'])) {
            $document->status = $data['status'];

            if ($data['status'] === 'indexed') {
                $document->last_indexed_at = now();
            }
        }

        $document->save();

        return $document;
    }

    /**
     * Delete a document
     */
    public function deleteDocument(string $id): bool
    {
        $document = KnowledgeDocument::findOrFail($id);

        // Remove the file if it exists
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        return $document->delete();
    }

    /**
     * Get all categories
     */
    public function getAllCategories(): Collection
    {
        return DocumentCategory::withCount('documents')->get();
    }

    /**
     * Get category by ID
     */
    public function getCategoryById(string $id): DocumentCategory
    {
        return DocumentCategory::withCount('documents')->findOrFail($id);
    }

    /**
     * Create a new category
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
     */
    public function updateCategory(string $id, array $data): DocumentCategory
    {
        $category = DocumentCategory::findOrFail($id);

        if (isset($data['name'])) {
            $category->name = $data['name'];
        }

        if (array_key_exists('description', $data)) {
            $category->description = $data['description'];
        }

        $category->save();

        return $category;
    }

    /**
     * Delete a category
     */
    public function deleteCategory(string $id): bool
    {
        return DocumentCategory::findOrFail($id)->delete();
    }

    /**
     * Get knowledge base settings
     */
    public function getSettings(): KnowledgeBaseSetting
    {
        $settings = KnowledgeBaseSetting::first();

        if (!$settings) {
            $settings = KnowledgeBaseSetting::create([
                'is_enabled' => true,
                'priority' => 'medium',
                'include_citations' => true,
            ]);
        }

        return $settings;
    }

    /**
     * Update knowledge base settings
     */
    public function updateSettings(array $data): KnowledgeBaseSetting
    {
        $settings = $this->getSettings();

        if (isset($data['is_enabled'])) {
            $settings->is_enabled = $data['is_enabled'];
        }

        if (isset($data['priority'])) {
            $settings->priority = $data['priority'];
        }

        if (isset($data['include_citations'])) {
            $settings->include_citations = $data['include_citations'];
        }

        $settings->save();

        return $settings;
    }

    /**
     * Search documents
     */
    public function searchDocuments(string $query): Collection
    {
        return KnowledgeDocument::where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('content', 'like', "%{$query}%")
            ->orWhereJsonContains('tags', $query)
            ->with('category')
            ->get();
    }

    /**
     * Extract content from uploaded file
     * In a real app, this would use libraries to parse different file types
     */
    private function extractContentFromFile(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        // This is a simplified version - in a real app you'd use specialized libraries
        switch ($extension) {
            case 'txt':
                return file_get_contents($file->getRealPath());
            case 'pdf':
            case 'docx':
            case 'doc':
            case 'md':
                return "Content extraction from {$extension} files would be implemented in a production environment.";
            default:
                return '';
        }
    }
}
