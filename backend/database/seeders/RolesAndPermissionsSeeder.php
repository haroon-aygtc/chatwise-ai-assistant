
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
        // User management permissions
        Permission::create(['name' => 'view users', 'guard_name' => 'web']);
        Permission::create(['name' => 'create users', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit users', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete users', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage users', 'guard_name' => 'web']);
        
        // Role management permissions
        Permission::create(['name' => 'view roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'create roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'delete roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage roles', 'guard_name' => 'web']);
        
        // Permission management
        Permission::create(['name' => 'view permissions', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage permissions', 'guard_name' => 'web']);
        
        // Activity Log
        Permission::create(['name' => 'view activity log', 'guard_name' => 'web']);
        
        // System settings
        Permission::create(['name' => 'view settings', 'guard_name' => 'web']);
        Permission::create(['name' => 'edit settings', 'guard_name' => 'web']);
    }

    /**
     * Create roles and assign permissions
     */
    private function createRoles(): void
    {
        // Create Admin role and assign all permissions
        $adminRole = Role::create([
            'name' => 'admin', 
            'guard_name' => 'web',
            'description' => 'Administrator with full system access',
        ]);
        $adminRole->givePermissionTo(Permission::all());

        // Create Manager role with selected permissions
        $managerRole = Role::create([
            'name' => 'manager', 
            'guard_name' => 'web',
            'description' => 'Manager with limited administrative access',
        ]);
        $managerRole->givePermissionTo([
            'view users', 'create users', 'edit users',
            'view roles', 
            'view permissions',
            'view activity log',
            'view settings',
        ]);

        // Create Editor role with minimal permissions
        $editorRole = Role::create([
            'name' => 'editor', 
            'guard_name' => 'web',
            'description' => 'Editor with content management access',
        ]);
        $editorRole->givePermissionTo([
            'view users',
            'view activity log',
        ]);

        // Create basic User role
        $userRole = Role::create([
            'name' => 'user', 
            'guard_name' => 'web',
            'description' => 'Regular user with basic access',
        ]);
        // No specific permissions for basic users
    }

    /**
     * Create test users
     */
    private function createUsers(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'last_active' => now(),
        ]);
        $admin->assignRole('admin');

        // Create manager user
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'last_active' => now(),
        ]);
        $manager->assignRole('manager');

        // Create editor user
        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'last_active' => now(),
        ]);
        $editor->assignRole('editor');

        // Create regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'last_active' => now(),
        ]);
        $user->assignRole('user');
    }
}
