<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetSetting;
use App\Models\AIModel;
use App\Models\PromptTemplate;
use App\Models\ResponseFormat;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class WidgetService
{
    /**
     * Get all widgets
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllWidgets(int $perPage = 15): LengthAwarePaginator
    {
        return Widget::orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get a widget by ID
     *
     * @param int $id
     * @return Widget|null
     */
    public function getWidgetById(int $id): ?Widget
    {
        return Widget::with(['settings', 'aiModel', 'promptTemplate', 'responseFormat'])->find($id);
    }

    /**
     * Create a new widget
     *
     * @param array $data
     * @return Widget
     */
    public function createWidget(array $data): Widget
    {
        $widget = new Widget();
        $widget->name = $data['name'];
        $widget->description = $data['description'] ?? null;
        $widget->type = $data['type'] ?? 'chat';
        $widget->status = $data['status'] ?? 'active';
        $widget->configuration = $data['configuration'] ?? [];
        $widget->user_id = Auth::id();
        $widget->ai_model_id = $data['ai_model_id'] ?? null;
        $widget->prompt_template_id = $data['prompt_template_id'] ?? null;
        $widget->response_format_id = $data['response_format_id'] ?? null;
        $widget->save();

        // Generate embed code if not provided
        if (!isset($data['embed_code'])) {
            $widget->embed_code = $widget->generateEmbedCode('js');
            $widget->save();
        }

        return $widget;
    }

    /**
     * Update a widget
     *
     * @param int $id
     * @param array $data
     * @return Widget|null
     */
    public function updateWidget(int $id, array $data): ?Widget
    {
        $widget = Widget::find($id);

        if (!$widget) {
            return null;
        }

        if (isset($data['name'])) {
            $widget->name = $data['name'];
        }
        
        if (isset($data['description'])) {
            $widget->description = $data['description'];
        }
        
        if (isset($data['type'])) {
            $widget->type = $data['type'];
        }
        
        if (isset($data['status'])) {
            $widget->status = $data['status'];
        }
        
        if (isset($data['configuration'])) {
            $widget->configuration = $data['configuration'];
        }

        if (isset($data['ai_model_id'])) {
            $widget->ai_model_id = $data['ai_model_id'];
        }

        if (isset($data['prompt_template_id'])) {
            $widget->prompt_template_id = $data['prompt_template_id'];
        }

        if (isset($data['response_format_id'])) {
            $widget->response_format_id = $data['response_format_id'];
        }
        
        $widget->save();

        // Regenerate embed code if needed
        if (isset($data['configuration']) || 
            isset($data['ai_model_id']) || 
            isset($data['prompt_template_id']) ||
            isset($data['response_format_id'])) {
            $widget->embed_code = $widget->generateEmbedCode('js');
            $widget->save();
        }

        return $widget;
    }

    /**
     * Delete a widget
     *
     * @param int $id
     * @return bool
     */
    public function deleteWidget(int $id): bool
    {
        $widget = Widget::find($id);

        if (!$widget) {
            return false;
        }

        return $widget->delete();
    }

    /**
     * Get widget settings
     *
     * @param int $widgetId
     * @return Collection
     */
    public function getWidgetSettings(int $widgetId): Collection
    {
        return WidgetSetting::where('widget_id', $widgetId)->get();
    }

    /**
     * Create widget setting
     *
     * @param int $widgetId
     * @param array $data
     * @return WidgetSetting|null
     */
    public function createWidgetSetting(int $widgetId, array $data): ?WidgetSetting
    {
        $widget = Widget::find($widgetId);

        if (!$widget) {
            return null;
        }

        // Check if the setting already exists
        $existingSetting = WidgetSetting::where('widget_id', $widgetId)
            ->where('key', $data['key'])
            ->first();
        
        if ($existingSetting) {
            $existingSetting->value = $data['value'];
            $existingSetting->type = $data['type'] ?? 'string';
            $existingSetting->is_public = $data['is_public'] ?? true;
            $existingSetting->description = $data['description'] ?? null;
            $existingSetting->save();
            return $existingSetting;
        }

        // Create new setting
        $setting = new WidgetSetting();
        $setting->widget_id = $widgetId;
        $setting->key = $data['key'];
        $setting->value = $data['value'];
        $setting->type = $data['type'] ?? 'string';
        $setting->is_public = $data['is_public'] ?? true;
        $setting->description = $data['description'] ?? null;
        $setting->save();

        return $setting;
    }

    /**
     * Get widget embed code
     *
     * @param int $id
     * @param string $format
     * @return string|null
     */
    public function getWidgetCode(int $id, string $format = 'js'): ?string
    {
        $widget = Widget::find($id);

        if (!$widget) {
            return null;
        }

        return $widget->generateEmbedCode($format);
    }

    /**
     * Test widget configuration
     *
     * @param array $config
     * @return array
     */
    public function testWidgetConfiguration(array $config): array
    {
        // Validate the configuration
        $result = ['status' => 'success', 'message' => 'Widget configuration is valid'];

        // Check for required fields
        if (!isset($config['name']) || empty($config['name'])) {
            $result = ['status' => 'error', 'message' => 'Widget name is required'];
            return $result;
        }

        // Check configuration structure
        if (!isset($config['configuration']) || !is_array($config['configuration'])) {
            $result = ['status' => 'warning', 'message' => 'Widget configuration is empty or invalid'];
            return $result;
        }

        // More specific validation based on widget type
        if (isset($config['type']) && $config['type'] === 'chat') {
            // Validate chat widget specific configuration
            if (!isset($config['configuration']['appearance']) || !is_array($config['configuration']['appearance'])) {
                $result = ['status' => 'warning', 'message' => 'Chat widget appearance settings are missing'];
                return $result;
            }
            
            if (!isset($config['configuration']['behavior']) || !is_array($config['configuration']['behavior'])) {
                $result = ['status' => 'warning', 'message' => 'Chat widget behavior settings are missing'];
                return $result;
            }

            // Check AI model if specified
            if (isset($config['ai_model_id'])) {
                $model = AIModel::find($config['ai_model_id']);
                if (!$model) {
                    $result = ['status' => 'warning', 'message' => 'Selected AI model does not exist'];
                    return $result;
                }
                if (!$model->isActive) {
                    $result = ['status' => 'warning', 'message' => 'Selected AI model is not active'];
                    return $result;
                }
            }

            // Check prompt template if specified
            if (isset($config['prompt_template_id'])) {
                $template = PromptTemplate::find($config['prompt_template_id']);
                if (!$template) {
                    $result = ['status' => 'warning', 'message' => 'Selected prompt template does not exist'];
                    return $result;
                }
            }
        }

        return $result;
    }

    /**
     * Get widget analytics
     * 
     * @param int $widgetId
     * @return array|null
     */
    public function getWidgetAnalytics(int $widgetId): ?array
    {
        $widget = Widget::find($widgetId);
        
        if (!$widget) {
            return null;
        }
        
        // Here we would typically query analytics data related to this widget
        // For now we'll return a placeholder structure that would be filled with real data
        return [
            'interactions' => [
                'total' => rand(100, 1000),
                'unique_users' => rand(50, 500),
                'average_duration' => rand(60, 300)
            ],
            'messages' => [
                'total' => rand(500, 5000),
                'user_messages' => rand(250, 2500),
                'ai_responses' => rand(250, 2500),
                'average_response_time' => rand(1, 5)
            ],
            'performance' => [
                'uptime_percentage' => rand(95, 100),
                'error_rate' => rand(0, 5)
            ],
            'user_satisfaction' => [
                'rating' => rand(3, 5),
                'feedback_count' => rand(10, 100)
            ],
            'top_queries' => [
                ['query' => 'What is your pricing?', 'count' => rand(10, 50)],
                ['query' => 'How do I get started?', 'count' => rand(10, 50)],
                ['query' => 'Do you offer support?', 'count' => rand(10, 50)],
            ]
        ];
    }

    /**
     * Get widget customization options
     * 
     * @return array
     */
    public function getCustomizationOptions(): array
    {
        return [
            'themes' => [
                ['id' => 'light', 'name' => 'Light Theme'],
                ['id' => 'dark', 'name' => 'Dark Theme'],
                ['id' => 'modern', 'name' => 'Modern'],
                ['id' => 'classic', 'name' => 'Classic'],
                ['id' => 'minimal', 'name' => 'Minimal'],
                ['id' => 'gradient', 'name' => 'Gradient'],
            ],
            'positions' => [
                ['id' => 'bottom-right', 'name' => 'Bottom Right'],
                ['id' => 'bottom-left', 'name' => 'Bottom Left'],
                ['id' => 'top-right', 'name' => 'Top Right'],
                ['id' => 'top-left', 'name' => 'Top Left'],
                ['id' => 'middle-right', 'name' => 'Middle Right'],
                ['id' => 'middle-left', 'name' => 'Middle Left'],
            ],
            'sizes' => [
                ['id' => 'small', 'name' => 'Small', 'width' => 300, 'height' => 400],
                ['id' => 'medium', 'name' => 'Medium', 'width' => 350, 'height' => 500],
                ['id' => 'large', 'name' => 'Large', 'width' => 400, 'height' => 600],
                ['id' => 'extra-large', 'name' => 'Extra Large', 'width' => 450, 'height' => 700],
            ],
            'animations' => [
                ['id' => 'none', 'name' => 'None'],
                ['id' => 'fade', 'name' => 'Fade'],
                ['id' => 'slide', 'name' => 'Slide'],
                ['id' => 'bounce', 'name' => 'Bounce'],
                ['id' => 'zoom', 'name' => 'Zoom'],
            ],
            'shadow_styles' => [
                ['id' => 'none', 'name' => 'None'],
                ['id' => 'sm', 'name' => 'Small'],
                ['id' => 'md', 'name' => 'Medium'],
                ['id' => 'lg', 'name' => 'Large'],
                ['id' => 'xl', 'name' => 'Extra Large'],
            ],
            'shape_styles' => [
                ['id' => 'rounded', 'name' => 'Rounded'],
                ['id' => 'circle', 'name' => 'Circle'],
                ['id' => 'square', 'name' => 'Square'],
                ['id' => 'custom', 'name' => 'Custom'],
            ],
            'fonts' => [
                ['id' => 'system', 'name' => 'System Default'],
                ['id' => 'arial', 'name' => 'Arial'],
                ['id' => 'helvetica', 'name' => 'Helvetica'],
                ['id' => 'verdana', 'name' => 'Verdana'],
                ['id' => 'tahoma', 'name' => 'Tahoma'],
                ['id' => 'trebuchet', 'name' => 'Trebuchet MS'],
                ['id' => 'times', 'name' => 'Times New Roman'],
                ['id' => 'georgia', 'name' => 'Georgia'],
                ['id' => 'garamond', 'name' => 'Garamond'],
                ['id' => 'courier', 'name' => 'Courier New'],
                ['id' => 'brush', 'name' => 'Brush Script MT'],
            ],
            'header_styles' => [
                ['id' => 'standard', 'name' => 'Standard'],
                ['id' => 'compact', 'name' => 'Compact'],
                ['id' => 'minimal', 'name' => 'Minimal'],
                ['id' => 'expanded', 'name' => 'Expanded'],
                ['id' => 'custom', 'name' => 'Custom'],
            ],
            'ai_models' => AIModel::where('isActive', true)->get(['id', 'name', 'provider']),
            'prompt_templates' => PromptTemplate::where('isActive', true)->get(['id', 'name', 'category']),
            'response_formats' => ResponseFormat::all(['id', 'name', 'description']),
        ];
    }
}
