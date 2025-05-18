<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Authenticate a user and generate token
     *
     * @param array $credentials
     * @param bool $remember
     * @return array
     */
    public function login(array $credentials, bool $remember = false): array
    {
        if (!Auth::attempt($credentials, $remember)) {
            throw new \Exception('The provided credentials are incorrect.');
        }

        $user = Auth::user();

        // Update last active timestamp
        $user->last_active = now();
        $user->save();

        // Get roles and permissions
        $roles = $user->roles->pluck('name');
        $permissions = $user->getAllPermissions()->pluck('name');

        // Create token with abilities based on permissions
        $token = $user->createToken('auth-token', $permissions->toArray())->plainTextToken;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'avatar_url' => $user->avatar_url,
                'last_active' => $user->last_active,
                'roles' => $roles,
                'permissions' => $permissions,
            ],
            'token' => $token,
        ];
    }

    /**
     * Register a new user
     *
     * @param array $userData
     * @return array
     */
    public function register(array $userData): array
    {
        // Create user
        $user = User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
            'status' => 'active',
            'last_active' => now(),
        ]);

        // Assign default role
        $user->assignRole('user');

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
            ],
            'token' => $token,
        ];
    }

    /**
     * Get authenticated user data
     *
     * @param User $user
     * @return array
     */
    public function getUserData(User $user): array
    {
        // Update last active timestamp
        $user->last_active = now();
        $user->save();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'avatar_url' => $user->avatar_url,
                'last_active' => $user->last_active,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ];
    }

    /**
     * Send password reset link
     *
     * @param string $email
     * @return string Status message
     */
    public function sendPasswordResetLink(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw new \Exception(__($status));
        }

        return __($status);
    }

    /**
     * Reset user password
     *
     * @param array $data
     * @return string Status message
     */
    public function resetPassword(array $data): string
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw new \Exception(__($status));
        }

        return __($status);
    }

    /**
     * Logout by removing the current token
     *
     * @param User $user
     * @return void
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }
}
