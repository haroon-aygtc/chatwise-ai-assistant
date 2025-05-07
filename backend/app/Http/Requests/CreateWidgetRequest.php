<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateWidgetRequest extends FormRequest
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
            'type' => 'nullable|string|in:chat,form,questionnaire',
            'status' => 'nullable|string|in:active,inactive,draft',
            'configuration' => 'required|array',
            'configuration.appearance' => 'required|array',
            'configuration.general' => 'required|array',
            'configuration.behavior' => 'required|array',
            'ai_model_id' => 'nullable|exists:ai_models,id',
            'prompt_template_id' => 'nullable|exists:prompt_templates,id',
            'response_format_id' => 'nullable|exists:response_formats,id',
        ];
    }
}
