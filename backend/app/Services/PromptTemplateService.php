<?php

namespace App\Services;

use App\Models\PromptTemplate;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PromptTemplateService
{
    /**
     * Get all prompt templates
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllTemplates(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = PromptTemplate::query();

        // Apply filters
        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (isset($filters['category']) && $filters['category'] !== 'all') {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get template by ID
     *
     * @param int $id
     * @return PromptTemplate|null
     */
    public function getTemplateById(int $id): ?PromptTemplate
    {
        return PromptTemplate::find($id);
    }

    /**
     * Create a new prompt template
     *
     * @param array $data
     * @return PromptTemplate
     */
    public function createTemplate(array $data): PromptTemplate
    {
        // If this template is set as default, update others to non-default
        if (isset($data['is_default']) && $data['is_default']) {
            $this->resetDefaultTemplates();
        }

        return PromptTemplate::create($data);
    }

    /**
     * Update a prompt template
     *
     * @param int $id
     * @param array $data
     * @return PromptTemplate|null
     */
    public function updateTemplate(int $id, array $data): ?PromptTemplate
    {
        $template = PromptTemplate::find($id);

        if (!$template) {
            return null;
        }

        // If this template is set as default, update others to non-default
        if (isset($data['is_default']) && $data['is_default']) {
            $this->resetDefaultTemplates();
        }

        $template->update($data);
        return $template;
    }

    /**
     * Delete a prompt template
     *
     * @param int $id
     * @return bool
     */
    public function deleteTemplate(int $id): bool
    {
        $template = PromptTemplate::find($id);

        if (!$template) {
            return false;
        }

        // Don't allow deletion of default templates
        if ($template->is_default) {
            return false;
        }

        return $template->delete();
    }

    /**
     * Increment the usage count of a template
     *
     * @param int $id
     * @return bool
     */
    public function incrementUsageCount(int $id): bool
    {
        $template = PromptTemplate::find($id);

        if (!$template) {
            return false;
        }

        $template->usage_count += 1;
        return $template->save();
    }

    /**
     * Get available categories
     *
     * @return array
     */
    public function getCategories(): array
    {
        return PromptTemplate::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->toArray();
    }

    /**
     * Reset all templates to non-default
     *
     * @return void
     */
    private function resetDefaultTemplates(): void
    {
        PromptTemplate::where('is_default', true)
            ->update(['is_default' => false]);
    }
}