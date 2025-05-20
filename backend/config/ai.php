<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Provider Services Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for various AI providers used in the
    | application. Each provider has its own API key and base URL settings.
    |
    */

    'providers' => [
        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'base_url' => env('OPENAI_API_URL', 'https://api.openai.com'),
        ],

        'anthropic' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'base_url' => env('ANTHROPIC_API_URL', 'https://api.anthropic.com'),
        ],

        'together' => [
            'api_key' => env('TOGETHER_API_KEY'),
            'base_url' => env('TOGETHER_API_URL', 'https://api.together.xyz'),
        ],

        'mistral' => [
            'api_key' => env('MISTRAL_API_KEY'),
            'base_url' => env('MISTRAL_API_URL', 'https://api.mistral.ai'),
        ],

        'groq' => [
            'api_key' => env('GROQ_API_KEY'),
            'base_url' => env('GROQ_API_URL', 'https://api.groq.com'),
        ],

        'openrouter' => [
            'api_key' => env('OPENROUTER_API_KEY'),
            'base_url' => env('OPENROUTER_API_URL', 'https://openrouter.ai/api'),
        ],

        'huggingface' => [
            'api_key' => env('HUGGINGFACE_API_KEY'),
            'base_url' => env('HUGGINGFACE_API_URL', 'https://api-inference.huggingface.co'),
        ],

        'gemini' => [
            'api_key' => env('GEMINI_API_KEY'),
            'base_url' => env('GEMINI_API_URL', 'https://generativelanguage.googleapis.com'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | This option controls the default AI provider that will be used when
    | no specific provider is requested.
    |
    */

    'default_provider' => env('DEFAULT_AI_PROVIDER', 'openai'),

    /*
    |--------------------------------------------------------------------------
    | Model Configuration
    |--------------------------------------------------------------------------
    |
    | Default settings for AI models.
    |
    */

    'defaults' => [
        'temperature' => 0.7,
        'max_tokens' => 1000,
        'top_p' => 1.0,
        'frequency_penalty' => 0.0,
        'presence_penalty' => 0.0,
    ],

];
