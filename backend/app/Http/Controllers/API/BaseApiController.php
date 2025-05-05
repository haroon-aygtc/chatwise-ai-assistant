
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;

class BaseApiController extends Controller
{
    /**
     * Return success response
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function successResponse($data = null, ?string $message = null, int $statusCode = 200): JsonResponse
    {
        return ResponseService::success($data, $message, $statusCode);
    }
    
    /**
     * Return error response
     *
     * @param string $message
     * @param array|null $errors
     * @param int $statusCode
     * @return JsonResponse
     */
    protected function errorResponse(string $message, ?array $errors = null, int $statusCode = 400): JsonResponse
    {
        return ResponseService::error($message, $errors, $statusCode);
    }
}
