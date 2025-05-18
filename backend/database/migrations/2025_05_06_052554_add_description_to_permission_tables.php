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
        $tableNames = config('permission.table_names', [
            'roles' => 'roles',
            'permissions' => 'permissions',
        ]);

        // Add description field to roles table if it doesn't exist
        if (Schema::hasTable($tableNames['roles']) && !Schema::hasColumn($tableNames['roles'], 'description')) {
            Schema::table($tableNames['roles'], function (Blueprint $table) {
                $table->text('description')->nullable()->after('guard_name');
            });
        }

        // Add description field to permissions table if it doesn't exist
        if (Schema::hasTable($tableNames['permissions']) && !Schema::hasColumn($tableNames['permissions'], 'description')) {
            Schema::table($tableNames['permissions'], function (Blueprint $table) {
                $table->text('description')->nullable()->after('guard_name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names', [
            'roles' => 'roles',
            'permissions' => 'permissions',
        ]);

        // Drop description column from roles table if it exists
        if (Schema::hasTable($tableNames['roles']) && Schema::hasColumn($tableNames['roles'], 'description')) {
            Schema::table($tableNames['roles'], function (Blueprint $table) {
                $table->dropColumn('description');
            });
        }

        // Drop description column from permissions table if it exists
        if (Schema::hasTable($tableNames['permissions']) && Schema::hasColumn($tableNames['permissions'], 'description')) {
            Schema::table($tableNames['permissions'], function (Blueprint $table) {
                $table->dropColumn('description');
            });
        }
    }
};