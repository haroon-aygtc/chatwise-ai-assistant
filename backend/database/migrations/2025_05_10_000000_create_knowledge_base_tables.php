<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create document_categories table
        Schema::create('document_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Create knowledge_documents table
        Schema::create('knowledge_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content');
            $table->foreignUuid('category_id')->nullable()->constrained('document_categories')->nullOnDelete();
            $table->string('file_type')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->json('tags')->nullable();
            $table->string('status')->default('processing');
            $table->string('file_path')->nullable();
            $table->string('external_source_url')->nullable();
            $table->string('external_source_type')->nullable();
            $table->timestamps();
            $table->timestamp('last_indexed_at')->nullable();
            $table->softDeletes();
        });

        // Create knowledge_base_settings table
        Schema::create('knowledge_base_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_enabled')->default(true);
            $table->enum('priority', ['low', 'medium', 'high', 'exclusive'])->default('medium');
            $table->boolean('include_citations')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_documents');
        Schema::dropIfExists('document_categories');
        Schema::dropIfExists('knowledge_base_settings');
    }
};