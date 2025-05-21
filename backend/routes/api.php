<?php

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
Route::post('/login', [\App\Http\Controllers\API\AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('/forgot-password', [\App\Http\Controllers\API\AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [\App\Http\Controllers\API\AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // User routes
    Route::get('/user', [\App\Http\Controllers\API\AuthController::class, 'user']);
    Route::post('/logout', [\App\Http\Controllers\API\AuthController::class, 'logout']);
    Route::get('/profile', [\App\Http\Controllers\API\AuthController::class, 'profile']);
    Route::put('/profile', [\App\Http\Controllers\API\AuthController::class, 'updateProfile']);
    Route::put('/password', [\App\Http\Controllers\API\AuthController::class, 'updatePassword']);

    // User management routes
    Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\API\UserController::class, 'store']);
    Route::get('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);
    Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
    Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
    Route::post('/users/{id}/reset-password', [\App\Http\Controllers\API\UserController::class, 'resetPassword']);

    // Role and permission routes
    Route::get('/roles', [\App\Http\Controllers\API\RoleController::class, 'index']);
    Route::post('/roles', [\App\Http\Controllers\API\RoleController::class, 'store']);
    Route::get('/roles/{id}', [\App\Http\Controllers\API\RoleController::class, 'show']);
    Route::put('/roles/{id}', [\App\Http\Controllers\API\RoleController::class, 'update']);
    Route::delete('/roles/{id}', [\App\Http\Controllers\API\RoleController::class, 'destroy']);

    Route::get('/permissions', [\App\Http\Controllers\API\PermissionController::class, 'index']);
    Route::get('/permissions/categories', [\App\Http\Controllers\API\PermissionController::class, 'categories']);

    // Chat routes
    Route::get('/chat/sessions', [\App\Http\Controllers\API\ChatController::class, 'getSessions']);
    Route::post('/chat/sessions', [\App\Http\Controllers\API\ChatController::class, 'createSession']);
    Route::get('/chat/sessions/{id}', [\App\Http\Controllers\API\ChatController::class, 'getSession']);
    Route::put('/chat/sessions/{id}', [\App\Http\Controllers\API\ChatController::class, 'updateSession']);
    Route::delete('/chat/sessions/{id}', [\App\Http\Controllers\API\ChatController::class, 'deleteSession']);
    
    Route::get('/chat/sessions/{sessionId}/messages', [\App\Http\Controllers\API\ChatController::class, 'getMessages']);
    Route::post('/chat/sessions/{sessionId}/messages', [\App\Http\Controllers\API\ChatController::class, 'sendMessage']);
    Route::delete('/chat/sessions/{sessionId}/messages/{messageId}', [\App\Http\Controllers\API\ChatController::class, 'deleteMessage']);

    // AI routes
    Route::get('/ai/models', [\App\Http\Controllers\API\AIModelController::class, 'index']);
    Route::post('/ai/models', [\App\Http\Controllers\API\AIModelController::class, 'store']);
    Route::get('/ai/models/{id}', [\App\Http\Controllers\API\AIModelController::class, 'show']);
    Route::put('/ai/models/{id}', [\App\Http\Controllers\API\AIModelController::class, 'update']);
    Route::delete('/ai/models/{id}', [\App\Http\Controllers\API\AIModelController::class, 'destroy']);
    Route::post('/ai/models/{id}/test', [\App\Http\Controllers\API\AIModelController::class, 'test']);

    Route::get('/ai/providers', [\App\Http\Controllers\API\ModelProviderController::class, 'index']);
    Route::post('/ai/providers', [\App\Http\Controllers\API\ModelProviderController::class, 'store']);
    Route::get('/ai/providers/{id}', [\App\Http\Controllers\API\ModelProviderController::class, 'show']);
    Route::put('/ai/providers/{id}', [\App\Http\Controllers\API\ModelProviderController::class, 'update']);
    Route::delete('/ai/providers/{id}', [\App\Http\Controllers\API\ModelProviderController::class, 'destroy']);

    Route::get('/ai/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'index']);
    Route::post('/ai/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'store']);
    Route::get('/ai/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'show']);
    Route::put('/ai/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'update']);
    Route::delete('/ai/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'destroy']);
    Route::post('/ai/prompt-templates/{id}/test', [\App\Http\Controllers\API\PromptTemplateController::class, 'test']);

    Route::get('/ai/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'index']);
    Route::post('/ai/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'store']);
    Route::get('/ai/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'show']);
    Route::put('/ai/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'update']);
    Route::delete('/ai/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'destroy']);

    Route::get('/ai/system-prompts', [\App\Http\Controllers\API\SystemPromptController::class, 'index']);
    Route::post('/ai/system-prompts', [\App\Http\Controllers\API\SystemPromptController::class, 'store']);
    Route::get('/ai/system-prompts/{id}', [\App\Http\Controllers\API\SystemPromptController::class, 'show']);
    Route::put('/ai/system-prompts/{id}', [\App\Http\Controllers\API\SystemPromptController::class, 'update']);
    Route::delete('/ai/system-prompts/{id}', [\App\Http\Controllers\API\SystemPromptController::class, 'destroy']);

    // Follow-up routes
    Route::get('/ai/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'getSettings']);
    Route::put('/ai/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'updateSettings']);
    Route::get('/ai/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'getSuggestions']);
    Route::post('/ai/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'createSuggestion']);
    Route::put('/ai/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'updateSuggestion']);
    Route::delete('/ai/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'deleteSuggestion']);

    // AI test routes
    Route::post('/ai/test', [\App\Http\Controllers\API\AITestController::class, 'test']);

    // Widget routes
    Route::get('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'index']);
    Route::post('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'store']);
    Route::get('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'show']);
    Route::put('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'update']);
    Route::delete('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'destroy']);
    Route::post('/widgets/{id}/test', [\App\Http\Controllers\API\WidgetController::class, 'test']);

    // Settings routes
    Route::get('/settings', [\App\Http\Controllers\API\SettingsController::class, 'index']);
    Route::put('/settings', [\App\Http\Controllers\API\SettingsController::class, 'update']);
    Route::get('/settings/{key}', [\App\Http\Controllers\API\SettingsController::class, 'show']);
    Route::put('/settings/{key}', [\App\Http\Controllers\API\SettingsController::class, 'updateSingle']);

    // Activity log routes
    Route::get('/activity-logs', [\App\Http\Controllers\API\ActivityLogController::class, 'index']);
    Route::get('/activity-logs/{id}', [\App\Http\Controllers\API\ActivityLogController::class, 'show']);

    // Knowledge Base routes
    Route::prefix('knowledge-base')->group(function () {
        // Data Sources
        Route::get('/data-sources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllDataSources']);
        Route::get('/data-sources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDataSourceById']);
        Route::post('/data-sources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createDataSource']);
        Route::put('/data-sources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDataSource']);
        Route::delete('/data-sources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteDataSource']);
        Route::post('/data-sources/{id}/test', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'testDataSource']);
        Route::get('/data-sources/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDataSourceSettings']);
        Route::put('/data-sources/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDataSourceSettings']);
        
        // Categories
        Route::get('/categories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCategories']);
        Route::post('/categories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createCategory']);
        Route::get('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCategory']);
        Route::put('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteCategory']);

        // Documents
        Route::get('/documents', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDocuments']);
        Route::post('/documents', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createDocument']);
        Route::get('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDocument']);
        Route::put('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteDocument']);

        // Resources
        Route::get('/resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getResources']);
        Route::post('/resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createResource']);
        Route::get('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getResource']);
        Route::put('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateResource']);
        Route::delete('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteResource']);
        Route::post('/resources/search', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'searchResources']);

        // Files
        Route::post('/files', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'uploadFile']);
        Route::get('/files/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getFile']);
        Route::put('/files/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateFile']);
        Route::delete('/files/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteFile']);
        Route::get('/files/{id}/download', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'downloadFile']);

        // Directories
        Route::get('/directories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDirectories']);
        Route::post('/directories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createDirectory']);
        Route::get('/directories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDirectory']);
        Route::put('/directories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDirectory']);
        Route::delete('/directories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteDirectory']);

        // Web Resources
        Route::get('/web-resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getWebResources']);
        Route::post('/web-resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createWebResource']);
        Route::get('/web-resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getWebResource']);
        Route::put('/web-resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateWebResource']);
        Route::delete('/web-resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteWebResource']);

        // Collections
        Route::get('/collections', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCollections']);
        Route::post('/collections', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createCollection']);
        Route::get('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCollection']);
        Route::put('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateCollection']);
        Route::delete('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteCollection']);

        // Knowledge Profiles
        Route::get('/profiles', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getProfiles']);
        Route::post('/profiles', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createProfile']);
        Route::get('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getProfile']);
        Route::put('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateProfile']);
        Route::delete('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteProfile']);

        // Context Scopes
        Route::get('/context-scopes', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getContextScopes']);
        Route::post('/context-scopes', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createContextScope']);
        Route::get('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getContextScope']);
        Route::put('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateContextScope']);
        Route::delete('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteContextScope']);

        // Settings
        Route::get('/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getSettings']);
        Route::put('/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateSettings']);
    });
});
