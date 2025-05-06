
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Properly configure cookies for SPA authentication
        if (config('app.env') === 'production') {
            // In production, ensure cookies are secure
            \Illuminate\Cookie\Middleware\EncryptCookies::$except = [];
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::$except = [];
            \Illuminate\Session\Middleware\StartSession::$except = [];
        }

        // Set the same-site policy for cookies
        config([
            'session.same_site' => 'lax',
            'session.secure' => config('app.env') === 'production',
        ]);
    }
}
