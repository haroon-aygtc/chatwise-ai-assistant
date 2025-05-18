<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateResponseFormatRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'format' => 'required|string|in:conversational,structured,bullet-points,step-by-step',
            'length' => 'required|string|in:concise,medium,detailed',
            'tone' => 'required|string|in:professional,friendly,casual,technical',
            'is_default' => 'boolean',
            'options' => 'nullable|array',
            'options.useHeadings' => 'boolean',
            'options.useBulletPoints' => 'boolean',
            'options.includeLinks' => 'boolean',
            'options.formatCodeBlocks' => 'boolean',
        ];
    }
}