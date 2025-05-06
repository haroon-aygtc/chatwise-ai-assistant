<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FollowUpSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'enabled',
        'max_suggestions',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];
}
