
<?php

use App\Http\Controllers\API\ActivityLogController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/password/reset-request', [AuthController::class, 'sendPasswordResetLink']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User management routes
    Route::middleware(['can:manage users'])->group(function () {
        Route::apiResource('users', UserController::class);
        Route::put('/users/{user}/status', [UserController::class, 'updateStatus']);
        Route::put('/users/{user}/assign-roles', [UserController::class, 'assignRoles']);
    });
    
    // Role management routes
    Route::middleware(['can:manage roles'])->group(function () {
        Route::apiResource('roles', RoleController::class);
        Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);
    });
    
    // Permission routes
    Route::middleware(['can:manage permissions'])->group(function () {
        Route::get('/permissions', [PermissionController::class, 'index']);
        Route::get('/permissions/categories', [PermissionController::class, 'getByCategory']);
    });
    
    // Activity log routes
    Route::middleware(['can:view activity log'])->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/types', [ActivityLogController::class, 'getActionTypes']);
        Route::get('/activity-logs/export', [ActivityLogController::class, 'export']);
    });
});
