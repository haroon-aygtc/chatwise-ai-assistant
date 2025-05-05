
import ApiService from '../api/base';

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActivityLogParams {
  page?: number;
  per_page?: number;
  user_id?: string;
  action_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

class ActivityLogService {
  /**
   * Get a paginated list of activity logs
   */
  static async getActivityLogs(params: ActivityLogParams = {}): Promise<ActivityLogResponse> {
    return ApiService.get<ActivityLogResponse>('/activity-logs', params);
  }

  /**
   * Get activity log types for filtering
   */
  static async getActivityTypes(): Promise<string[]> {
    return ApiService.get<string[]>('/activity-logs/types');
  }

  /**
   * Export activity logs to CSV
   */
  static async exportActivityLogs(params: ActivityLogParams = {}): Promise<Blob> {
    return ApiService.getBlob('/activity-logs/export', params);
  }
}

export default ActivityLogService;
