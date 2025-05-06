<?php

namespace App\Services;

use App\Models\ResponseFormat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResponseFormatService
{
    /**
     * Get all response formats
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllFormats()
    {
        return ResponseFormat::orderBy('name')->get();
    }

    /**
     * Get a response format by ID
     *
     * @param int $id
     * @return ResponseFormat|null
     */
    public function getFormatById($id)
    {
        return ResponseFormat::findOrFail($id);
    }

    /**
     * Get the default response format
     *
     * @return ResponseFormat|null
     */
    public function getDefaultFormat()
    {
        return ResponseFormat::where('is_default', true)->first();
    }

    /**
     * Create a new response format
     *
     * @param array $data
     * @return ResponseFormat
     */
    public function createFormat(array $data)
    {
        try {
            DB::beginTransaction();

            // If this format is set as default, unset any existing defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $this->unsetDefaultFormats();
            }

            $format = ResponseFormat::create($data);

            DB::commit();
            return $format;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create response format: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an existing response format
     *
     * @param int $id
     * @param array $data
     * @return ResponseFormat
     */
    public function updateFormat(int $id, array $data)
    {
        try {
            DB::beginTransaction();

            $format = ResponseFormat::findOrFail($id);

            // If this format is set as default, unset any existing defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $this->unsetDefaultFormats();
            }

            $format->update($data);

            DB::commit();
            return $format;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update response format: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a response format
     *
     * @param int $id
     * @return bool
     */
    public function deleteFormat(int $id)
    {
        try {
            $format = ResponseFormat::findOrFail($id);

            // Check if this is the default format
            if ($format->is_default) {
                throw new \Exception('Cannot delete the default response format');
            }

            return $format->delete();
        } catch (\Exception $e) {
            Log::error('Failed to delete response format: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Set a format as the default
     *
     * @param int $id
     * @return ResponseFormat
     */
    public function setDefaultFormat(int $id)
    {
        try {
            DB::beginTransaction();

            $this->unsetDefaultFormats();

            $format = ResponseFormat::findOrFail($id);
            $format->is_default = true;
            $format->save();

            DB::commit();
            return $format;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to set default format: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Unset any existing default formats
     *
     * @return void
     */
    private function unsetDefaultFormats()
    {
        ResponseFormat::where('is_default', true)
            ->update(['is_default' => false]);
    }
}
