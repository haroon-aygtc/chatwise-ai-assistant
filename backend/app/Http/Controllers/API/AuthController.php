<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    /**
     * Create a new controller instance.
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login a user using Laravel Sanctum
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['sometimes', 'string'], // For mobile API access
        ]);

        if (!Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password']
        ], $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $user->update(['last_active' => now()]);

        // Log user login activity
        ActivityLogService::logLogin($user);

        // Load user permissions and roles
        $userData = $user->load('roles');
        $userData->permissions = $user->getAllPermissions();

        // For mobile API access, generate a token if device_name is provided
        if ($request->has('device_name')) {
            $token = $user->createToken($request->device_name)->plainTextToken;
            return response()->json([
                'user' => $userData,
                'token' => $token,
            ]);
        }

        // For SPA (web interface), use session authentication
        return response()->json([
            'user' => $userData,
        ]);
    }

    /**
     * Register a new user
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'device_name' => ['sometimes', 'string'], // For mobile API access
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => 'active',
            'last_active' => now(),
        ]);

        // Assign default role
        $user->assignRole('user');

        // Log user registration activity
        ActivityLogService::logRegistration($user);

        // Auto login
        Auth::login($user);

        // Load user data
        $userData = $user->load('roles');
        $userData->permissions = $user->getAllPermissions();

        // For mobile API access, generate a token if device_name is provided
        if ($request->has('device_name')) {
            $token = $user->createToken($request->device_name)->plainTextToken;
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $userData,
                'token' => $token,
            ], 201);
        }

        // For SPA (web interface), use session authentication
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $userData,
        ], 201);
    }

    /**
     * Logout a user
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $user = Auth::user();

        // Log user logout activity
        if ($user) {
            ActivityLogService::logLogout($user);

            // Revoke token if using token authentication
            if ($request->bearerToken()) {
                $user->currentAccessToken()->delete();
            }

            // Logout from session
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $user->update(['last_active' => now()]);

        // Load roles and permissions
        $user->load('roles');
        $userData = $user->toArray();
        $userData['permissions'] = $user->getAllPermissions();

        return response()->json($userData);
    }

    /**
     * Send password reset link
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendPasswordResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['email' => __($status)], 400);
    }

    /**
     * Reset password
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Log password reset
                ActivityLogService::log('Password Reset', 'User reset their password', $user);
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['email' => __($status)], 400);
    }
}
