<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDirectoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'collectionId' => 'nullable|string|exists:resource_collections,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'isActive' => 'nullable|boolean',
            'metadata' => 'nullable|array',
            'path' => 'sometimes|string',
            'recursive' => 'nullable|boolean',
            'fileTypes' => 'nullable|array',
            'fileTypes.*' => 'string',
            'includePatterns' => 'nullable|array',
            'includePatterns.*' => 'string',
            'excludePatterns' => 'nullable|array',
            'excludePatterns.*' => 'string',
        ];
    }
}
