<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(\Illuminate\Http\Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 204);
        } else {
            $response = $next($request);
        }

        // Get the allowed origins from config or env
        $allowedOrigins = config('cors.allowed_origins', [
                'http://localhost:8080',
                'http://localhost:8081',
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:3000',
                'http://127.0.0.1:8080',
                'http://127.0.0.1:8081',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                'http://127.0.0.1:3000'
        ]);

        $origin = $request->header('Origin');
        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, X-CSRF-TOKEN, X-XSRF-TOKEN');
            $response->headers->set('Access-Control-Expose-Headers', '*');
        }

        return $response;
    }
}
