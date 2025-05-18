<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Authenticate a user
     *
     * @param array $credentials
     * @param bool $remember
     * @param string|null $deviceName For mobile API access
     * @return array
     * @throws ValidationException
     */
    public function login(array $credentials, bool $remember = false, ?string $deviceName = null): array
    {
        if (!Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        // Update last active timestamp
        $user->last_active = now();
        $user->save();

        // Get roles and permissions
        $user->load('roles');
        $permissions = $user->getAllPermissions();

        // Prepare user data
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'avatar_url' => $user->avatar_url,
            'last_active' => $user->last_active,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $permissions,
        ];

        // If device name is provided (mobile API access), return token
        if ($deviceName) {
            $token = $user->createToken($deviceName, $permissions->toArray())->plainTextToken;
            return [
                'user' => $userData,
                'token' => $token,
            ];
        }

        // For SPA, no token needed (using session)
        return [
            'user' => $userData,
        ];
    }

    /**
     * Register a new user
     *
     * @param array $userData
     * @param string|null $deviceName For mobile API access
     * @return array
     */
    public function register(array $userData, ?string $deviceName = null): array
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

        // Auto login user for session
        Auth::login($user);

        // Load roles and permissions
        $user->load('roles');
        $permissions = $user->getAllPermissions();

        // Prepare user data
        $responseData = [
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'avatar_url' => $user->avatar_url,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $permissions,
            ],
        ];

        // If device name is provided (mobile API access), include token
        if ($deviceName) {
            $responseData['token'] = $user->createToken($deviceName)->plainTextToken;
        }

        return $responseData;
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

        // Load roles and permissions
        $user->load('roles');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'avatar_url' => $user->avatar_url,
            'last_active' => $user->last_active,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions(),
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
     * Logout user
     *
     * @param User $user
     * @param bool $isTokenBased
     * @return void
     */
    public function logout(User $user, bool $isTokenBased = false): void
    {
        // For token-based authentication (mobile)
        if ($isTokenBased && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        // For session-based authentication (SPA), the controller handles session invalidation
    }
}
