<?php

use App\Http\Controllers\API\AIModelController;
use App\Http\Controllers\API\ModelProviderController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\AuthController;
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

// AI Model routes
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



// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {

    // User Settings
    Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
    Route::get('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);
    Route::post('/users', [\App\Http\Controllers\API\UserController::class, 'store']);
    Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
    Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
    Route::put('/users/{id}/status', [\App\Http\Controllers\API\UserController::class, 'updateStatus']);
    Route::put('/users/{id}/assign-roles', [\App\Http\Controllers\API\UserController::class, 'assignRoles']);



    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/roles/{role}', [RoleController::class, 'show']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
    Route::put('/roles/{role}/permissions', [RoleController::class, 'updatePermissions']);

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/categories', [PermissionController::class, 'getByCategory']);

    Route::get('/models', [AIModelController::class, 'index']);
    Route::get('/models/{id}', [AIModelController::class, 'show']);
    Route::post('/models', [AIModelController::class, 'store'])->middleware('permission:manage models');
    Route::put('/models/{id}', [AIModelController::class, 'update'])->middleware('permission:manage models');
    Route::delete('/models/{id}', [AIModelController::class, 'destroy'])->middleware('permission:manage models');
    Route::post('/models/{id}/default', [AIModelController::class, 'setDefault'])->middleware('permission:manage models');
    Route::post('/models/{id}/test', [AIModelController::class, 'testModel']);

    // Model Providers
    Route::get('/providers', [ModelProviderController::class, 'index']);
    Route::get('/providers/{id}', [ModelProviderController::class, 'show']);
    Route::post('/providers', [ModelProviderController::class, 'store'])->middleware('permission:manage models');
    Route::put('/providers/{id}', [ModelProviderController::class, 'update'])->middleware('permission:manage models');
    Route::delete('/providers/{id}', [ModelProviderController::class, 'destroy'])->middleware('permission:manage models');


    // Follow-up suggestions
    Route::get('/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'getSettings']);
    Route::put('/follow-up/settings', [\App\Http\Controllers\API\FollowUpController::class, 'updateSettings']);
    Route::get('/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'getSuggestions']);
    Route::post('/follow-up/suggestions', [\App\Http\Controllers\API\FollowUpController::class, 'createSuggestion']);
    Route::put('/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'updateSuggestion']);
    Route::delete('/follow-up/suggestions/{id}', [\App\Http\Controllers\API\FollowUpController::class, 'deleteSuggestion']);
    Route::put('/follow-up/suggestions/reorder', [\App\Http\Controllers\API\FollowUpController::class, 'reorderSuggestions']);
    Route::get('/follow-up/categories', [\App\Http\Controllers\API\FollowUpController::class, 'getCategories']);

    // System prompt
    // Route::get('/ai-configuration/system-prompt', [\App\Http\Controllers\API\AIConfigurationController::class, 'getSystemPrompt']);
    // Route::put('/ai-configuration/system-prompt', [\App\Http\Controllers\API\AIConfigurationController::class, 'updateSystemPrompt']);

    // Prompt templates
    Route::get('/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'index']);
    Route::get('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'show']);
    Route::post('/prompt-templates', [\App\Http\Controllers\API\PromptTemplateController::class, 'store']);
    Route::put('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'update']);
    Route::delete('/prompt-templates/{id}', [\App\Http\Controllers\API\PromptTemplateController::class, 'destroy']);
    Route::get('/prompt-templates/categories/list', [\App\Http\Controllers\API\PromptTemplateController::class, 'getCategories']);
    Route::post('/prompt-templates/{id}/increment-usage', [\App\Http\Controllers\API\PromptTemplateController::class, 'incrementUsage']);

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

    //settings
    Route::get('/get-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'getAppSettings']);
    Route::put('/update-app-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateAppSettings']);
    Route::get('/get-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'getUserSettings']);
    Route::post('/update-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'updateUserSettings']);
    Route::put('/reset-user-settings', [\App\Http\Controllers\API\SettingsController::class, 'resetUserSettings']);


    // Widget Settings
    // Route::get('/widget-settings', [\App\Http\Controllers\API\WidgetSettingController::class, 'index']);
    // Route::get('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'show']);
    // Route::post('/widget-settings', [\App\Http\Controllers\API\WidgetSettingController::class, 'store']);
    // Route::put('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'update']);
    // Route::delete('/widget-settings/{id}', [\App\Http\Controllers\API\WidgetSettingController::class, 'destroy']);


});
