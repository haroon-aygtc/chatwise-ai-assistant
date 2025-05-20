<?php

namespace App\Providers;

use App\Services\AIService;
use App\Services\AIModelSelector;
use App\Services\Providers\GroqService;
use App\Services\Providers\GeminiService;
use App\Services\Providers\MistralService;
use App\Services\Providers\AnthropicService;
use App\Services\Providers\CustomProviderService;
use App\Services\Providers\HuggingFaceService;
use App\Services\Providers\OpenRouterService;
use App\Services\Providers\TogetherAIService;
use Illuminate\Support\ServiceProvider;

class AIServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Register provider services as singletons
        $this->app->singleton(TogetherAIService::class);
        $this->app->singleton(MistralService::class);
        $this->app->singleton(GroqService::class);
        $this->app->singleton(OpenRouterService::class);
        $this->app->singleton(HuggingFaceService::class);
        $this->app->singleton(CustomProviderService::class);
        $this->app->singleton(GeminiService::class);
        $this->app->singleton(AnthropicService::class);

        // Register a provider factory
        $this->app->singleton('ai.provider', function ($app) {
            return [
                'together' => $app->make(TogetherAIService::class),
                'mistral' => $app->make(MistralService::class),
                'groq' => $app->make(GroqService::class),
                'openrouter' => $app->make(OpenRouterService::class),
                'huggingface' => $app->make(HuggingFaceService::class),
                'custom' => $app->make(CustomProviderService::class),
                'gemini' => $app->make(GeminiService::class),
                'anthropic' => $app->make(AnthropicService::class),
            ];
        });

        // Register AIModelSelector
        $this->app->singleton(AIModelSelector::class, function ($app) {
            return new AIModelSelector();
        });

        // Register AIService
        $this->app->singleton(AIService::class, function ($app) {
            return new AIService($app->make(AIModelSelector::class));
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Publish configuration
        $this->publishes([
            __DIR__.'/../../config/ai.php' => config_path('ai.php'),
        ], 'ai-config');

        // Merge config
        $this->mergeConfigFrom(
            __DIR__.'/../../config/ai.php', 'ai'
        );
    }
}
