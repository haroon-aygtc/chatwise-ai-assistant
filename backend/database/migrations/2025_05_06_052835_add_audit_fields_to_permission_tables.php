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

        // Add audit fields to roles table if they don't exist
        if (Schema::hasTable($tableNames['roles'])) {
            $rolesTable = $tableNames['roles'];

            // Check if status column exists
            $hasStatusColumn = Schema::hasColumn($rolesTable, 'status');

            // Check if created_by column exists
            $hasCreatedByColumn = Schema::hasColumn($rolesTable, 'created_by');

            // Check if updated_by column exists
            $hasUpdatedByColumn = Schema::hasColumn($rolesTable, 'updated_by');

            Schema::table($rolesTable, function (Blueprint $table) use ($hasStatusColumn, $hasCreatedByColumn, $hasUpdatedByColumn) {
                // Add status field if it doesn't exist
                if (!$hasStatusColumn) {
                    $table->string('status')->default('active')->after('description');
                }

                // Add created_by field if it doesn't exist
                if (!$hasCreatedByColumn) {
                    $table->unsignedBigInteger('created_by')->nullable()->after('created_at');
                    $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
                }

                // Add updated_by field if it doesn't exist
                if (!$hasUpdatedByColumn) {
                    $table->unsignedBigInteger('updated_by')->nullable()->after('updated_at');
                    $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
                }
            });
        }

        // Add audit fields to permissions table if they don't exist
        if (Schema::hasTable($tableNames['permissions'])) {
            $permissionsTable = $tableNames['permissions'];

            // Check if status column exists
            $hasStatusColumn = Schema::hasColumn($permissionsTable, 'status');

            // Check if created_by column exists
            $hasCreatedByColumn = Schema::hasColumn($permissionsTable, 'created_by');

            // Check if updated_by column exists
            $hasUpdatedByColumn = Schema::hasColumn($permissionsTable, 'updated_by');

            Schema::table($permissionsTable, function (Blueprint $table) use ($hasStatusColumn, $hasCreatedByColumn, $hasUpdatedByColumn) {
                // Add status field if it doesn't exist
                if (!$hasStatusColumn) {
                    $table->string('status')->default('active')->after('description');
                }

                // Add created_by field if it doesn't exist
                if (!$hasCreatedByColumn) {
                    $table->unsignedBigInteger('created_by')->nullable()->after('created_at');
                    $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
                }

                // Add updated_by field if it doesn't exist
                if (!$hasUpdatedByColumn) {
                    $table->unsignedBigInteger('updated_by')->nullable()->after('updated_at');
                    $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
                }
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

        // Remove audit fields from roles table if they exist
        if (Schema::hasTable($tableNames['roles'])) {
            $rolesTable = $tableNames['roles'];

            // Check if columns exist
            $hasCreatedByColumn = Schema::hasColumn($rolesTable, 'created_by');
            $hasUpdatedByColumn = Schema::hasColumn($rolesTable, 'updated_by');
            $hasStatusColumn = Schema::hasColumn($rolesTable, 'status');

            Schema::table($rolesTable, function (Blueprint $table) use ($hasCreatedByColumn, $hasUpdatedByColumn, $hasStatusColumn) {
                // Drop foreign keys if they exist
                if ($hasCreatedByColumn) {
                    $table->dropForeign(['created_by']);
                }

                if ($hasUpdatedByColumn) {
                    $table->dropForeign(['updated_by']);
                }

                // Drop columns if they exist
                $columns = [];
                if ($hasStatusColumn) {
                    $columns[] = 'status';
                }
                if ($hasCreatedByColumn) {
                    $columns[] = 'created_by';
                }
                if ($hasUpdatedByColumn) {
                    $columns[] = 'updated_by';
                }

                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }

        // Remove audit fields from permissions table if they exist
        if (Schema::hasTable($tableNames['permissions'])) {
            $permissionsTable = $tableNames['permissions'];

            // Check if columns exist
            $hasCreatedByColumn = Schema::hasColumn($permissionsTable, 'created_by');
            $hasUpdatedByColumn = Schema::hasColumn($permissionsTable, 'updated_by');
            $hasStatusColumn = Schema::hasColumn($permissionsTable, 'status');

            Schema::table($permissionsTable, function (Blueprint $table) use ($hasCreatedByColumn, $hasUpdatedByColumn, $hasStatusColumn) {
                // Drop foreign keys if they exist
                if ($hasCreatedByColumn) {
                    $table->dropForeign(['created_by']);
                }

                if ($hasUpdatedByColumn) {
                    $table->dropForeign(['updated_by']);
                }

                // Drop columns if they exist
                $columns = [];
                if ($hasStatusColumn) {
                    $columns[] = 'status';
                }
                if ($hasCreatedByColumn) {
                    $columns[] = 'created_by';
                }
                if ($hasUpdatedByColumn) {
                    $columns[] = 'updated_by';
                }

                if (!empty($columns)) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};