<?php

namespace Database\Seeders;

use App\Models\AIModel;
use App\Models\ModelProvider;
use Illuminate\Database\Seeder;

class AIModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get provider IDs
        $openaiProviderId = ModelProvider::where('slug', 'openai')->first()?->id;
        $anthropicProviderId = ModelProvider::where('slug', 'anthropic')->first()?->id;
        $mistralProviderId = ModelProvider::where('slug', 'mistral')->first()?->id;
        $googleProviderId = ModelProvider::where('slug', 'google')->first()?->id;
        $groqProviderId = ModelProvider::where('slug', 'groq')->first()?->id;

        $models = [
            // OpenAI Models
            [
                'name' => 'GPT-4o',
                'provider' => 'OpenAI',
                'provider_id' => $openaiProviderId,
                'modelId' => 'gpt-4o',
                'isActive' => true,
                'isDefault' => true,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.00001,
                'contextSize' => 128000
            ],
            [
                'name' => 'GPT-4 Turbo',
                'provider' => 'OpenAI',
                'provider_id' => $openaiProviderId,
                'modelId' => 'gpt-4-turbo-preview',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.00001,
                'contextSize' => 128000
            ],
            [
                'name' => 'GPT-3.5 Turbo',
                'provider' => 'OpenAI',
                'provider_id' => $openaiProviderId,
                'modelId' => 'gpt-3.5-turbo',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.0000015,
                'contextSize' => 16000
            ],

            // Anthropic Models
            [
                'name' => 'Claude 3 Opus',
                'provider' => 'Anthropic',
                'provider_id' => $anthropicProviderId,
                'modelId' => 'claude-3-opus-20240229',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.00003,
                'contextSize' => 200000
            ],
            [
                'name' => 'Claude 3 Sonnet',
                'provider' => 'Anthropic',
                'provider_id' => $anthropicProviderId,
                'modelId' => 'claude-3-sonnet-20240229',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.00001,
                'contextSize' => 200000
            ],
            [
                'name' => 'Claude 3 Haiku',
                'provider' => 'Anthropic',
                'provider_id' => $anthropicProviderId,
                'modelId' => 'claude-3-haiku-20240307',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.000003,
                'contextSize' => 200000
            ],

            // Mistral Models
            [
                'name' => 'Mistral Large',
                'provider' => 'Mistral',
                'provider_id' => $mistralProviderId,
                'modelId' => 'mistral-large-latest',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.00008,
                'contextSize' => 32000
            ],
            [
                'name' => 'Mistral Medium',
                'provider' => 'Mistral',
                'provider_id' => $mistralProviderId,
                'modelId' => 'mistral-medium-latest',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.000028,
                'contextSize' => 32000
            ],
            [
                'name' => 'Mistral Small',
                'provider' => 'Mistral',
                'provider_id' => $mistralProviderId,
                'modelId' => 'mistral-small-latest',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.000007,
                'contextSize' => 32000
            ],

            // Google Models
            [
                'name' => 'Gemini 1.5 Pro',
                'provider' => 'Google',
                'provider_id' => $googleProviderId,
                'modelId' => 'gemini-1.5-pro-latest',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.000007,
                'contextSize' => 1000000
            ],
            [
                'name' => 'Gemini 1.0 Pro',
                'provider' => 'Google',
                'provider_id' => $googleProviderId,
                'modelId' => 'gemini-1.0-pro',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => true
                ],
                'pricePerToken' => 0.000005,
                'contextSize' => 32000
            ],

            // Groq Models
            [
                'name' => 'LLaMA-3-70B',
                'provider' => 'Groq',
                'provider_id' => $groqProviderId,
                'modelId' => 'llama3-70b-8192',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.000007,
                'contextSize' => 8192
            ],
            [
                'name' => 'Mixtral-8x7B-Instruct',
                'provider' => 'Groq',
                'provider_id' => $groqProviderId,
                'modelId' => 'mixtral-8x7b-32768',
                'isActive' => true,
                'isDefault' => false,
                'capabilities' => [
                    'chat' => true,
                    'completion' => true,
                    'embeddings' => false,
                    'vision' => false
                ],
                'pricePerToken' => 0.000003,
                'contextSize' => 32768
            ]
        ];

        foreach ($models as $model) {
            AIModel::updateOrCreate(
                ['name' => $model['name'], 'provider' => $model['provider']],
                $model
            );
        }
    }
}