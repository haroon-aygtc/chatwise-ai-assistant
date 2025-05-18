<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Register global middleware - HandleCors must be first
        $middleware->use([
            \Illuminate\Http\Middleware\HandleCors::class,
            \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
            \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
            \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
            \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        ]);

        // Register web middleware group
        $middleware->web([
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Register API middleware group
        $middleware->api([
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Http\Middleware\HandleCors::class,

        ]);

        // Register named middleware aliases
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
            'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
            'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
            'can' => \Illuminate\Auth\Middleware\Authorize::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
            'precognitive' => \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
            'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configure exception handling to return JSON for API routes
        $exceptions->renderable(function (\Throwable $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $status = 500;
                if ($e instanceof \Illuminate\Session\TokenMismatchException) {
                    $status = 419;
                } elseif ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $status = 401;
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    $status = 422;
                }

                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'error' => $e->getMessage(),
                ], $status);
            }
        });
    })->create();
