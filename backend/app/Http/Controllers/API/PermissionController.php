<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\PermissionService;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    protected $permissionService;

    /**
     * Create a new controller instance.
     *
     * @param PermissionService $permissionService
     */
    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * Display a listing of all permissions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $permissions = $this->permissionService->getAllPermissions();

        return response()->json($permissions);
    }

    /**
     * Get permissions grouped by category.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByCategory()
    {
        $permissionsByCategory = $this->permissionService->getPermissionsByCategory();

        return response()->json($permissionsByCategory);
    }
}