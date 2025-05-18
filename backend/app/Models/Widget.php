<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Widget extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'type',
        'status',
        'configuration',
        'user_id',
        'embed_code',
        'ai_model_id',
        'prompt_template_id',
        'response_format_id'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'configuration' => 'array',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the settings for the widget.
     */
    public function settings(): HasMany
    {
        return $this->hasMany(WidgetSetting::class);
    }

    /**
     * Get the user that owns the widget.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the AI model associated with the widget
     */
    public function aiModel(): BelongsTo
    {
        return $this->belongsTo(AIModel::class, 'ai_model_id');
    }

    /**
     * Get the prompt template associated with the widget
     */
    public function promptTemplate(): BelongsTo
    {
        return $this->belongsTo(PromptTemplate::class, 'prompt_template_id');
    }

    /**
     * Get the response format associated with the widget
     */
    public function responseFormat(): BelongsTo
    {
        return $this->belongsTo(ResponseFormat::class, 'response_format_id');
    }

    /**
     * Generate the embed code for this widget
     * 
     * @param string $format
     * @return string
     */
    public function generateEmbedCode(string $format = 'js'): string
    {
        $domain = config('app.url');
        $widgetId = $this->id;

        switch ($format) {
            case 'js':
                return $this->generateJsEmbedCode($domain, $widgetId);
            case 'react':
                return $this->generateReactEmbedCode($domain, $widgetId);
            case 'iframe':
            default:
                return $this->generateIframeEmbedCode($domain, $widgetId);
        }
    }

    /**
     * Generate JavaScript embed code
     */
    private function generateJsEmbedCode(string $domain, int $widgetId): string
    {
        return "<script>\n" .
               "  (function(w,d,s,o,f,js,fjs) {\n" .
               "    w['ChatWidget']=o;\n" .
               "    w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };\n" .
               "    js = d.createElement(s); js.id = o;\n" .
               "    js.src = '{$domain}/widget.js?id={$widgetId}';\n" .
               "    js.async = 1;\n" .
               "    fjs = d.getElementsByTagName(s)[0];\n" .
               "    fjs.parentNode.insertBefore(js, fjs);\n" .
               "  }(window, document, 'script', 'cw'));\n" .
               "  cw('init', { widgetId: '{$widgetId}' });\n" .
               "</script>";
    }

    /**
     * Generate React embed code
     */
    private function generateReactEmbedCode(string $domain, int $widgetId): string
    {
        return "import { ChatWidget } from '@yourapp/chat-widget';\n\n" .
               "const YourComponent = () => {\n" .
               "  return (\n" .
               "    <ChatWidget \n" .
               "      widgetId=\"{$widgetId}\"\n" .
               "      apiUrl=\"{$domain}/api\"\n" .
               "    />\n" .
               "  );\n" .
               "};\n\n" .
               "export default YourComponent;";
    }

    /**
     * Generate iframe embed code
     */
    private function generateIframeEmbedCode(string $domain, int $widgetId): string
    {
        $width = $this->configuration['appearance']['widgetWidth'] ?? 350;
        $height = $this->configuration['appearance']['widgetHeight'] ?? 500;
        
        return "<iframe\n" .
               "  src=\"{$domain}/widget/{$widgetId}\"\n" .
               "  width=\"{$width}\"\n" .
               "  height=\"{$height}\"\n" .
               "  frameborder=\"0\"\n" .
               "  allow=\"microphone; camera\"\n" .
               "></iframe>";
    }
}
