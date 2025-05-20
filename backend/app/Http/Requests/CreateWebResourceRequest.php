<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWebResourceRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'collectionId' => 'nullable|string|exists:resource_collections,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'isActive' => 'nullable|boolean',
            'metadata' => 'nullable|array',
            'url' => 'required|url',
            'scrapingDepth' => 'nullable|integer|min:1|max:5',
            'includeSelectorPatterns' => 'nullable|array',
            'includeSelectorPatterns.*' => 'string',
            'excludeSelectorPatterns' => 'nullable|array',
            'excludeSelectorPatterns.*' => 'string',
        ];
    }
}
