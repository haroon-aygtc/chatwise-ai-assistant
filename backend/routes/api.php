<?php

use App\Http\Controllers\API\ActivityLogController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FollowUpController;
use App\Http\Controllers\API\KnowledgeBaseController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\PromptTemplateController;
use App\Http\Controllers\API\ResponseFormatController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
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

    // Knowledge Base routes
    Route::prefix('knowledge-base')->group(function () {
        // Documents
        Route::get('/documents', [KnowledgeBaseController::class, 'getAllDocuments']);
        Route::get('/documents/{id}', [KnowledgeBaseController::class, 'getDocumentById']);
        Route::post('/documents', [KnowledgeBaseController::class, 'createDocument']);
        Route::post('/documents/upload', [KnowledgeBaseController::class, 'createDocument']);
        Route::put('/documents/{id}', [KnowledgeBaseController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [KnowledgeBaseController::class, 'deleteDocument']);
        Route::get('/documents/search', [KnowledgeBaseController::class, 'searchDocuments']);

        // Categories
        Route::get('/categories', [KnowledgeBaseController::class, 'getAllCategories']);
        Route::get('/categories/{id}', [KnowledgeBaseController::class, 'getCategoryById']);
        Route::post('/categories', [KnowledgeBaseController::class, 'createCategory']);
        Route::put('/categories/{id}', [KnowledgeBaseController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [KnowledgeBaseController::class, 'deleteCategory']);

        // Settings
        Route::get('/settings', [KnowledgeBaseController::class, 'getSettings']);
        Route::put('/settings', [KnowledgeBaseController::class, 'updateSettings']);
    });

    // Prompt Templates routes
    Route::prefix('prompt-templates')->group(function () {
        Route::get('/', [PromptTemplateController::class, 'index']);
        Route::post('/', [PromptTemplateController::class, 'store']);
        Route::get('/{id}', [PromptTemplateController::class, 'show']);
        Route::put('/{id}', [PromptTemplateController::class, 'update']);
        Route::delete('/{id}', [PromptTemplateController::class, 'destroy']);
        Route::get('/categories/list', [PromptTemplateController::class, 'getCategories']);
        Route::post('/{id}/increment-usage', [PromptTemplateController::class, 'incrementUsage']);
    });

    // Response Format routes
    Route::prefix('response-formats')->group(function () {
        Route::get('/', [ResponseFormatController::class, 'index']);
        Route::post('/', [ResponseFormatController::class, 'store']);
        Route::get('/{id}', [ResponseFormatController::class, 'show']);
        Route::put('/{id}', [ResponseFormatController::class, 'update']);
        Route::delete('/{id}', [ResponseFormatController::class, 'destroy']);
        Route::get('/default', [ResponseFormatController::class, 'getDefault']);
        Route::post('/{id}/set-default', [ResponseFormatController::class, 'setDefault']);
    });

    // Follow-Up Suggestions routes
    Route::prefix('follow-up-suggestions')->group(function () {
        Route::get('/', [FollowUpController::class, 'getAllSuggestions']);
        Route::post('/', [FollowUpController::class, 'createSuggestion']);
        Route::get('/{id}', [FollowUpController::class, 'getSuggestionById']);
        Route::put('/{id}', [FollowUpController::class, 'updateSuggestion']);
        Route::delete('/{id}', [FollowUpController::class, 'deleteSuggestion']);
        Route::post('/reorder', [FollowUpController::class, 'reorderSuggestions']);
        Route::post('/{id}/move-up', [FollowUpController::class, 'moveSuggestionUp']);
        Route::post('/{id}/move-down', [FollowUpController::class, 'moveSuggestionDown']);
        Route::get('/settings', [FollowUpController::class, 'getSettings']);
        Route::put('/settings', [FollowUpController::class, 'updateSettings']);
        Route::post('/test', [FollowUpController::class, 'testSuggestions']);
    });
});