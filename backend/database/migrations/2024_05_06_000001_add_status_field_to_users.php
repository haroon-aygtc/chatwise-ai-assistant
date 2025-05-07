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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'inactive', 'pending', 'suspended'])->default('pending');
            }
            
            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url')->nullable();
            }
            
            if (!Schema::hasColumn('users', 'last_active')) {
                $table->timestamp('last_active')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }
            
            if (Schema::hasColumn('users', 'avatar_url')) {
                $table->dropColumn('avatar_url');
            }
            
            if (Schema::hasColumn('users', 'last_active')) {
                $table->dropColumn('last_active');
            }
        });
    }
};
