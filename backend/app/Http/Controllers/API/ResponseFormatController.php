
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateResponseFormatRequest;
use App\Http\Requests\UpdateResponseFormatRequest;
use App\Services\ResponseFormatService;
use App\Services\ResponseService;
use Illuminate\Http\Request;

class ResponseFormatController extends Controller
{
    protected $responseFormatService;
    protected $responseService;

    public function __construct(ResponseFormatService $responseFormatService, ResponseService $responseService)
    {
        $this->responseFormatService = $responseFormatService;
        $this->responseService = $responseService;
    }

    /**
     * Get all response formats
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $formats = $this->responseFormatService->getAllFormats();
            return $this->responseService->success($formats, 'Response formats retrieved successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get a format by ID
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $format = $this->responseFormatService->getFormatById($id);
            return $this->responseService->success($format, 'Response format retrieved successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Create a new response format
     *
     * @param CreateResponseFormatRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CreateResponseFormatRequest $request)
    {
        try {
            $format = $this->responseFormatService->createFormat($request->validated());
            return $this->responseService->success($format, 'Response format created successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Update an existing response format
     *
     * @param UpdateResponseFormatRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateResponseFormatRequest $request, $id)
    {
        try {
            $format = $this->responseFormatService->updateFormat($id, $request->validated());
            return $this->responseService->success($format, 'Response format updated successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Delete a response format
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->responseFormatService->deleteFormat($id);
            return $this->responseService->success(null, 'Response format deleted successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Set a format as the default
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function setDefault($id)
    {
        try {
            $format = $this->responseFormatService->setDefaultFormat($id);
            return $this->responseService->success($format, 'Default response format set successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }

    /**
     * Get the default response format
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDefault()
    {
        try {
            $format = $this->responseFormatService->getDefaultFormat();
            return $this->responseService->success($format, 'Default response format retrieved successfully');
        } catch (\Exception $e) {
            return $this->responseService->error($e->getMessage());
        }
    }
}
