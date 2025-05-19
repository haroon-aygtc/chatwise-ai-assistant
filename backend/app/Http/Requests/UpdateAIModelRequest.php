<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAIModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'sometimes|string|max:255',
            'provider' => [
                'sometimes',
                'string',
                Rule::in([
                    'OpenAI',
                    'Google',
                    'Anthropic',
                    'HuggingFace',
                    'OpenRouter',
                    'Groq',
                    'Mistral',
                    'TogetherAI',
                    'Custom'
                ])
            ],
            'version' => 'sometimes|string|max:50',
            'description' => 'nullable|string',
            'apiKey' => 'nullable|string',
            'baseUrl' => 'nullable|string|url',
            'modelId' => 'nullable|string|max:255',
            'isActive' => 'boolean',
            'isDefault' => 'boolean',
            'is_public' => 'boolean',
            'temperature' => 'nullable|numeric|min:0|max:2',
            'maxTokens' => 'nullable|integer|min:1',
            'configuration' => 'nullable|array',
            'configuration.temperature' => 'nullable|numeric|min:0|max:2',
            'configuration.maxTokens' => 'nullable|integer|min:1',
            'configuration.model' => 'nullable|string',
            'configuration.topP' => 'nullable|numeric|min:0|max:1',
            'configuration.topK' => 'nullable|integer|min:1',
            'configuration.frequencyPenalty' => 'nullable|numeric|min:0|max:2',
            'configuration.presencePenalty' => 'nullable|numeric|min:0|max:2',
            'configuration.repetitionPenalty' => 'nullable|numeric|min:1|max:2',
            'configuration.task' => 'nullable|string',
            'configuration.waitForModel' => 'nullable|boolean',
            'configuration.routeType' => 'nullable|string|in:fallback,fastest,lowest-cost',
            'configuration.safePrompt' => 'nullable|boolean',
            'configuration.organization' => 'nullable|string',
            'configuration.safetySettings' => 'nullable|array',
        ];
    }
}
