
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register Sanctum middleware
        $middleware->stateful(explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
            '%s%s',
            'localhost,localhost:3000,localhost:8080,127.0.0.1,127.0.0.1:8000,127.0.0.1:8080,::1',
            Application::urlHost()
        ))));

        // Enable the session middleware for the API routes
        $middleware->alias([
            'auth.session' => \Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        ]);

        // Apply CORS middleware globally
        $middleware->use(\Illuminate\Http\Middleware\HandleCors::class);

        // Use these middleware for the web group
        $middleware->web([
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Use these middleware for the API group
        $middleware->api([
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
