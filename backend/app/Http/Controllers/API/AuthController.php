
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
     * Handle user login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        try {
            $result = $this->authService->login(
                $request->only('email', 'password'),
                $request->remember ?? false
            );
            
            return response()->json($result);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => [$e->getMessage()],
            ]);
        }
    }

    /**
     * Handle user registration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $result = $this->authService->register($request->all());
        
        return response()->json($result, 201);
    }

    /**
     * Get authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $result = $this->authService->getUserData($request->user());
        
        return response()->json($result);
    }

    /**
     * Logout user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendPasswordResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            $message = $this->authService->sendPasswordResetLink($request->email);
            return response()->json(['message' => $message]);
        } catch (\Exception $e) {
            return response()->json(['email' => $e->getMessage()], 400);
        }
    }

    /**
     * Reset the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            $message = $this->authService->resetPassword(
                $request->only('email', 'password', 'password_confirmation', 'token')
            );
            return response()->json(['message' => $message]);
        } catch (\Exception $e) {
            return response()->json(['email' => $e->getMessage()], 400);
        }
    }
}
