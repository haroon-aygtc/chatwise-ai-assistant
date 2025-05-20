<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class KnowledgeResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'resource_type',
        'collection_id',
        'tags',
        'is_active',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the collection that owns the resource.
     */
    public function collection(): BelongsTo
    {
        return $this->belongsTo(ResourceCollection::class);
    }

    /**
     * Get the file resource associated with this resource.
     */
    public function fileResource(): HasOne
    {
        return $this->hasOne(FileResource::class, 'resource_id');
    }

    /**
     * Get the directory resource associated with this resource.
     */
    public function directoryResource(): HasOne
    {
        return $this->hasOne(DirectoryResource::class, 'resource_id');
    }

    /**
     * Get the web resource associated with this resource.
     */
    public function webResource(): HasOne
    {
        return $this->hasOne(WebResource::class, 'resource_id');
    }
}
