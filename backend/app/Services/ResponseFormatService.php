<?php

namespace App\Services;

use App\Models\ResponseFormat;
use Illuminate\Pagination\LengthAwarePaginator;

class ResponseFormatService
{
    /**
     * Get all response formats
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllFormats(int $perPage = 15): LengthAwarePaginator
    {
        return ResponseFormat::orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get a response format by ID
     *
     * @param int $id
     * @return ResponseFormat|null
     */
    public function getFormatById(int $id): ?ResponseFormat
    {
        return ResponseFormat::find($id);
    }

    /**
     * Get the default response format
     *
     * @return ResponseFormat|null
     */
    public function getDefaultFormat(): ?ResponseFormat
    {
        return ResponseFormat::where('is_default', true)->first();
    }

    /**
     * Create a new response format
     *
     * @param array $data
     * @return ResponseFormat
     */
    public function createFormat(array $data): ResponseFormat
    {
        // If this format is set as default, update others to non-default
        if (isset($data['is_default']) && $data['is_default']) {
            $this->resetDefaultFormats();
        }

        $format = new ResponseFormat();
        $format->name = $data['name'];
        $format->description = $data['description'] ?? null;
        $format->content = $data['content'];
        $format->system_instructions = $data['system_instructions'] ?? null;
        $format->parameters = $data['parameters'] ?? null;
        $format->is_default = $data['is_default'] ?? false;
        $format->save();

        return $format;
    }

    /**
     * Update a response format
     *
     * @param int $id
     * @param array $data
     * @return ResponseFormat|null
     */
    public function updateFormat(int $id, array $data): ?ResponseFormat
    {
        $format = ResponseFormat::find($id);

        if (!$format) {
            return null;
        }

        // If this format is set as default, update others to non-default
        if (isset($data['is_default']) && $data['is_default']) {
            $this->resetDefaultFormats();
        }

        if (isset($data['name'])) {
            $format->name = $data['name'];
        }
        
        if (isset($data['description'])) {
            $format->description = $data['description'];
        }
        
        if (isset($data['content'])) {
            $format->content = $data['content'];
        }
        
        if (isset($data['system_instructions'])) {
            $format->system_instructions = $data['system_instructions'];
        }
        
        if (isset($data['parameters'])) {
            $format->parameters = $data['parameters'];
        }
        
        if (isset($data['is_default'])) {
            $format->is_default = $data['is_default'];
        }
        
        $format->save();

        return $format;
    }

    /**
     * Delete a response format
     *
     * @param int $id
     * @return bool
     */
    public function deleteFormat(int $id): bool
    {
        $format = ResponseFormat::find($id);

        if (!$format) {
            return false;
        }

        // Don't allow deletion of default format
        if ($format->is_default) {
            return false;
        }

        return $format->delete();
    }

    /**
     * Set a response format as default
     *
     * @param int $id
     * @return ResponseFormat|null
     */
    public function setDefaultFormat(int $id): ?ResponseFormat
    {
        $format = ResponseFormat::find($id);

        if (!$format) {
            return null;
        }

        // Reset all formats to non-default
        $this->resetDefaultFormats();

        // Set this format as default
        $format->is_default = true;
        $format->save();

        return $format;
    }

    /**
     * Test a response format with a prompt
     *
     * @param int $id
     * @param string $prompt
     * @return array|null
     */
    public function testFormat(int $id, string $prompt): ?array
    {
        $format = ResponseFormat::find($id);

        if (!$format) {
            return null;
        }

        // This is a simplified example. In a real implementation,
        // this would connect to an AI service to format the response
        $formatted = 'This is a test formatted response for: ' . $prompt;
        
        // Apply some basic formatting based on the format content
        if (strpos($format->content, '{{bullet_points}}') !== false) {
            $formatted = "• Point 1 about $prompt\n• Point 2 about $prompt\n• Point 3 about $prompt";
        } elseif (strpos($format->content, '{{steps}}') !== false) {
            $formatted = "Step 1: Introduction to $prompt\nStep 2: Details about $prompt\nStep 3: Conclusion about $prompt";
        }

        return ['formatted' => $formatted];
    }

    /**
     * Reset all formats to non-default
     *
     * @return void
     */
    private function resetDefaultFormats(): void
    {
        ResponseFormat::where('is_default', true)
            ->update(['is_default' => false]);
    }
}
