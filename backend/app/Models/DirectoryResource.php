<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectoryResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'path',
        'recursive',
        'file_types',
        'include_patterns',
        'exclude_patterns',
        'last_synced_at',
        'is_synced',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'recursive' => 'boolean',
        'file_types' => 'array',
        'include_patterns' => 'array',
        'exclude_patterns' => 'array',
        'last_synced_at' => 'datetime',
        'is_synced' => 'boolean',
    ];

    /**
     * Get the resource that owns the directory resource.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(KnowledgeResource::class, 'resource_id');
    }
}
