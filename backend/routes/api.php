<?php

use App\Http\Controllers\API\AIModelController;
use App\Http\Controllers\API\ModelProviderController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FollowUpController;
use App\Http\Controllers\API\PromptTemplateController;
use App\Http\Controllers\API\RoutingRuleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


// Example protected route
// Route::middleware('auth:sanctum')->get('/protected', [ExampleController::class, 'protected']);

// Route::apiResource('products', ProductController::class);

// Route::group(['middleware' => ['auth:sanctum']], function () {
//     // All secure URL's
//     Route::get('profile', function(Request $request) {
//         return auth()->user();
//     });

//     // Refresh token
//     Route::get('refresh', [AuthController::class, 'refresh']);

//     // Logout
//     Route::post('logout', [AuthController::class, 'logout']);
// });

// Role and Permission routes
// Route::middleware(['auth:api', 'role:admin'])->group(function () {
//     // Roles
//     Route::get('/roles', [RoleController::class, 'index']);
//     Route::get('/roles/{role}', [RoleController::class, 'show']);
//     Route::post('/roles', [RoleController::class, 'store']);
//     Route::put('/roles/{role}', [RoleController::class, 'update']);
//     Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
//     Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);

//     // Permissions
//     Route::get('/permissions', [PermissionController::class, 'index']);
//     Route::get('/permissions/categories', [PermissionController::class, 'getByCategory']);
// });

// AI Model routes - "AI Configuration"
// Route::prefix('ai')->group(function () {
//     // Public endpoints (no auth required)
//     Route::get('/models/public', [AIModelController::class, 'getPublicModels']);

//     // Auth required endpoints
//     Route::middleware(['auth:api'])->group(function () {
//         // AI Models
//         Route::get('/models', [AIModelController::class, 'index']);
//         Route::get('/models/{id}', [AIModelController::class, 'show']);
//         Route::post('/models', [AIModelController::class, 'store'])->middleware('permission:manage models');
//         Route::put('/models/{id}', [AIModelController::class, 'update'])->middleware('permission:manage models');
//         Route::delete('/models/{id}', [AIModelController::class, 'destroy'])->middleware('permission:manage models');
//         Route::post('/models/{id}/default', [AIModelController::class, 'setDefault'])->middleware('permission:manage models');
//         Route::post('/models/{id}/test', [AIModelController::class, 'testModel']);

//         // Model Providers
//         Route::get('/providers', [ModelProviderController::class, 'index']);
//         Route::get('/providers/{id}', [ModelProviderController::class, 'show']);
//         Route::post('/providers', [ModelProviderController::class, 'store'])->middleware('permission:manage models');
//         Route::put('/providers/{id}', [ModelProviderController::class, 'update'])->middleware('permission:manage models');
//         Route::delete('/providers/{id}', [ModelProviderController::class, 'destroy'])->middleware('permission:manage models');
//     });

//     // Follow-up suggestions
//     Route::get('/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'getSettings']);
//     Route::put('/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'updateSettings']);
//     Route::get('/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'getSuggestions']);
//     Route::post('/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'createSuggestion']);
//     Route::put('/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'updateSuggestion']);
//     Route::delete('/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'deleteSuggestion']);
//     Route::put('/follow-up/suggestions/reorder', [\App\Http\Controllers\API\FollowUpController::class, 'reorderSuggestions']);
//     Route::get('/follow-up/categories', [\App\Http\Controllers\API\FollowUpController::class, 'getCategories']);

//     // System prompt
//     // Route::get('/ai-configuration/system-prompt', [\App\Http\Controllers\API\AIConfigurationController::class, 'getSystemPrompt']);
//     // Route::put('/ai-configuration/system-prompt', [\App\Http\Controllers\API\AIConfigurationController::class, 'updateSystemPrompt']);

