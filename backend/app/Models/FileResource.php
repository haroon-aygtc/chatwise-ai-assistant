<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FileResource extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'content',
        'is_processed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'is_processed' => 'boolean',
    ];

    /**
     * Get the resource that owns the file resource.
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(KnowledgeResource::class, 'resource_id');
    }
}
