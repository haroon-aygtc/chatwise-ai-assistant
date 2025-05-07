<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWidgetRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|in:chat,form,questionnaire',
            'status' => 'sometimes|string|in:active,inactive,draft',
            'configuration' => 'sometimes|required|array',
            'configuration.appearance' => 'sometimes|required|array',
            'configuration.general' => 'sometimes|required|array',
            'configuration.behavior' => 'sometimes|required|array',
            'ai_model_id' => 'nullable|exists:ai_models,id',
            'prompt_template_id' => 'nullable|exists:prompt_templates,id',
            'response_format_id' => 'nullable|exists:response_formats,id',
        ];
    }
}
