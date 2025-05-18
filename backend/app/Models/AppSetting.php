<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'app_name',
        'logo',
        'favicon',
        'default_theme',
        'available_languages',
        'default_language',
        'support_email',
        'terms_url',
        'privacy_url',
        'max_upload_size',
        'allowed_file_types',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'available_languages' => 'array',
        'allowed_file_types' => 'array',
        'max_upload_size' => 'integer',
    ];
}
