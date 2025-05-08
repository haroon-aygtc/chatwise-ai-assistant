<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class AdminPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create comprehensive permissions list
        $this->createComprehensivePermissions();

        // Assign all permissions to admin role
        $this->assignAllPermissionsToAdmin();
    }

    /**
     * Create a comprehensive list of permissions
     */
    private function createComprehensivePermissions(): void
    {
        $permissions = [
            // User Management permissions
            ['name' => 'view_users', 'guard_name' => 'web', 'description' => 'View user accounts'],
            ['name' => 'create_users', 'guard_name' => 'web', 'description' => 'Create new user accounts'],
            ['name' => 'edit_users', 'guard_name' => 'web', 'description' => 'Edit existing user accounts'],
            ['name' => 'delete_users', 'guard_name' => 'web', 'description' => 'Delete user accounts'],
            ['name' => 'assign_roles', 'guard_name' => 'web', 'description' => 'Assign roles to users'],
            
            // Legacy User Management permissions (for backward compatibility)
            ['name' => 'view users', 'guard_name' => 'web', 'description' => 'View user accounts'],
            ['name' => 'create users', 'guard_name' => 'web', 'description' => 'Create new user accounts'],
            ['name' => 'edit users', 'guard_name' => 'web', 'description' => 'Edit existing user accounts'],
            ['name' => 'delete users', 'guard_name' => 'web', 'description' => 'Delete user accounts'],
            ['name' => 'manage users', 'guard_name' => 'web', 'description' => 'Full user management access'],

            // Role management permissions
            ['name' => 'view_roles', 'guard_name' => 'web', 'description' => 'View roles'],
            ['name' => 'create_roles', 'guard_name' => 'web', 'description' => 'Create new roles'],
            ['name' => 'edit_roles', 'guard_name' => 'web', 'description' => 'Edit existing roles'],
            ['name' => 'delete_roles', 'guard_name' => 'web', 'description' => 'Delete roles'],
            
            // Legacy Role management permissions (for backward compatibility)
            ['name' => 'view roles', 'guard_name' => 'web', 'description' => 'View roles'],
            ['name' => 'create roles', 'guard_name' => 'web', 'description' => 'Create new roles'],
            ['name' => 'edit roles', 'guard_name' => 'web', 'description' => 'Edit existing roles'],
            ['name' => 'delete roles', 'guard_name' => 'web', 'description' => 'Delete roles'],
            ['name' => 'manage roles', 'guard_name' => 'web', 'description' => 'Full role management access'],

            // Permission management
            ['name' => 'view_permissions', 'guard_name' => 'web', 'description' => 'View permissions'],
            ['name' => 'manage_permissions', 'guard_name' => 'web', 'description' => 'Manage permissions'],
            
            // Legacy Permission management (for backward compatibility)
            ['name' => 'view permissions', 'guard_name' => 'web', 'description' => 'View permissions'],
            ['name' => 'manage permissions', 'guard_name' => 'web', 'description' => 'Manage permissions'],

            // Activity Log
            ['name' => 'view_activity_log', 'guard_name' => 'web', 'description' => 'View activity logs'],
            ['name' => 'view activity log', 'guard_name' => 'web', 'description' => 'View activity logs'],

            // System settings
            ['name' => 'view_settings', 'guard_name' => 'web', 'description' => 'View system settings'],
            ['name' => 'edit_settings', 'guard_name' => 'web', 'description' => 'Edit system settings'],
            
            // Legacy System settings (for backward compatibility)
            ['name' => 'view settings', 'guard_name' => 'web', 'description' => 'View system settings'],
            ['name' => 'edit settings', 'guard_name' => 'web', 'description' => 'Edit system settings'],

            // AI Configuration
            ['name' => 'manage_models', 'guard_name' => 'web', 'description' => 'Manage AI models'],
            ['name' => 'edit_prompts', 'guard_name' => 'web', 'description' => 'Edit AI prompts'],
            ['name' => 'test_ai', 'guard_name' => 'web', 'description' => 'Test AI functionality'],
            ['name' => 'view_ai_logs', 'guard_name' => 'web', 'description' => 'View AI logs'],

            // Widget Builder
            ['name' => 'create_widgets', 'guard_name' => 'web', 'description' => 'Create widgets'],
            ['name' => 'edit_widgets', 'guard_name' => 'web', 'description' => 'Edit widgets'],
            ['name' => 'publish_widgets', 'guard_name' => 'web', 'description' => 'Publish widgets'],
            ['name' => 'delete_widgets', 'guard_name' => 'web', 'description' => 'Delete widgets'],

            // Knowledge Base
            ['name' => 'create_kb_articles', 'guard_name' => 'web', 'description' => 'Create knowledge base articles'],
            ['name' => 'edit_kb_articles', 'guard_name' => 'web', 'description' => 'Edit knowledge base articles'],
            ['name' => 'delete_kb_articles', 'guard_name' => 'web', 'description' => 'Delete knowledge base articles'],
            ['name' => 'manage_kb_categories', 'guard_name' => 'web', 'description' => 'Manage knowledge base categories'],

            // System Settings
            ['name' => 'manage_api_keys', 'guard_name' => 'web', 'description' => 'Manage API keys'],
            ['name' => 'billing_subscription', 'guard_name' => 'web', 'description' => 'Manage billing and subscriptions'],
            ['name' => 'system_backup', 'guard_name' => 'web', 'description' => 'Manage system backups'],
            ['name' => 'view_audit_logs', 'guard_name' => 'web', 'description' => 'View audit logs'],
        ];

        foreach ($permissions as $permissionData) {
            $permissionName = $permissionData['name'];
            $guardName = $permissionData['guard_name'];

            // Check if permission already exists
            $permission = Permission::where('name', $permissionName)
                ->where('guard_name', $guardName)
                ->first();

            if (!$permission) {
                // Create permission if it doesn't exist
                Permission::create($permissionData);
                $this->command->info("Created permission: {$permissionName}");
            } else {
                // Update existing permission with new data
                $permission->update($permissionData);
                $this->command->info("Updated permission: {$permissionName}");
            }
        }
    }

    /**
     * Assign all permissions to admin role
     */
    private function assignAllPermissionsToAdmin(): void
    {
        // Get admin role
        $adminRole = Role::where('name', 'admin')->first();

        if (!$adminRole) {
            $this->command->error("Admin role not found. Please run RolesAndPermissionsSeeder first.");
            return;
        }

        // Get all permissions
        $allPermissions = Permission::all()->pluck('name')->toArray();

        // Assign all permissions to admin role
        $adminRole->syncPermissions($allPermissions);
        $this->command->info("Assigned all permissions to admin role");
    }
}
