<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of activity logs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->latest();

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action type if provided
        if ($request->has('action_type')) {
            $query->where('action', $request->action_type);
        }

        // Filter by date range if provided
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search in description if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%");
            });
        }

        // Get paginated results
        $activityLogs = $query->paginate($request->per_page ?? 15);

        return response()->json($activityLogs);
    }

    /**
     * Get all distinct action types for filtering.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getActionTypes()
    {
        $types = ActivityLog::distinct()->pluck('action')->toArray();
        return response()->json($types);
    }

    /**
     * Export activity logs to CSV.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(Request $request)
    {
        $query = ActivityLog::with('user')->latest();

        // Apply the same filters as in index method
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action_type')) {
            $query->where('action', $request->action_type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%");
            });
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="activity-logs.csv"',
            'Cache-Control' => 'max-age=0'
        ];

        $activityLogs = $query->get();

        $columns = ['ID', 'User', 'Action', 'Description', 'IP Address', 'User Agent', 'Time'];

        $callback = function() use ($activityLogs, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($activityLogs as $log) {
                $row = [
                    $log->id,
                    $log->user ? $log->user->name : 'Unknown User',
                    $log->action,
                    $log->description,
                    $log->ip_address,
                    $log->user_agent,
                    $log->created_at->toDateTimeString()
                ];

                fputcsv($file, $row);
            }

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
