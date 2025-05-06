import ApiService from "../api/base";

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
  meta: any;
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
    params: {
      page?: number;
      per_page?: number;
      search?: string;
      action_type?: string;
      from_date?: string;
      to_date?: string;
      user_id?: string;
    } = {}
  ): Promise<ActivityLogResponse> {
    const response = await ApiService.get<ActivityLogResponse>(
      "/activity-logs",
      params
    );
    return response.data;
  }

  /**
   * Get all available action types for filtering
   */
  static async getActionTypes(): Promise<string[]> {
    const response = await ApiService.get<string[]>(
      "/activity-logs/action-types"
    );
    return response.data;
  }

  /**
   * Export activity logs as CSV
   */
  static async exportActivityLogs(
    params: {
      search?: string;
      action_type?: string;
      from_date?: string;
      to_date?: string;
      user_id?: string;
    } = {}
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
    const response = await ApiService.get<ActivityLog>(`/activity-logs/${id}`);
    return response.data;
  }
}

export default ActivityLogService;
