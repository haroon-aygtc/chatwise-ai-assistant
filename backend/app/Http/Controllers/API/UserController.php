<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role if provided
        if ($request->has('role')) {
            $query->role($request->role);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->with('roles')->paginate($request->per_page ?? 15);

        return response()->json($users);
    }

    /**
     * Store a newly created user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Rules\Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
            'status' => ['nullable', 'string', 'in:active,inactive,pending,suspended'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'] ?? 'active',
            'last_active' => now(),
        ]);

        // Assign role
        $user->assignRole($validated['role']);

        // Log activity
        ActivityLogService::log('User Created', "Created new user: {$user->email} with role {$validated['role']}");

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('roles'),
        ], 201);
    }

    /**
     * Display the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        // Load roles and direct permissions
        $user->load('roles', 'permissions');

        $userData = $user->toArray();
        $userData['permissions'] = $user->getAllPermissions()->pluck('name');

        return response()->json($userData);
    }

    /**
     * Update the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'status' => ['nullable', 'string', 'in:active,inactive,pending,suspended'],
            'avatar_url' => ['nullable', 'string', 'url'],
            'password' => ['nullable', Rules\Password::defaults()],
        ]);

        // Only update provided fields
        $updateData = array_filter($validated, function ($value) {
            return $value !== null;
        });

        // Hash password if provided
        if (isset($updateData['password'])) {
            $updateData['password'] = Hash::make($updateData['password']);
        }

        $user->update($updateData);

        // Log activity
        ActivityLogService::logUserUpdate($user, implode(', ', array_keys($updateData)));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Remove the specified user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        // Log before deletion to capture the user email
        ActivityLogService::log('User Deleted', "Deleted user: {$user->email}");

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Update user status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:active,inactive,pending,suspended'],
        ]);

        // Prevent changing your own status
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot change your own status'
            ], 403);
        }

        $oldStatus = $user->status;
        $user->update([
            'status' => $validated['status']
        ]);

        // Log activity
        ActivityLogService::log('User Status Changed', "Changed user {$user->email} status from {$oldStatus} to {$validated['status']}");

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Assign roles to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function assignRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ]);

        // If you're modifying your own roles
        if ($user->id === auth()->id() && !auth()->user()->hasRole('admin')) {
            return response()->json([
                'message' => 'You cannot modify your own roles unless you are an admin'
            ], 403);
        }

        // Get current roles for logging
        $oldRoles = $user->getRoleNames()->toArray();

        // Sync roles
        $user->syncRoles($validated['roles']);

        // Log activity
        ActivityLogService::logRoleAssignment($user, $validated['roles']);

        return response()->json([
            'message' => 'User roles updated successfully',
            'user' => $user->load('roles'),
        ]);
    }
}
