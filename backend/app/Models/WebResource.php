<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'url',
        'scraping_depth',
        'include_selector_patterns',
        'exclude_selector_patterns',
        'last_scraped_at',
        'scraping_status',
        'content',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scraping_depth' => 'integer',
        'include_selector_patterns' => 'array',
        'exclude_selector_patterns' => 'array',
        'last_scraped_at' => 'datetime',
    ];

    /**
     * Get the resource that owns the web resource.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(KnowledgeResource::class, 'resource_id');
    }
}
