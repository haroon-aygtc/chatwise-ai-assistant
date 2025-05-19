<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;

class AIModel extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'provider',
        'version',
        'description',
        'api_key',
        'base_url',
        'model_id',
        'is_active',
        'is_default',
        'is_public',
        'temperature',
        'max_tokens',
        'configuration',
        'context',
        'capabilities',
        'price_per_token',
        'context_size',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'api_key',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'is_public' => 'boolean',
        'temperature' => 'float',
        'max_tokens' => 'integer',
        'configuration' => 'array',
        'context' => 'array',
        'capabilities' => 'array',
        'price_per_token' => 'float',
        'context_size' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the API key attribute with decryption
     *
     * @param  string|null  $value
     * @return string|null
     */
    public function getApiKeyAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    /**
     * Set the API key attribute with encryption
     *
     * @param  string|null  $value
     * @return void
     */
    public function setApiKeyAttribute($value)
    {
        $this->attributes['api_key'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Get the model ID attribute
     *
     * @return string|null
     */
    public function getModelIdAttribute()
    {
        // First check if model_id is set directly
        if (!empty($this->attributes['model_id'])) {
            return $this->attributes['model_id'];
        }

        // Otherwise check if it's in the configuration
        $config = $this->configuration;
        return $config['model'] ?? null;
    }

    /**
     * Set the model ID attribute
     *
     * @param  string|null  $value
     * @return void
     */
    public function setModelIdAttribute($value)
    {
        $this->attributes['model_id'] = $value;

        // Also update in configuration if it exists
        if (is_array($this->configuration)) {
            $config = $this->configuration;
            $config['model'] = $value;
            $this->configuration = $config;
        }
    }

    /**
     * Scope a query to only include active models.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include models for a specific provider.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $provider
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    /**
     * Scope a query to only include the default model.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
