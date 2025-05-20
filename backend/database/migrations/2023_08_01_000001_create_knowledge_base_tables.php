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
        // Create resource collections table
        Schema::create('resource_collections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Create knowledge resources table
        Schema::create('knowledge_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('resource_type');
            $table->uuid('collection_id')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('collection_id')
                ->references('id')
                ->on('resource_collections')
                ->onDelete('set null');
        });

        // Create file resources table
        Schema::create('file_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('resource_id');
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_type');
            $table->bigInteger('file_size');
            $table->longText('content')->nullable();
            $table->boolean('is_processed')->default(false);
            $table->timestamps();

            $table->foreign('resource_id')
                ->references('id')
                ->on('knowledge_resources')
                ->onDelete('cascade');
        });

        // Create directory resources table
        Schema::create('directory_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('resource_id');
            $table->string('path');
            $table->boolean('recursive')->default(false);
            $table->json('file_types')->nullable();
            $table->json('include_patterns')->nullable();
            $table->json('exclude_patterns')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->boolean('is_synced')->default(false);
            $table->timestamps();

            $table->foreign('resource_id')
                ->references('id')
                ->on('knowledge_resources')
                ->onDelete('cascade');
        });

        // Create web resources table
        Schema::create('web_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('resource_id');
            $table->string('url');
            $table->integer('scraping_depth')->default(1);
            $table->json('include_selector_patterns')->nullable();
            $table->json('exclude_selector_patterns')->nullable();
            $table->timestamp('last_scraped_at')->nullable();
            $table->string('scraping_status')->default('NEVER_SCRAPED');
            $table->longText('content')->nullable();
            $table->timestamps();

            $table->foreign('resource_id')
                ->references('id')
                ->on('knowledge_resources')
                ->onDelete('cascade');
        });

        // Create knowledge profiles table
        Schema::create('knowledge_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('collection_ids')->nullable();
            $table->json('resource_ids')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
        });

        // Create context scopes table
        Schema::create('context_scopes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('scope_type');
            $table->json('conditions')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('context_scopes');
        Schema::dropIfExists('knowledge_profiles');
        Schema::dropIfExists('web_resources');
        Schema::dropIfExists('directory_resources');
        Schema::dropIfExists('file_resources');
        Schema::dropIfExists('knowledge_resources');
        Schema::dropIfExists('resource_collections');
    }
};
