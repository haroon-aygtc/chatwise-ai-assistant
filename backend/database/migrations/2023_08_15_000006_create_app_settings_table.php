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
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name');
            $table->string('logo')->nullable();
            $table->string('favicon')->nullable();
            $table->string('default_theme')->default('light');
            $table->json('available_languages');
            $table->string('default_language')->default('en');
            $table->string('support_email')->nullable();
            $table->string('terms_url')->nullable();
            $table->string('privacy_url')->nullable();
            $table->integer('max_upload_size')->default(5); // in MB
            $table->json('allowed_file_types');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
