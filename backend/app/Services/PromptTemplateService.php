<?php

namespace App\Services;

use App\Models\PromptTemplate;
use App\Models\SystemPrompt;
use App\Models\AIModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection as IlluminateCollection;

class PromptTemplateService
{
    /**
     * Get all prompt templates
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator|Collection
     */
    public function getAllTemplates(array $filters = [], int $perPage = 15)
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

        if (isset($filters['category']) && !empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // If pagination is disabled, return all results
        if ($perPage === -1) {
            return $query->orderBy('created_at', 'desc')->get();
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

        // Ensure variables field is properly handled
        if (isset($data['variables']) && is_array($data['variables'])) {
            $data['variables'] = json_encode($data['variables']);
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

        // Ensure variables field is properly handled
        if (isset($data['variables']) && is_array($data['variables'])) {
            $data['variables'] = json_encode($data['variables']);
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

        $template->usage_count = ($template->usage_count ?? 0) + 1;
        return $template->save();
    }

    /**
     * Get available categories
     *
     * @return array
     */
    public function getCategories(): array
    {
        $categories = PromptTemplate::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->pluck('category')
            ->toArray();

        // Transform to a collection of objects with name field
        return array_map(function($category) {
            return ['name' => $category];
        }, $categories);
    }

    /**
     * Get pre-defined template library
     *
     * @return array
     */
    public function getTemplateLibrary(): array
    {
        // This would typically come from a database table with pre-defined templates
        // For now, we return a set of hardcoded examples
        $libraryTemplates = [
            [
                'id' => 'lib-1',
                'name' => 'Customer Support Response',
                'description' => 'Template for responding to customer inquiries',
                'category' => 'Customer Support',
                'template' => "Hello {{customer_name}},\n\nThank you for reaching out to our support team about your {{issue_type}}.\n\n{{response_content}}\n\nIf you have any further questions, please don't hesitate to ask.\n\nBest regards,\n{{agent_name}}\nCustomer Support Team",
                'variables' => json_encode([
                    ['name' => 'customer_name', 'description' => 'Customer\'s name', 'required' => true],
                    ['name' => 'issue_type', 'description' => 'Type of customer issue', 'required' => true],
                    ['name' => 'response_content', 'description' => 'Main response content', 'required' => true],
                    ['name' => 'agent_name', 'description' => 'Support agent\'s name', 'required' => true]
                ]),
                'is_library' => true
            ],
            [
                'id' => 'lib-2',
                'name' => 'Product Description',
                'description' => 'Template for generating product descriptions',
                'category' => 'Marketing',
                'template' => "# {{product_name}}\n\n## Description\n{{product_description}}\n\n## Key Features\n- {{feature_1}}\n- {{feature_2}}\n- {{feature_3}}\n\n## Specifications\n{{specifications}}\n\n## Price\n{{price}}\n\n*{{disclaimer}}*",
                'variables' => json_encode([
                    ['name' => 'product_name', 'description' => 'Name of the product', 'required' => true],
                    ['name' => 'product_description', 'description' => 'Brief description of the product', 'required' => true],
                    ['name' => 'feature_1', 'description' => 'First key feature', 'required' => true],
                    ['name' => 'feature_2', 'description' => 'Second key feature', 'required' => true],
                    ['name' => 'feature_3', 'description' => 'Third key feature', 'required' => true],
                    ['name' => 'specifications', 'description' => 'Technical specifications', 'required' => true],
                    ['name' => 'price', 'description' => 'Product price', 'required' => true],
                    ['name' => 'disclaimer', 'description' => 'Legal disclaimer', 'required' => false]
                ]),
                'is_library' => true
            ],
            [
                'id' => 'lib-3',
                'name' => 'Meeting Summary',
                'description' => 'Template for summarizing meeting notes',
                'category' => 'Business',
                'template' => "# Meeting Summary: {{meeting_title}}\n\n**Date**: {{meeting_date}}\n**Participants**: {{participants}}\n\n## Agenda\n{{agenda}}\n\n## Key Discussion Points\n{{discussion_points}}\n\n## Action Items\n{{action_items}}\n\n## Next Steps\n{{next_steps}}\n\n## Next Meeting\n{{next_meeting_date}}",
                'variables' => json_encode([
                    ['name' => 'meeting_title', 'description' => 'Title of the meeting', 'required' => true],
                    ['name' => 'meeting_date', 'description' => 'Date of the meeting', 'required' => true],
                    ['name' => 'participants', 'description' => 'List of participants', 'required' => true],
                    ['name' => 'agenda', 'description' => 'Meeting agenda items', 'required' => true],
                    ['name' => 'discussion_points', 'description' => 'Key points discussed', 'required' => true],
                    ['name' => 'action_items', 'description' => 'Tasks assigned during meeting', 'required' => true],
                    ['name' => 'next_steps', 'description' => 'Follow-up actions', 'required' => false],
                    ['name' => 'next_meeting_date', 'description' => 'Date of the next meeting', 'required' => false]
                ]),
                'is_library' => true
            ]
        ];

        return $libraryTemplates;
    }

    /**
     * Test a template with variables and optionally with an AI model
     *
     * @param int $id
     * @param array $variables
     * @param string|null $modelId
     * @return array|null
     */
    public function testTemplate(int $id, array $variables, ?string $modelId = null): ?array
    {
        $template = $this->getTemplateById($id);

        if (!$template) {
            return null;
        }

        // Render the template with provided variables
        $renderedTemplate = $this->renderTemplate($template->template, $variables);

        $result = [
            'renderedTemplate' => $renderedTemplate
        ];

        // If a model ID is provided, generate AI response
        if ($modelId) {
            try {
                $aiModel = AIModel::find($modelId);

                if ($aiModel) {
                    // This would call your AI service to generate a response
                    // Here we're just simulating a response
                    $result['aiResponse'] = "This is a simulated AI response for testing. In production, this would use the actual AI model ({$aiModel->name}) to generate a response based on the rendered template.";
                }
            } catch (\Exception $e) {
                Log::error('Error generating AI response: ' . $e->getMessage());
            }
        }

        return $result;
    }

    /**
     * Render a template by replacing variables with values
     *
     * @param string $template
     * @param array $variables
     * @return string
     */
    private function renderTemplate(string $template, array $variables): string
    {
        $rendered = $template;

        foreach ($variables as $key => $value) {
            $rendered = str_replace("{{" . $key . "}}", $value, $rendered);
        }

        return $rendered;
    }

    /**
     * Get system prompt
     *
     * @return array
     */
    public function getSystemPrompt(): array
    {
        // Get the system prompt from database or create default if it doesn't exist
        $systemPrompt = SystemPrompt::first();

        if (!$systemPrompt) {
            $systemPrompt = SystemPrompt::create([
                'content' => "You are an AI assistant. Be helpful, concise, and accurate in your responses.",
                'version' => 1,
                'is_active' => true
            ]);
        }

        return [
            'content' => $systemPrompt->content,
            'version' => $systemPrompt->version,
            'isActive' => $systemPrompt->is_active
        ];
    }

    /**
     * Update system prompt
     *
     * @param string $content
     * @return bool
     */
    public function updateSystemPrompt(string $content): bool
    {
        try {
            $systemPrompt = SystemPrompt::first();

            if (!$systemPrompt) {
                SystemPrompt::create([
                    'content' => $content,
                    'version' => 1,
                    'is_active' => true
                ]);
            } else {
                $systemPrompt->content = $content;
                $systemPrompt->version += 1;
                $systemPrompt->save();
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error updating system prompt: ' . $e->getMessage());
            return false;
        }
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
