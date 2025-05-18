<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;

class BaseController extends Controller
{
    /**
     * Return a success JSON response.
     *
     * @param  array|string  $data
     * @param  string  $message
     * @param  int  $statusCode
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendSuccess($data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return ResponseService::success($data, $message, $statusCode);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string  $message
     * @param  int  $statusCode
     * @param  array|null  $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendError(string $message = 'Error', int $statusCode = 400, $errors = null): JsonResponse
    {
        return ResponseService::error($message, $statusCode, $errors);
    }

    /**
     * Return a not found JSON response.
     *
     * @param  string  $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendNotFound(string $message = 'Resource not found'): JsonResponse
    {
        return ResponseService::notFound($message);
    }

    /**
     * Return a forbidden JSON response.
     *
     * @param  string  $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendForbidden(string $message = 'Forbidden'): JsonResponse
    {
        return ResponseService::forbidden($message);
    }

    /**
     * Return an unauthorized JSON response.
     *
     * @param  string  $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendUnauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return ResponseService::unauthorized($message);
    }

    /**
     * Return a validation error JSON response.
     *
     * @param  \Illuminate\Support\MessageBag|array  $errors
     * @param  string  $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendValidationError($errors, string $message = 'Validation failed'): JsonResponse
    {
        return ResponseService::validationError($errors, $message);
    }
}