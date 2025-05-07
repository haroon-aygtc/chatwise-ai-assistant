<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateResponseFormatRequest;
use App\Http\Requests\TestResponseFormatRequest;
use App\Http\Requests\UpdateResponseFormatRequest;
use App\Services\ResponseFormatService;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResponseFormatController extends Controller
{
    /**
     * @var ResponseFormatService
     */
    protected $responseFormatService;

    /**
     * ResponseFormatController constructor.
     *
     * @param ResponseFormatService $responseFormatService
     */
    public function __construct(ResponseFormatService $responseFormatService)
    {
        $this->responseFormatService = $responseFormatService;
    }

    /**
     * Get all response formats
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $formats = $this->responseFormatService->getAllFormats($perPage);

        return ResponseService::success($formats);
    }

    /**
     * Get a single response format
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $format = $this->responseFormatService->getFormatById($id);

        if (!$format) {
            return ResponseService::error('Response format not found', null, 404);
        }

        return ResponseService::success($format);
    }

    /**
     * Get the default response format
     *
     * @return JsonResponse
     */
    public function getDefault(): JsonResponse
    {
        $format = $this->responseFormatService->getDefaultFormat();

        if (!$format) {
            return ResponseService::error('No default response format found', null, 404);
        }

        return ResponseService::success($format);
    }

    /**
     * Create a new response format
     *
     * @param CreateResponseFormatRequest $request
     * @return JsonResponse
     */
    public function store(CreateResponseFormatRequest $request): JsonResponse
    {
        $data = $request->validated();
        $format = $this->responseFormatService->createFormat($data);

        return ResponseService::success($format, 'Response format created successfully', 201);
    }

    /**
     * Update a response format
     *
     * @param UpdateResponseFormatRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateResponseFormatRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $format = $this->responseFormatService->updateFormat($id, $data);

        if (!$format) {
            return ResponseService::error('Response format not found', null, 404);
        }

        return ResponseService::success($format, 'Response format updated successfully');
    }

    /**
     * Delete a response format
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->responseFormatService->deleteFormat($id);

        if (!$result) {
            return ResponseService::error('Response format not found or cannot be deleted', null, 404);
        }

        return ResponseService::success(null, 'Response format deleted successfully');
    }

    /**
     * Set a response format as default
     *
     * @param int $id
     * @return JsonResponse
     */
    public function setDefault(int $id): JsonResponse
    {
        $format = $this->responseFormatService->setDefaultFormat($id);

        if (!$format) {
            return ResponseService::error('Response format not found', null, 404);
        }

        return ResponseService::success($format, 'Default response format set successfully');
    }

    /**
     * Test a response format with a prompt
     *
     * @param TestResponseFormatRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function test(TestResponseFormatRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $result = $this->responseFormatService->testFormat($id, $data['prompt']);

        if (!$result) {
            return ResponseService::error('Response format not found or testing failed', null, 404);
        }

        return ResponseService::success($result);
    }
}
