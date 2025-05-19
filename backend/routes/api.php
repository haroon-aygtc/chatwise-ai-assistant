<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AIModelController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\FollowUpController;
use App\Http\Controllers\API\KnowledgeBaseController;
use App\Http\Controllers\API\ModelProviderController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\PromptTemplateController;
use App\Http\Controllers\API\ResponseFormatController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\SettingsController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\WidgetController;

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
Route::post('/password/reset-request', [AuthController::class, 'resetPasswordRequest']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// AI Models - public endpoints
Route::get('/ai/models/public', [AIModelController::class, 'getPublicModels']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/check-auth', [AuthController::class, 'checkAuth']);

    // AI Models
    Route::prefix('ai')->group(function () {
        // Models
        Route::get('/models', [AIModelController::class, 'index']);
        Route::get('/models/provider/{provider}', [AIModelController::class, 'getByProvider']);
        Route::get('/models/{id}', [AIModelController::class, 'show']);
        Route::post('/models', [AIModelController::class, 'store']);
        Route::put('/models/{id}', [AIModelController::class, 'update']);
        Route::delete('/models/{id}', [AIModelController::class, 'destroy']);
        Route::post('/models/{id}/default', [AIModelController::class, 'setDefault']);
        Route::post('/models/{id}/test', [AIModelController::class, 'testModel']);
        Route::post('/models/test-configuration', [AIModelController::class, 'testConfiguration']);

        // Providers
        Route::get('/providers', [ModelProviderController::class, 'index']);
        Route::get('/providers/{id}', [ModelProviderController::class, 'show']);
        Route::get('/providers/{id}/models', [ModelProviderController::class, 'getModels']);
        Route::post('/providers', [ModelProviderController::class, 'store']);
        Route::put('/providers/{id}', [ModelProviderController::class, 'update']);
        Route::delete('/providers/{id}', [ModelProviderController::class, 'destroy']);
        Route::post('/providers/validate-key', [ModelProviderController::class, 'validateApiKey']);

        // Routing rules
        Route::get('/routing-rules', [AIModelController::class, 'getRoutingRules']);
        Route::post('/routing-rules', [AIModelController::class, 'createRoutingRule']);
        Route::put('/routing-rules/{id}', [AIModelController::class, 'updateRoutingRule']);
        Route::delete('/routing-rules/{id}', [AIModelController::class, 'deleteRoutingRule']);

        // Prompt templates
        Route::get('/prompt-templates', [PromptTemplateController::class, 'index']);
        Route::get('/prompt-templates/{id}', [PromptTemplateController::class, 'show']);
        Route::post('/prompt-templates', [PromptTemplateController::class, 'store']);
        Route::put('/prompt-templates/{id}', [PromptTemplateController::class, 'update']);
        Route::delete('/prompt-templates/{id}', [PromptTemplateController::class, 'destroy']);
        Route::get('/prompt-templates/categories', [PromptTemplateController::class, 'getCategories']);

        // Response formats
        Route::get('/response-formats', [ResponseFormatController::class, 'index']);
        Route::get('/response-formats/{id}', [ResponseFormatController::class, 'show']);
        Route::post('/response-formats', [ResponseFormatController::class, 'store']);
        Route::put('/response-formats/{id}', [ResponseFormatController::class, 'update']);
        Route::delete('/response-formats/{id}', [ResponseFormatController::class, 'destroy']);
    });

    // Chat
    Route::prefix('chat')->group(function () {
        Route::get('/sessions', [ChatController::class, 'getSessions']);
        Route::get('/sessions/{id}', [ChatController::class, 'getSession']);
        Route::post('/sessions', [ChatController::class, 'createSession']);
        Route::put('/sessions/{id}', [ChatController::class, 'updateSession']);
        Route::delete('/sessions/{id}', [ChatController::class, 'deleteSession']);

        Route::get('/sessions/{sessionId}/messages', [ChatController::class, 'getMessages']);
        Route::post('/sessions/{sessionId}/messages', [ChatController::class, 'sendMessage']);
    });

    // Follow-up suggestions
    Route::prefix('follow-up')->group(function () {
        Route::get('/settings', [FollowUpController::class, 'getSettings']);
        Route::put('/settings', [FollowUpController::class, 'updateSettings']);
        Route::get('/suggestions', [FollowUpController::class, 'getSuggestions']);
        Route::post('/suggestions', [FollowUpController::class, 'createSuggestion']);
        Route::put('/suggestions/{id}', [FollowUpController::class, 'updateSuggestion']);
        Route::delete('/suggestions/{id}', [FollowUpController::class, 'deleteSuggestion']);
        Route::put('/suggestions/reorder', [FollowUpController::class, 'reorderSuggestions']);
        Route::get('/categories', [FollowUpController::class, 'getCategories']);
    });

    // Knowledge base
    Route::prefix('knowledge-base')->group(function () {
        Route::get('/categories', [KnowledgeBaseController::class, 'getCategories']);
        Route::post('/categories', [KnowledgeBaseController::class, 'createCategory']);
        Route::put('/categories/{id}', [KnowledgeBaseController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [KnowledgeBaseController::class, 'deleteCategory']);

        Route::get('/documents', [KnowledgeBaseController::class, 'getDocuments']);
        Route::get('/documents/{id}', [KnowledgeBaseController::class, 'getDocument']);
        Route::post('/documents', [KnowledgeBaseController::class, 'createDocument']);
        Route::post('/documents/upload', [KnowledgeBaseController::class, 'uploadDocument']);
        Route::put('/documents/{id}', [KnowledgeBaseController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [KnowledgeBaseController::class, 'deleteDocument']);
    });

    // User management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::get('/{id}/roles', [UserController::class, 'getRoles']);
        Route::post('/{id}/roles', [UserController::class, 'assignRoles']);
        Route::get('/{id}/permissions', [UserController::class, 'getPermissions']);
    });

    // Roles and permissions
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
        Route::get('/{id}/permissions', [RoleController::class, 'getPermissions']);
        Route::post('/{id}/permissions', [RoleController::class, 'assignPermissions']);
    });

    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/categories', [PermissionController::class, 'getCategories']);

    // Settings
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::get('/{key}', [SettingsController::class, 'get']);
        Route::put('/{key}', [SettingsController::class, 'set']);
    });

    // Widget
    Route::prefix('widgets')->group(function () {
        Route::get('/', [WidgetController::class, 'index']);
        Route::get('/{id}', [WidgetController::class, 'show']);
        Route::post('/', [WidgetController::class, 'store']);
        Route::put('/{id}', [WidgetController::class, 'update']);
        Route::delete('/{id}', [WidgetController::class, 'destroy']);
        Route::get('/{id}/settings', [WidgetController::class, 'getSettings']);
        Route::put('/{id}/settings', [WidgetController::class, 'updateSettings']);
        Route::post('/{id}/test', [WidgetController::class, 'testWidget']);
    });
});

// Widget public endpoints
Route::prefix('widget')->group(function () {
    Route::get('/{id}', [WidgetController::class, 'getPublicWidget']);
    Route::post('/{id}/chat', [WidgetController::class, 'chat']);
});
