<?php

$frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
$backendUrl = env('APP_URL', 'http://localhost:8000');

// Parse ports from URLs for dynamic configuration
$frontendPort = parse_url($frontendUrl, PHP_URL_PORT) ?: '5173';
$backendPort = parse_url($backendUrl, PHP_URL_PORT) ?: '8000';

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'register',
        'user'
    ],

    'allowed_methods' => ['*'],

    // Use PUBLIC_API_MODE to quickly toggle between secure and public mode
    'allowed_origins' => env('PUBLIC_API_MODE', false) === true || env('PUBLIC_API_MODE') === 'true'
        ? ['*']
        : [
            $backendUrl,
            $frontendUrl,
            "http://localhost:$frontendPort",
            "http://127.0.0.1:$frontendPort",
            "http://localhost:$backendPort",
            "http://127.0.0.1:$backendPort",
            'http://localhost',
        ],

    // Add support for pattern matching (useful for dev environments with dynamic ports)
    'allowed_origins_patterns' => [
        '/^http:\/\/localhost:\d+$/',
        '/^http:\/\/127\.0\.0\.1:\d+$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 0,

    // Disable credentials requirement in public mode
    'supports_credentials' => env('PUBLIC_API_MODE', false) === true || env('PUBLIC_API_MODE') === 'true'
        ? false
        : true,

];
