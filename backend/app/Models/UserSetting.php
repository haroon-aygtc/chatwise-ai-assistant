<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'theme',
        'language',
        'notifications',
        'accessibility',
        'chat_preferences',
        'display',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'notifications' => 'array',
        'accessibility' => 'array',
        'chat_preferences' => 'array',
        'display' => 'array',
    ];

    /**
     * Get the user that owns the settings.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
