<?php

namespace App\Services;

use App\Models\AppSetting;
use App\Models\UserSetting;
use Illuminate\Support\Facades\Auth;

class SettingsService
{
    /**
     * Get user settings
     *
     * @return UserSetting
     */
    public function getUserSettings(): UserSetting
    {
        $userId = Auth::id();
        $settings = UserSetting::where('user_id', $userId)->first();

        // If no settings exist for this user, create defaults
        if (!$settings) {
            $settings = $this->createDefaultUserSettings($userId);
        }

        return $settings;
    }

    /**
     * Update user settings
     *
     * @param array $data
     * @return UserSetting
     */
    public function updateUserSettings(array $data): UserSetting
    {
        $userId = Auth::id();
        $settings = UserSetting::where('user_id', $userId)->first();

        // If no settings exist, create defaults first
        if (!$settings) {
            $settings = $this->createDefaultUserSettings($userId);
        }

        // Update fields
        if (isset($data['theme'])) {
            $settings->theme = $data['theme'];
        }
        
        if (isset($data['language'])) {
            $settings->language = $data['language'];
        }
        
        if (isset($data['notifications'])) {
            $settings->notifications = $data['notifications'];
        }
        
        if (isset($data['accessibility'])) {
            $settings->accessibility = $data['accessibility'];
        }
        
        if (isset($data['chat_preferences'])) {
            $settings->chat_preferences = $data['chat_preferences'];
        }
        
        if (isset($data['display'])) {
            $settings->display = $data['display'];
        }
        
        $settings->save();

        return $settings;
    }

    /**
     * Reset user settings to defaults
     *
     * @return UserSetting
     */
    public function resetUserSettings(): UserSetting
    {
        $userId = Auth::id();
        
        // Delete existing settings
        UserSetting::where('user_id', $userId)->delete();
        
        // Create new default settings
        return $this->createDefaultUserSettings($userId);
    }

    /**
     * Get app settings
     *
     * @return AppSetting
     */
    public function getAppSettings(): AppSetting
    {
        $settings = AppSetting::first();

        // If no settings exist, create defaults
        if (!$settings) {
            $settings = $this->createDefaultAppSettings();
        }

        return $settings;
    }

    /**
     * Update app settings
     *
     * @param array $data
     * @return AppSetting
     */
    public function updateAppSettings(array $data): AppSetting
    {
        $settings = AppSetting::first();

        // If no settings exist, create defaults first
        if (!$settings) {
            $settings = $this->createDefaultAppSettings();
        }

        // Update fields
        if (isset($data['app_name'])) {
            $settings->app_name = $data['app_name'];
        }
        
        if (isset($data['logo'])) {
            $settings->logo = $data['logo'];
        }
        
        if (isset($data['favicon'])) {
            $settings->favicon = $data['favicon'];
        }
        
        if (isset($data['default_theme'])) {
            $settings->default_theme = $data['default_theme'];
        }
        
        if (isset($data['available_languages'])) {
            $settings->available_languages = $data['available_languages'];
        }
        
        if (isset($data['default_language'])) {
            $settings->default_language = $data['default_language'];
        }
        
        if (isset($data['support_email'])) {
            $settings->support_email = $data['support_email'];
        }
        
        if (isset($data['terms_url'])) {
            $settings->terms_url = $data['terms_url'];
        }
        
        if (isset($data['privacy_url'])) {
            $settings->privacy_url = $data['privacy_url'];
        }
        
        if (isset($data['max_upload_size'])) {
            $settings->max_upload_size = $data['max_upload_size'];
        }
        
        if (isset($data['allowed_file_types'])) {
            $settings->allowed_file_types = $data['allowed_file_types'];
        }
        
        $settings->save();

        return $settings;
    }

    /**
     * Create default user settings
     *
     * @param int $userId
     * @return UserSetting
     */
    private function createDefaultUserSettings(int $userId): UserSetting
    {
        $settings = new UserSetting();
        $settings->user_id = $userId;
        $settings->theme = 'light';
        $settings->language = 'en';
        $settings->notifications = [
            'email' => true,
            'push' => true,
            'inApp' => true,
            'digest' => 'daily'
        ];
        $settings->accessibility = [
            'fontSize' => 'medium',
            'contrast' => 'normal',
            'reducedMotion' => false
        ];
        $settings->chat_preferences = [
            'autoSave' => true,
            'showTypingIndicator' => true,
            'soundEffects' => true,
            'showTimestamps' => true
        ];
        $settings->display = [
            'compactView' => false,
            'sidebarCollapsed' => false,
            'tableRows' => 15
        ];
        $settings->save();

        return $settings;
    }

    /**
     * Create default app settings
     *
     * @return AppSetting
     */
    private function createDefaultAppSettings(): AppSetting
    {
        $settings = new AppSetting();
        $settings->app_name = 'AI Chat Assistant';
        $settings->logo = null;
        $settings->favicon = null;
        $settings->default_theme = 'light';
        $settings->available_languages = ['en', 'es', 'fr', 'de'];
        $settings->default_language = 'en';
        $settings->support_email = 'support@example.com';
        $settings->terms_url = '/terms';
        $settings->privacy_url = '/privacy';
        $settings->max_upload_size = 5; // 5MB
        $settings->allowed_file_types = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
        $settings->save();

        return $settings;
    }
}
