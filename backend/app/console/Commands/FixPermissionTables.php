<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Spatie\Permission\PermissionRegistrar;

class FixPermissionTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:fix-tables';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix permission tables by directly inserting records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing permission tables...');

        // Clear permission cache
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        $this->info('Permission cache cleared');

        // 1. Ensure admin panel permissions exist
        $adminPanelPermission = Permission::firstOrCreate([
            'name' => 'access admin panel',
            'guard_name' => 'web',
        ], [
            'description' => 'Access the admin panel',
        ]);

        $adminPanelPermissionUnderscore = Permission::firstOrCreate([
            'name' => 'access_admin_panel',
            'guard_name' => 'web',
        ], [
            'description' => 'Access the admin panel',
        ]);

        $this->info('Admin panel permissions created or confirmed');

        // 2. Get the admin role
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->error("Admin role not found!");
            return 1;
        }

        // 3. Get the admin user
        $adminUser = User::where('email', 'admin@example.com')->first();

        if (!$adminUser) {
            $this->error("Admin user not found!");
            return 1;
        }

        // 4. Ensure admin user has admin role (model_has_roles table)
        $modelHasRoleExists = DB::table('model_has_roles')
            ->where('role_id', $adminRole->id)
            ->where('model_id', $adminUser->id)
            ->where('model_type', get_class($adminUser))
            ->exists();

        if (!$modelHasRoleExists) {
            DB::table('model_has_roles')->insert([
                'role_id' => $adminRole->id,
                'model_id' => $adminUser->id,
                'model_type' => get_class($adminUser),
            ]);
            $this->info('Added admin role to admin user in model_has_roles table');
        } else {
            $this->info('Admin user already has admin role in model_has_roles table');
        }

        // 5. Ensure admin role has admin panel permissions (role_has_permissions table)
        $roleHasPermissionExists1 = DB::table('role_has_permissions')
            ->where('permission_id', $adminPanelPermission->id)
            ->where('role_id', $adminRole->id)
            ->exists();

        if (!$roleHasPermissionExists1) {
            DB::table('role_has_permissions')->insert([
                'permission_id' => $adminPanelPermission->id,
                'role_id' => $adminRole->id,
            ]);
            $this->info('Added "access admin panel" permission to admin role in role_has_permissions table');
        } else {
            $this->info('Admin role already has "access admin panel" permission in role_has_permissions table');
        }

        $roleHasPermissionExists2 = DB::table('role_has_permissions')
            ->where('permission_id', $adminPanelPermissionUnderscore->id)
            ->where('role_id', $adminRole->id)
            ->exists();

        if (!$roleHasPermissionExists2) {
            DB::table('role_has_permissions')->insert([
                'permission_id' => $adminPanelPermissionUnderscore->id,
                'role_id' => $adminRole->id,
            ]);
            $this->info('Added "access_admin_panel" permission to admin role in role_has_permissions table');
        } else {
            $this->info('Admin role already has "access_admin_panel" permission in role_has_permissions table');
        }

        // 6. Directly assign permissions to admin user (model_has_permissions table)
        $modelHasPermissionExists1 = DB::table('model_has_permissions')
            ->where('permission_id', $adminPanelPermission->id)
            ->where('model_id', $adminUser->id)
            ->where('model_type', get_class($adminUser))
            ->exists();

        if (!$modelHasPermissionExists1) {
            DB::table('model_has_permissions')->insert([
                'permission_id' => $adminPanelPermission->id,
                'model_id' => $adminUser->id,
                'model_type' => get_class($adminUser),
            ]);
            $this->info('Added "access admin panel" permission directly to admin user in model_has_permissions table');
        } else {
            $this->info('Admin user already has direct "access admin panel" permission in model_has_permissions table');
        }

        $modelHasPermissionExists2 = DB::table('model_has_permissions')
            ->where('permission_id', $adminPanelPermissionUnderscore->id)
            ->where('model_id', $adminUser->id)
            ->where('model_type', get_class($adminUser))
            ->exists();

        if (!$modelHasPermissionExists2) {
            DB::table('model_has_permissions')->insert([
                'permission_id' => $adminPanelPermissionUnderscore->id,
                'model_id' => $adminUser->id,
                'model_type' => get_class($adminUser),
            ]);
            $this->info('Added "access_admin_panel" permission directly to admin user in model_has_permissions table');
        } else {
            $this->info('Admin user already has direct "access_admin_panel" permission in model_has_permissions table');
        }

        // Clear permission cache again
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        $this->info('Permission cache cleared again');

        // Verify permissions
        $adminUser = User::where('email', 'admin@example.com')->first();
        if ($adminUser->hasPermissionTo('access admin panel') && $adminUser->hasPermissionTo('access_admin_panel')) {
            $this->info("Admin user now has admin panel access permissions!");
        } else {
            $this->error("Failed to assign permissions to admin user!");
            return 1;
        }

        $this->info('Permission tables fixed successfully!');
        return 0;
    }
}
