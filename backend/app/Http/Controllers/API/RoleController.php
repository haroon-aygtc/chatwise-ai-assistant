<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();

        // Add user count to each role
        $roles = $roles->map(function ($role) {
            $role->userCount = $role->users()->count();
            return $role;
        });

        return response()->json($roles);
    }

    /**
     * Store a newly created role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles'],
            'description' => ['nullable', 'string'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        // Add description as a custom attribute
        if (isset($validated['description'])) {
            $role->description = $validated['description'];
            $role->save();
        }

        // Assign permissions if provided
        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        // Log activity
        ActivityLogService::logRoleCreated($role->name);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions'),
        ], 201);
    }

    /**
     * Display the specified role.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Role $role)
    {
        $role->load('permissions');
        $role->userCount = $role->users()->count();

        return response()->json($role);
    }

    /**
     * Update the specified role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Role $role)
    {
        // Check if this is a system role
        $systemRoles = ['admin', 'user'];
        if (in_array($role->name, $systemRoles) && $request->has('name')) {
            return response()->json([
                'message' => 'Cannot rename system roles'
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255', 'unique:roles,name,'.$role->id],
            'description' => ['nullable', 'string'],
        ]);

        if (isset($validated['name'])) {
            $role->name = $validated['name'];
        }

        if (isset($validated['description'])) {
            $role->description = $validated['description'];
        }

        $role->save();

        // Log activity
        ActivityLogService::logRoleUpdated($role->name);

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->fresh()->load('permissions'),
        ]);
    }

    /**
     * Remove the specified role.
     *
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Role $role)
    {
        // Prevent deleting system roles
        $systemRoles = ['admin', 'user'];
        if (in_array($role->name, $systemRoles)) {
            return response()->json([
                'message' => 'Cannot delete system roles'
            ], 403);
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete role with assigned users. Please reassign users first.'
            ], 409);
        }

        $roleName = $role->name;
        $role->delete();

        // Log activity
        ActivityLogService::logRoleDeleted($roleName);

        return response()->json([
            'message' => 'Role deleted successfully'
        ]);
    }

    /**
     * Update role permissions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Spatie\Permission\Models\Role  $role
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $role->syncPermissions($validated['permissions']);

        // Log activity
        ActivityLogService::logPermissionsUpdated($role->name);

        return response()->json([
            'message' => 'Role permissions updated successfully',
            'role' => $role->fresh()->load('permissions'),
        ]);
    }
}
