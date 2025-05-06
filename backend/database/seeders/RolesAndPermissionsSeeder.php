<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $this->createPermissions();

        // Create roles and assign permissions
        $this->createRoles();

        // Create test users
        $this->createUsers();
    }

    /**
     * Create necessary permissions
     */
    private function createPermissions(): void
    {
        $permissions = [
            // User management permissions
            ['name' => 'view users', 'guard_name' => 'web', 'description' => 'View user accounts'],
            ['name' => 'create users', 'guard_name' => 'web', 'description' => 'Create new user accounts'],
            ['name' => 'edit users', 'guard_name' => 'web', 'description' => 'Edit existing user accounts'],
            ['name' => 'delete users', 'guard_name' => 'web', 'description' => 'Delete user accounts'],
            ['name' => 'manage users', 'guard_name' => 'web', 'description' => 'Full user management access'],

            // Role management permissions
            ['name' => 'view roles', 'guard_name' => 'web', 'description' => 'View roles'],
            ['name' => 'create roles', 'guard_name' => 'web', 'description' => 'Create new roles'],
            ['name' => 'edit roles', 'guard_name' => 'web', 'description' => 'Edit existing roles'],
            ['name' => 'delete roles', 'guard_name' => 'web', 'description' => 'Delete roles'],
            ['name' => 'manage roles', 'guard_name' => 'web', 'description' => 'Full role management access'],

            // Permission management
            ['name' => 'view permissions', 'guard_name' => 'web', 'description' => 'View permissions'],
            ['name' => 'manage permissions', 'guard_name' => 'web', 'description' => 'Manage permissions'],

            // Activity Log
            ['name' => 'view activity log', 'guard_name' => 'web', 'description' => 'View activity logs'],

            // System settings
            ['name' => 'view settings', 'guard_name' => 'web', 'description' => 'View system settings'],
            ['name' => 'edit settings', 'guard_name' => 'web', 'description' => 'Edit system settings'],
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
     * Create roles and assign permissions
     */
    private function createRoles(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'guard_name' => 'web',
                'description' => 'Administrator with full system access',
                'permissions' => Permission::all()->pluck('name')->toArray(),
                'status' => 'active',
            ],
            [
                'name' => 'manager',
                'guard_name' => 'web',
                'description' => 'Manager with limited administrative access',
                'permissions' => [
                    'view users',
                    'create users',
                    'edit users',
                    'view roles',
                    'view permissions',
                    'view activity log',
                    'view settings',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'editor',
                'guard_name' => 'web',
                'description' => 'Editor with content management access',
                'permissions' => [
                    'view users',
                    'view activity log',
                ],
                'status' => 'active',
            ],
            [
                'name' => 'user',
                'guard_name' => 'web',
                'description' => 'Regular user with basic access',
                'permissions' => [],
                'status' => 'active',
            ],
        ];

        foreach ($roles as $roleData) {
            $roleName = $roleData['name'];
            $guardName = $roleData['guard_name'];
            $permissions = $roleData['permissions'];

            // Remove permissions from role data before creating/updating
            unset($roleData['permissions']);

            // Check if role already exists
            $role = Role::where('name', $roleName)
                ->where('guard_name', $guardName)
                ->first();

            if (!$role) {
                // Create role if it doesn't exist
                $role = Role::create($roleData);
                $this->command->info("Created role: {$roleName}");
            } else {
                // Update existing role with new data
                $role->update($roleData);
                $this->command->info("Updated role: {$roleName}");
            }

            // Sync permissions
            $role->syncPermissions($permissions);
            $this->command->info("Synced permissions for role: {$roleName}");
        }
    }

    /**
     * Create test users
     */
    private function createUsers(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => 'password',
                'status' => 'active',
                'role' => 'admin',
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@example.com',
                'password' => 'password',
                'status' => 'active',
                'role' => 'manager',
            ],
            [
                'name' => 'Editor User',
                'email' => 'editor@example.com',
                'password' => 'password',
                'status' => 'active',
                'role' => 'editor',
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@example.com',
                'password' => 'password',
                'status' => 'active',
                'role' => 'user',
            ],
        ];

        foreach ($users as $userData) {
            $email = $userData['email'];
            $role = $userData['role'];
            unset($userData['role']);

            // Check if user already exists
            $user = User::where('email', $email)->first();

            if (!$user) {
                // Hash the password
                $userData['password'] = Hash::make($userData['password']);
                $userData['last_active'] = now();

                // Create user if it doesn't exist
                $user = User::create($userData);
                $this->command->info("Created user: {$email}");
            } else {
                // Don't update password if user exists
                unset($userData['password']);
                $userData['last_active'] = now();

                // Update existing user with new data
                $user->update($userData);
                $this->command->info("Updated user: {$email}");
            }

            // Assign role
            $user->syncRoles([$role]);
            $this->command->info("Assigned role '{$role}' to user: {$email}");
        }
    }
}
