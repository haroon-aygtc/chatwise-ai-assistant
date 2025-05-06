<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Log a user activity
     *
     * @param string $action
     * @param string $description
     * @param \App\Models\User|null $user
     * @return \App\Models\ActivityLog
     */
    public static function log($action, $description, User $user = null)
    {
        return ActivityLog::log($action, $description, $user);
    }

    /**
     * Log a user login
     *
     * @param \App\Models\User $user
     * @return \App\Models\ActivityLog
     */
    public static function logLogin(User $user)
    {
        return self::log('User Login', 'User logged in successfully', $user);
    }

    /**
     * Log a user logout
     *
     * @param \App\Models\User $user
     * @return \App\Models\ActivityLog
     */
    public static function logLogout(User $user)
    {
        return self::log('User Logout', 'User logged out', $user);
    }

    /**
     * Log a user registration
     *
     * @param \App\Models\User $user
     * @return \App\Models\ActivityLog
     */
    public static function logRegistration(User $user)
    {
        return self::log('User Registration', 'New user account created', $user);
    }

    /**
     * Log a user update
     *
     * @param \App\Models\User $user
     * @param string $details
     * @return \App\Models\ActivityLog
     */
    public static function logUserUpdate(User $user, $details = '')
    {
        $actor = Auth::user();
        $description = ($actor && $actor->id !== $user->id)
            ? "Admin updated user: {$user->email}"
            : "User updated their profile";

        if ($details) {
            $description .= " - $details";
        }

        return self::log('User Update', $description, $actor);
    }

    /**
     * Log a role creation
     *
     * @param string $roleName
     * @return \App\Models\ActivityLog
     */
    public static function logRoleCreated($roleName)
    {
        return self::log('Role Created', "Created new role: {$roleName}");
    }

    /**
     * Log a role update
     *
     * @param string $roleName
     * @return \App\Models\ActivityLog
     */
    public static function logRoleUpdated($roleName)
    {
        return self::log('Role Updated', "Updated role: {$roleName}");
    }

    /**
     * Log a role deletion
     *
     * @param string $roleName
     * @return \App\Models\ActivityLog
     */
    public static function logRoleDeleted($roleName)
    {
        return self::log('Role Deleted', "Deleted role: {$roleName}");
    }

    /**
     * Log permissions update
     *
     * @param string $roleName
     * @return \App\Models\ActivityLog
     */
    public static function logPermissionsUpdated($roleName)
    {
        return self::log('Permissions Updated', "Updated permissions for role: {$roleName}");
    }

    /**
     * Log role assignment
     *
     * @param \App\Models\User $user
     * @param array $roles
     * @return \App\Models\ActivityLog
     */
    public static function logRoleAssignment(User $user, array $roles)
    {
        $rolesStr = implode(', ', $roles);
        return self::log('Role Assignment', "Assigned roles [{$rolesStr}] to user: {$user->email}");
    }
}