
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIModel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'provider',
        'modelId',
        'apiKey',
        'baseUrl',
        'isActive',
        'isDefault',
        'capabilities',
        'pricePerToken',
        'contextSize'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'capabilities' => 'array',
        'isActive' => 'boolean',
        'isDefault' => 'boolean',
        'pricePerToken' => 'float',
        'contextSize' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'apiKey'
    ];

    /**
     * Get the widgets that use this AI model
     */
    public function widgets(): HasMany
    {
        return $this->hasMany(Widget::class, 'ai_model_id');
    }
}
