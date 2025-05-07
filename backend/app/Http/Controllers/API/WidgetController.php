<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateWidgetRequest;
use App\Http\Requests\CreateWidgetSettingRequest;
use App\Http\Requests\TestWidgetConfigRequest;
use App\Http\Requests\UpdateWidgetRequest;
use App\Services\WidgetService;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetController extends Controller
{
    /**
     * @var WidgetService
     */
    protected $widgetService;

    /**
     * WidgetController constructor.
     *
     * @param WidgetService $widgetService
     */
    public function __construct(WidgetService $widgetService)
    {
        $this->widgetService = $widgetService;
    }

    /**
     * Get all widgets
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $widgets = $this->widgetService->getAllWidgets($perPage);

        return ResponseService::success($widgets);
    }

    /**
     * Get a single widget
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $widget = $this->widgetService->getWidgetById($id);

        if (!$widget) {
            return ResponseService::error('Widget not found', null, 404);
        }

        return ResponseService::success($widget);
    }

    /**
     * Create a new widget
     *
     * @param CreateWidgetRequest $request
     * @return JsonResponse
     */
    public function store(CreateWidgetRequest $request): JsonResponse
    {
        $data = $request->validated();
        $widget = $this->widgetService->createWidget($data);

        return ResponseService::success($widget, 'Widget created successfully', 201);
    }

    /**
     * Update a widget
     *
     * @param UpdateWidgetRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateWidgetRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $widget = $this->widgetService->updateWidget($id, $data);

        if (!$widget) {
            return ResponseService::error('Widget not found', null, 404);
        }

        return ResponseService::success($widget, 'Widget updated successfully');
    }

    /**
     * Delete a widget
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->widgetService->deleteWidget($id);

        if (!$result) {
            return ResponseService::error('Widget not found', null, 404);
        }

        return ResponseService::success(null, 'Widget deleted successfully');
    }

    /**
     * Get widget settings
     *
     * @param int $widgetId
     * @return JsonResponse
     */
    public function getSettings(int $widgetId): JsonResponse
    {
        $settings = $this->widgetService->getWidgetSettings($widgetId);

        return ResponseService::success($settings);
    }

    /**
     * Create widget setting
     *
     * @param CreateWidgetSettingRequest $request
     * @param int $widgetId
     * @return JsonResponse
     */
    public function createSetting(CreateWidgetSettingRequest $request, int $widgetId): JsonResponse
    {
        $data = $request->validated();
        $setting = $this->widgetService->createWidgetSetting($widgetId, $data);

        if (!$setting) {
            return ResponseService::error('Widget not found', null, 404);
        }

        return ResponseService::success($setting, 'Widget setting created successfully', 201);
    }

    /**
     * Get widget embed code
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function getCode(Request $request, int $id): JsonResponse
    {
        $format = $request->input('format', 'js');
        $code = $this->widgetService->getWidgetCode($id, $format);

        if (!$code) {
            return ResponseService::error('Widget not found', null, 404);
        }

        return ResponseService::success(['code' => $code]);
    }

    /**
     * Test widget configuration
     *
     * @param TestWidgetConfigRequest $request
     * @return JsonResponse
     */
    public function testConfig(TestWidgetConfigRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->widgetService->testWidgetConfiguration($data);

        return ResponseService::success($result);
    }

    /**
     * Get widget analytics
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function getAnalytics(int $id): JsonResponse
    {
        $analytics = $this->widgetService->getWidgetAnalytics($id);
        
        if (!$analytics) {
            return ResponseService::error('Widget not found or no analytics available', null, 404);
        }
        
        return ResponseService::success($analytics);
    }

    /**
     * Get widget customization options
     * 
     * @return JsonResponse
     */
    public function getCustomizationOptions(): JsonResponse
    {
        $options = $this->widgetService->getCustomizationOptions();
        
        return ResponseService::success($options);
    }
}
