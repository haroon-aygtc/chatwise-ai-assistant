<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;

class PermissionService
{
    /**
     * Get all permissions
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPermissions()
    {
        return Permission::all();
    }

    /**
     * Get permissions grouped by category
     *
     * @return \Illuminate\Support\Collection
     */
    public function getPermissionsByCategory()
    {
        $permissions = Permission::all();

        // Group permissions by category
        return $permissions->groupBy(function ($permission) {
            // Extract category from permission name
            // Format: 'create users' -> category is 'users'
            // Format: 'view dashboard' -> category is 'dashboard'
            $parts = explode(' ', $permission->name);
            if (count($parts) > 1) {
                return ucfirst($parts[1]); // Get second part and capitalize
            }
            return 'General';
        })->map(function ($permissions, $category) {
            return [
                'category' => $category,
                'permissions' => $permissions->values(),
            ];
        })->values();
    }
}