//     // Prompt templates
//     Route::get('/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'index']);
//     Route::get('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'show']);
//     Route::post('/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'store']);
//     Route::put('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'update']);
//     Route::delete('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'destroy']);
//     Route::get('/prompt-templates/categories/list', [\App\Http\Controllers\API\PromptTemplateController::class, 'getCategories']);
//     Route::post('/prompt-templates/{id}/increment-usage', [\App\Http\Controllers\API\PromptTemplateController::class, 'incrementUsage']);

//      // Response formats
//     Route::get('/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'index']);
//     Route::get('/response-formats/default', [\App\Http\Controllers\API\ResponseFormatController::class, 'getDefault']);
//     Route::get('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'show']);
//     Route::post('/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'store']);
//     Route::put('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'update']);
//     Route::delete('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'destroy']);
//     Route::post('/response-formats/{id}/set-default', [\App\Http\Controllers\API\ResponseFormatController::class, 'setDefault']);
//     Route::post('/response-formats/{id}/test', [\App\Http\Controllers\API\ResponseFormatController::class, 'test']);

//     // Widgets
//     Route::get('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'index']);
//     Route::get('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'show']);
//     Route::post('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'store']);
//     Route::put('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'update']);
//     Route::delete('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'destroy']);
//     Route::get('/widgets/{id}/analytics', [\App\Http\Controllers\API\WidgetController::class, 'getAnalytics']);

//     //settings
//     Route::get('/get-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'getAppSettings']);
//     Route::put('/update-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateAppSettings']);
//     Route::get('/get-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'getUserSettings']);
//     Route::post('/update-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateUserSettings']);
//     Route::put('/reset-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'resetUserSettings']);


//     // Widget Settings
//     // Route::get('/widget-settings', [\App\Http\Controllers\API\WidgetSettingController::class, 'index']);
//     // Route::get('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'show']);
//     // Route::post('/widget-settings', [\App\Http\Controllers\API\WidgetSettingController::class, 'store']);
//     // Route::put('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'update']);
//     // Route::delete('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'destroy']);

//     // User Settings
//     Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
//     Route::get('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);
//     Route::post('/users', [\App\Http\Controllers\API\UserController::class, 'store']);
//     Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
//     Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
//     Route::put('/users/{id}/status', [\App\Http\Controllers\API\UserController::class, 'updateStatus']);
//     Route::put('/users/{id}/assign-roles', [\App\Http\Controllers\API\UserController::class, 'assignRoles']);


// });

//testapi
Route::get('/users-all', [\App\Http\Controllers\API\UserController::class, 'getAllUsers']); // Test API

// Public AI routes
Route::prefix('ai')->group(function() {
    Route::get('/models/public', [AIModelController::class, 'getPublicModels']);
    // Add this temporary route for debugging
    Route::get('/models', [AIModelController::class, 'index']);
    // Add providers public endpoint for debugging
    Route::get('/providers', [ModelProviderController::class, 'index']);
    // Add routing-rules public endpoint
    Route::get('/routing-rules', function() {
        return response()->json(['data' => []]); // Empty array for now
    });
});

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Get authenticated user
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

