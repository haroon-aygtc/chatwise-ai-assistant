
<?php

namespace App\Services;

use App\Models\Widget;
use App\Models\WidgetSetting;
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
        return Widget::find($id);
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
        $widget->user_id = Auth::id() ?? $data['user_id'] ?? null;
        $widget->save();

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
        
        $widget->save();

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
            $existingSetting->save();
            return $existingSetting;
        }

        // Create new setting
        $setting = new WidgetSetting();
        $setting->widget_id = $widgetId;
        $setting->key = $data['key'];
        $setting->value = $data['value'];
        $setting->type = $data['type'] ?? 'string';
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

        $domain = config('app.url');
        $widgetId = $id;

        switch ($format) {
            case 'js':
                $code = "<script>\n";
                $code .= "  (function(w,d,s,o,f,js,fjs) {\n";
                $code .= "    w['ChatWidget']=o;\n";
                $code .= "    w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };\n";
                $code .= "    js = d.createElement(s); js.id = o;\n";
                $code .= "    js.src = '{$domain}/widget.js?id={$widgetId}';\n";
                $code .= "    js.async = 1;\n";
                $code .= "    fjs = d.getElementsByTagName(s)[0];\n";
                $code .= "    fjs.parentNode.insertBefore(js, fjs);\n";
                $code .= "  }(window, document, 'script', 'cw'));\n";
                $code .= "  cw('init', { widgetId: '{$widgetId}' });\n";
                $code .= "</script>";
                break;
                
            case 'react':
                $code = "import { ChatWidget } from '@yourapp/chat-widget';\n\n";
                $code .= "const YourComponent = () => {\n";
                $code .= "  return (\n";
                $code .= "    <ChatWidget \n";
                $code .= "      widgetId=\"{$widgetId}\"\n";
                $code .= "      apiUrl=\"{$domain}/api\"\n";
                $code .= "    />\n";
                $code .= "  );\n";
                $code .= "};\n\n";
                $code .= "export default YourComponent;";
                break;
                
            case 'iframe':
            default:
                $code = "<iframe\n";
                $code .= "  src=\"{$domain}/widget/{$widgetId}\"\n";
                $code .= "  width=\"350\"\n";
                $code .= "  height=\"500\"\n";
                $code .= "  frameborder=\"0\"\n";
                $code .= "  allow=\"microphone; camera\"\n";
                $code .= "></iframe>";
                break;
        }

        return $code;
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

        // More specific validation could be added here based on widget type
        if (isset($config['type']) && $config['type'] === 'chat') {
            // Validate chat widget specific configuration
            if (!isset($config['configuration']['appearance']) || !is_array($config['configuration']['appearance'])) {
                $result = ['status' => 'warning', 'message' => 'Chat widget appearance settings are missing'];
            }
            
            if (!isset($config['configuration']['behavior']) || !is_array($config['configuration']['behavior'])) {
                $result = ['status' => 'warning', 'message' => 'Chat widget behavior settings are missing'];
            }
        }

        return $result;
    }
}
