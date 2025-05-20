<?php

namespace Database\Seeders;

use App\Models\ModelProvider;
use Illuminate\Database\Seeder;

class ModelProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providers = [
            [
                'name' => 'OpenAI',
                'slug' => 'openai',
                'description' => 'Official OpenAI API provider',
                'apiKeyName' => 'OPENAI_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'OPENAI_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/openai.png',
            ],
            [
                'name' => 'Anthropic',
                'slug' => 'anthropic',
                'description' => 'Anthropic Claude API provider',
                'apiKeyName' => 'ANTHROPIC_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'ANTHROPIC_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/anthropic.png',
            ],
            [
                'name' => 'TogetherAI',
                'slug' => 'together',
                'description' => 'TogetherAI API for open models',
                'apiKeyName' => 'TOGETHER_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'TOGETHER_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/together.png',
            ],
            [
                'name' => 'Mistral',
                'slug' => 'mistral',
                'description' => 'Mistral AI API provider',
                'apiKeyName' => 'MISTRAL_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'MISTRAL_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/mistral.png',
            ],
            [
                'name' => 'Groq',
                'slug' => 'groq',
                'description' => 'Groq high-performance LLM provider',
                'apiKeyName' => 'GROQ_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'GROQ_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/groq.png',
            ],
            [
                'name' => 'OpenRouter',
                'slug' => 'openrouter',
                'description' => 'OpenRouter multi-model provider',
                'apiKeyName' => 'OPENROUTER_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'OPENROUTER_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/openrouter.png',
            ],
            [
                'name' => 'HuggingFace',
                'slug' => 'huggingface',
                'description' => 'HuggingFace inference API',
                'apiKeyName' => 'HUGGINGFACE_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'HUGGINGFACE_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/huggingface.png',
            ],
            [
                'name' => 'Google Gemini',
                'slug' => 'gemini',
                'description' => 'Google Gemini AI provider',
                'apiKeyName' => 'GEMINI_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'GEMINI_API_URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/gemini.png',
            ],
            [
                'name' => 'Custom Provider',
                'slug' => 'custom',
                'description' => 'Custom LLM provider configuration',
                'apiKeyName' => 'CUSTOM_API_KEY',
                'apiKeyRequired' => false,
                'baseUrlRequired' => true,
                'baseUrlName' => 'API URL',
                'isActive' => true,
                'logoUrl' => '/assets/providers/custom.png',
            ],
        ];

        foreach ($providers as $provider) {
            ModelProvider::updateOrCreate(
                ['slug' => $provider['slug']],
                $provider
            );
        }
    }
}
