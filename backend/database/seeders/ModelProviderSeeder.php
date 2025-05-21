<?php

namespace Database\Seeders;

use App\Models\ModelProvider;
use Illuminate\Database\Seeder;

class ModelProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            [
                'name' => 'OpenAI',
                'slug' => 'openai',
                'description' => 'Provider of GPT models including GPT-4 and GPT-3.5-Turbo',
                'apiKeyName' => 'OPENAI_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'OPENAI_API_BASE',
                'isActive' => true,
                'logoUrl' => 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg'
            ],
            [
                'name' => 'Google',
                'slug' => 'google',
                'description' => 'Provider of Gemini models',
                'apiKeyName' => 'GOOGLE_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => null,
                'isActive' => true,
                'logoUrl' => 'https://www.gstatic.com/devrel-devsite/prod/v5ba20c1e081870fd30b7c8a21986cd833ce2d5426172434324aecec336f9315e/cloud/images/cloud-logo.svg'
            ],
            [
                'name' => 'Anthropic',
                'slug' => 'anthropic',
                'description' => 'Provider of Claude models',
                'apiKeyName' => 'ANTHROPIC_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'ANTHROPIC_API_BASE',
                'isActive' => true,
                'logoUrl' => 'https://storage.googleapis.com/anthropic-website-assets/logo-claude-full.svg'
            ],
            [
                'name' => 'Mistral',
                'slug' => 'mistral',
                'description' => 'Provider of Mistral models',
                'apiKeyName' => 'MISTRAL_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'MISTRAL_API_BASE',
                'isActive' => true,
                'logoUrl' => 'https://assets-global.website-files.com/6408352778bf32108ea2a50e/64083c02a9f4911b6a82a73b_LightMode.svg'
            ],
            [
                'name' => 'Groq',
                'slug' => 'groq',
                'description' => 'Provider of LLM models with exceptional speed',
                'apiKeyName' => 'GROQ_API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => false,
                'baseUrlName' => 'GROQ_API_BASE',
                'isActive' => true,
                'logoUrl' => 'https://groq.com/images/logo-dark.svg'
            ],
            [
                'name' => 'Custom',
                'slug' => 'custom',
                'description' => 'For custom LLM deployments or self-hosted models',
                'apiKeyName' => 'API_KEY',
                'apiKeyRequired' => true,
                'baseUrlRequired' => true,
                'baseUrlName' => 'API_BASE_URL',
                'isActive' => true,
                'logoUrl' => null
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
