<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResponseFormat extends Model
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
        'format',
        'length',
        'tone',
        'content',
        'system_instructions',
        'options',
        'parameters',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'options' => 'array',
        'parameters' => 'array',
        'is_default' => 'boolean',
    ];
}
