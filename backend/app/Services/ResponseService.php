<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    /**
     * Return success response
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $statusCode
     * @return JsonResponse
     */
    public static function success($data = null, ?string $message = null, int $statusCode = 200): JsonResponse
    {
        $response = [
            'success' => true,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return error response
     *
     * @param string $message
     * @param array|null $errors
     * @param int $statusCode
     * @return JsonResponse
     */
    public static function error(string $message, ?array $errors = null, int $statusCode = 400): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }
}