Route::middleware('auth:sanctum')->group(function () {

    // User Settings
    Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
    Route::get('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);
    Route::post('/users', [\App\Http\Controllers\API\UserController::class, 'store']);
    Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
    Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
    Route::put('/users/{id}/status', [\App\Http\Controllers\API\UserController::class, 'updateStatus']);
    Route::put('/users/{id}/assign-roles', [\App\Http\Controllers\API\UserController::class, 'assignRoles']);
    Route::get('/users/{id}/permissions', [\App\Http\Controllers\API\UserController::class, 'getUserPermissions']);
    Route::put('/users/{id}/permissions', [\App\Http\Controllers\API\UserController::class, 'updateUserPermissions']);
    Route::post('/users/{user}/reset-password', [\App\Http\Controllers\API\UserController::class, 'resetPassword']);

    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/categories', [PermissionController::class, 'getByCategory']);

    // Knowledge Base routes
    Route::prefix('knowledge-base')->group(function () {
        // Resources
        Route::get('/resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllResources']);
        Route::get('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getResourceById']);
        Route::post('/resources', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createResource']);
        Route::put('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateResource']);
        Route::delete('/resources/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteResource']);
        Route::post('/resources/search', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'searchResources']);

        // File resources
        Route::post('/resources/files/upload', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'uploadFile']);
        Route::put('/resources/files/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateFileResource']);
        Route::post('/resources/files/{id}/reprocess', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'reprocessFile']);

        // Directory resources
        Route::post('/resources/directories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createDirectory']);
        Route::put('/resources/directories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDirectory']);
        Route::post('/resources/directories/{id}/sync', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'syncDirectory']);

        // Web resources
        Route::post('/resources/web', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createWebResource']);
        Route::put('/resources/web/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateWebResource']);
        Route::post('/resources/web/{id}/scrape', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'scrapeWebResource']);

        // Collections
        Route::get('/collections', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllCollections']);
        Route::get('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCollectionById']);
        Route::post('/collections', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createCollection']);
        Route::put('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateCollection']);
        Route::delete('/collections/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteCollection']);

        // Profiles
        Route::get('/profiles', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllProfiles']);
        Route::get('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getProfileById']);
        Route::post('/profiles', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createProfile']);
        Route::put('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateProfile']);
        Route::delete('/profiles/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteProfile']);

        // Context Scopes
        Route::get('/context-scopes', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllContextScopes']);
        Route::get('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getContextScopeById']);
        Route::post('/context-scopes', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createContextScope']);
        Route::put('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateContextScope']);
        Route::delete('/context-scopes/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteContextScope']);

        // Legacy document routes
        Route::get('/documents', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllDocuments']);
        Route::get('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getDocumentById']);
        Route::post('/documents', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createDocument']);
        Route::post('/documents/upload', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'uploadDocument']);
        Route::put('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateDocument']);
        Route::delete('/documents/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteDocument']);
        Route::get('/documents/search', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'searchDocuments']);

        // Categories
        Route::get('/categories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getAllCategories']);
        Route::get('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getCategoryById']);
        Route::post('/categories', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'createCategory']);
        Route::put('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'deleteCategory']);

        // Settings
        Route::get('/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'getSettings']);
        Route::put('/settings', [\App\Http\Controllers\API\KnowledgeBaseController::class, 'updateSettings']);

        // Debug route for testing knowledge base - remove after testing
        Route::get('/debug/knowledge-base/resources', function () {
            try {
                $service = app(\App\Services\KnowledgeBaseService::class);
                $resources = $service->getAllResources(1, 10);

                return response()->json([
                    'success' => true,
                    'message' => 'Successfully fetched resources',
                    'data' => $resources,
                    'time' => now()->toDateTimeString()
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error fetching resources: ' . $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'time' => now()->toDateTimeString()
                ], 500);
            }
        });
    });

    // AI routes with /ai prefix
    Route::prefix('ai')->group(function () {
        // AI Models
        // Route::get('/models', [AIModelController::class, 'index']); // Moved to public for debugging
        Route::get('/models/{id}', [AIModelController::class, 'show']);
        Route::post('/models', [AIModelController::class, 'store'])->middleware('permission:manage models');
        Route::put('/models/{id}', [AIModelController::class, 'update'])->middleware('permission:manage models');
        Route::delete('/models/{id}', [AIModelController::class, 'destroy'])->middleware('permission:manage models');
        Route::post('/models/{id}/default', [AIModelController::class, 'setDefault'])->middleware('permission:manage models');
        Route::post('/models/{id}/test', [AIModelController::class, 'testModel']);

        // Routing Rules
        // Route::get('/routing-rules', [\App\Http\Controllers\API\RoutingRuleController::class, 'index']); // Moved to public routes
        Route::get('/routing-rules/{id}', [RoutingRuleController::class, 'show']);
        Route::post('/routing-rules', [RoutingRuleController::class, 'store']);
        Route::put('/routing-rules/{id}', [RoutingRuleController::class, 'update']);
        Route::delete('/routing-rules/{id}', [RoutingRuleController::class, 'destroy']);

        // Model Providers
        Route::get('/providers', [ModelProviderController::class, 'index']);
        Route::get('/providers/{id}', [ModelProviderController::class, 'show']);
        Route::post('/providers', [ModelProviderController::class, 'store'])->middleware('permission:manage models');
        Route::put('/providers/{id}', [ModelProviderController::class, 'update'])->middleware('permission:manage models');
        Route::delete('/providers/{id}', [ModelProviderController::class, 'destroy'])->middleware('permission:manage models');

        // Follow-up suggestions
        Route::get('/follow-up/settings', [FollowUpController::class, 'getSettings']);
        Route::put('/follow-up/settings', [FollowUpController::class, 'updateSettings']);
        Route::get('/follow-up/suggestions', [FollowUpController::class, 'getSuggestions']);
        Route::post('/follow-up/suggestions', [FollowUpController::class, 'createSuggestion']);
        Route::put('/follow-up/suggestions/{id}', [FollowUpController::class, 'updateSuggestion']);
        Route::delete('/follow-up/suggestions/{id}', [FollowUpController::class, 'deleteSuggestion']);
        Route::put('/follow-up/suggestions/reorder', [FollowUpController::class, 'reorderSuggestions']);
        Route::get('/follow-up/categories', [FollowUpController::class, 'getCategories']);

        // Prompt templates
        Route::prefix('prompt-templates')->group(function () {
            Route::get('/', [PromptTemplateController::class, 'index']);
            Route::post('/', [PromptTemplateController::class, 'store']);
            Route::get('/{id}', [PromptTemplateController::class, 'show']);
            Route::put('/{id}', [PromptTemplateController::class, 'update']);
            Route::delete('/{id}', [PromptTemplateController::class, 'destroy']);
            Route::get('/categories', [PromptTemplateController::class, 'getCategories']);
            Route::get('/library', [PromptTemplateController::class, 'getLibrary']);
            Route::post('/{id}/usage', [PromptTemplateController::class, 'incrementUsage']);
            Route::post('/{id}/test', [PromptTemplateController::class, 'testTemplate']);
            Route::get('/system-prompt', [PromptTemplateController::class, 'getSystemPrompt']);
            Route::put('/system-prompt', [PromptTemplateController::class, 'updateSystemPrompt']);
        });

        // Response formats
        Route::get('/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'index']);
        Route::get('/response-formats/default', [\App\Http\Controllers\API\ResponseFormatController::class, 'getDefault']);
        Route::get('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'show']);
        Route::post('/response-formats', [\App\Http\Controllers\API\ResponseFormatController::class, 'store']);
        Route::put('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'update']);
        Route::delete('/response-formats/{id}', [\App\Http\Controllers\API\ResponseFormatController::class, 'destroy']);
        Route::post('/response-formats/{id}/set-default', [\App\Http\Controllers\API\ResponseFormatController::class, 'setDefault']);
        Route::post('/response-formats/{id}/test', [\App\Http\Controllers\API\ResponseFormatController::class, 'test']);

        // Widgets
        Route::get('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'index']);
        Route::get('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'show']);
        Route::post('/widgets', [\App\Http\Controllers\API\WidgetController::class, 'store']);
        Route::put('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'update']);
        Route::delete('/widgets/{id}', [\App\Http\Controllers\API\WidgetController::class, 'destroy']);
        Route::get('/widgets/{id}/analytics', [\App\Http\Controllers\API\WidgetController::class, 'getAnalytics']);

        // Settings
        Route::get('/get-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'getAppSettings']);
        Route::put('/update-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateAppSettings']);
        Route::get('/get-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'getUserSettings']);
        Route::post('/update-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateUserSettings']);
        Route::put('/reset-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'resetUserSettings']);
    });

    // Keep the non-AI routes outside the prefix
    // ... existing code ...

});
