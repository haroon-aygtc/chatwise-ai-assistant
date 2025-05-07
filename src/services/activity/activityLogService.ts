
import ApiService from "../api/api";
import { ApiRequestParams } from "../api/types";

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface ActivityLogResponse {
  meta: Record<string, unknown>;
  data: ActivityLog[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

class ActivityLogService {
  /**
   * Get paginated activity logs
   */
  static async getActivityLogs(
    params: ApiRequestParams = {}
  ): Promise<ActivityLogResponse> {
    return await ApiService.get<ActivityLogResponse>("/activity-logs", params);
  }

  /**
   * Get all available action types for filtering
   */
  static async getActionTypes(): Promise<string[]> {
    return await ApiService.get<string[]>("/activity-logs/action-types");
  }

  /**
   * Export activity logs as CSV
   */
  static async exportActivityLogs(
    params: ApiRequestParams = {}
  ): Promise<Blob> {
    const response = await ApiService.getAxiosInstance().get(
      "/activity-logs/export",
      {
        params,
        responseType: "blob",
      }
    );
    return response.data;
  }

  /**
   * Get activity log by ID
   */
  static async getActivityLog(id: string): Promise<ActivityLog> {
    return await ApiService.get<ActivityLog>(`/activity-logs/${id}`);
  }
}

export default ActivityLogService;
