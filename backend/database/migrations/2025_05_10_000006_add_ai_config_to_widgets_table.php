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
        Schema::table('widgets', function (Blueprint $table) {
            $table->foreignId('ai_model_id')->nullable()->constrained('ai_models')->onDelete('set null')->after('user_id');
            $table->foreignId('prompt_template_id')->nullable()->constrained('prompt_templates')->onDelete('set null')->after('ai_model_id');
            $table->foreignId('response_format_id')->nullable()->constrained('response_formats')->onDelete('set null')->after('prompt_template_id');
            $table->text('embed_code')->nullable()->after('configuration');
        });

        Schema::table('widget_settings', function (Blueprint $table) {
            $table->boolean('is_public')->default(true)->after('type');
            $table->text('description')->nullable()->after('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('widgets', function (Blueprint $table) {
            $table->dropForeign(['ai_model_id']);
            $table->dropForeign(['prompt_template_id']);
            $table->dropForeign(['response_format_id']);
            $table->dropColumn(['ai_model_id', 'prompt_template_id', 'response_format_id', 'embed_code']);
        });

        Schema::table('widget_settings', function (Blueprint $table) {
            $table->dropColumn(['is_public', 'description']);
        });
    }
};
