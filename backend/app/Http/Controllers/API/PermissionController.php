
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of all permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $permissions = Permission::all();
        
        return response()->json($permissions);
    }

    /**
     * Get permissions grouped by category.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByCategory()
    {
        $permissions = Permission::all();
        
        // Group permissions by category
        $permissionsByCategory = $permissions->groupBy(function ($permission) {
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
        
        return response()->json($permissionsByCategory);
    }
}
