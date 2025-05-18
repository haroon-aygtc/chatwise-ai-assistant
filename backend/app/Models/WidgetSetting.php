<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WidgetSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'widget_id',
        'key',
        'value',
        'type',
        'is_public',
        'description'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'array',
        'is_public' => 'boolean',
    ];

    /**
     * Get the widget that owns the setting.
     */
    public function widget(): BelongsTo
    {
        return $this->belongsTo(Widget::class);
    }

    /**
     * Get a specific setting for a widget
     * 
     * @param int $widgetId
     * @param string $key
     * @return WidgetSetting|null
     */
    public static function getSetting(int $widgetId, string $key): ?WidgetSetting
    {
        return self::where('widget_id', $widgetId)
            ->where('key', $key)
            ->first();
    }

    /**
     * Get setting value
     * 
     * @param int $widgetId
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function getSettingValue(int $widgetId, string $key, $default = null)
    {
        $setting = self::getSetting($widgetId, $key);
        return $setting ? $setting->value : $default;
    }
}
