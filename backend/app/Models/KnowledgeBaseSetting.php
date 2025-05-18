<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KnowledgeBaseSetting extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'knowledge_base_settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'is_enabled',
        'priority',
        'include_citations',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
        'include_citations' => 'boolean',
    ];

    /**
     * Get the current settings or create default ones if they don't exist
     */
    public static function getCurrentSettings()
    {
        $settings = self::first();
        
        if (!$settings) {
            $settings = self::create([
                'is_enabled' => true,
                'priority' => 'medium',
                'include_citations' => true,
            ]);
        }
        
        return $settings;
    }
}
