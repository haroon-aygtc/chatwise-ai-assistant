<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateKnowledgeProfileRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'isActive' => 'nullable|boolean',
            'collectionIds' => 'nullable|array',
            'collectionIds.*' => 'string|exists:resource_collections,id',
            'resourceIds' => 'nullable|array',
            'resourceIds.*' => 'string|exists:knowledge_resources,id',
            'settings' => 'nullable|array',
        ];
    }
}
