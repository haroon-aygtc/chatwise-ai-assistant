<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PromptTemplate extends Model
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
        'template',
        'variables',
        'category',
        'is_default',
        'is_active',
        'usage_count',
        'content',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'variables' => 'array',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
    ];

    /**
     * Get the variables attribute
     *
     * @return Attribute
     */
    protected function variables(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (empty($value)) {
                    return [];
                }

                if (is_string($value)) {
                    $decoded = json_decode($value, true);
                    return is_array($decoded) ? $decoded : [];
                }

                return $value;
            },
            set: function ($value) {
                if (is_array($value)) {
                    return json_encode($value);
                }

                return $value;
            }
        );
    }

    /**
     * Initialize default values for new models
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!isset($model->usage_count)) {
                $model->usage_count = 0;
            }

            if (!isset($model->is_active)) {
                $model->is_active = true;
            }

            if (!isset($model->is_default)) {
                $model->is_default = false;
            }
        });
    }
}
