<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class FollowUpSuggestion extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'text',
        'category',
        'description',
        'order',
        'is_active',
        'trigger_conditions',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'trigger_conditions' => 'array',
    ];
}