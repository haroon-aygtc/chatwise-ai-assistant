<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAppSettingsRequest;
use App\Http\Requests\UpdateUserSettingsRequest;
use App\Services\SettingsService;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * @var SettingsService
     */
    protected $settingsService;

    /**
     * SettingsController constructor.
     *
     * @param SettingsService $settingsService
     */
    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * Get user settings
     *
     * @return JsonResponse
     */
    public function getUserSettings(): JsonResponse
    {
        $settings = $this->settingsService->getUserSettings();

        return ResponseService::success($settings);
    }

    /**
     * Update user settings
     *
     * @param UpdateUserSettingsRequest $request
     * @return JsonResponse
     */
    public function updateUserSettings(UpdateUserSettingsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $settings = $this->settingsService->updateUserSettings($data);

        return ResponseService::success($settings, 'User settings updated successfully');
    }

    /**
     * Reset user settings to defaults
     *
     * @return JsonResponse
     */
    public function resetUserSettings(): JsonResponse
    {
        $settings = $this->settingsService->resetUserSettings();

        return ResponseService::success($settings, 'User settings reset to defaults');
    }

    /**
     * Get app settings
     *
     * @return JsonResponse
     */
    public function getAppSettings(): JsonResponse
    {
        $settings = $this->settingsService->getAppSettings();

        return ResponseService::success($settings);
    }

    /**
     * Update app settings
     *
     * @param UpdateAppSettingsRequest $request
     * @return JsonResponse
     */
    public function updateAppSettings(UpdateAppSettingsRequest $request): JsonResponse
    {
        $data = $request->validated();
        $settings = $this->settingsService->updateAppSettings($data);

        return ResponseService::success($settings, 'App settings updated successfully');
    }
}
