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
        Schema::create('knowledge_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content');
            $table->foreignUuid('category_id')->constrained('document_categories')->onDelete('cascade');
            $table->string('file_type')->nullable();
            $table->integer('file_size')->nullable();
            $table->json('tags')->nullable();
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->string('file_path')->nullable();
            $table->timestamp('last_indexed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_documents');
    }
};
