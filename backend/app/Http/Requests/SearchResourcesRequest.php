<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchResourcesRequest extends FormRequest
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
            'query' => 'nullable|string',
            'resourceTypes' => 'nullable|array',
            'resourceTypes.*' => 'string|in:ARTICLE,FAQ,FILE_UPLOAD,DIRECTORY,WEB',
            'collectionIds' => 'nullable|array',
            'collectionIds.*' => 'string|exists:resource_collections,id',
            'isActive' => 'nullable|boolean',
            'page' => 'nullable|integer|min:1',
            'perPage' => 'nullable|integer|min:1|max:100',
        ];
    }
}
