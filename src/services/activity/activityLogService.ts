
import ApiService from '../api/base';
import { DateRange } from '@/types/user';

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  action_type: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ActivityLogParams {
  page?: number;
  per_page?: number;
  user_id?: string;
  action_type?: string;
  date_range?: DateRange;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Service for managing activity logs
 */
export const activityLogService = {
  /**
   * Get activity logs with optional filtering
   */
  getActivityLogs: async (params?: ActivityLogParams): Promise<ActivityLogResponse> => {
    return ApiService.get<ActivityLogResponse>('/activity-logs', { params });
  },

  /**
   * Get available action types
   */
  getActionTypes: async (): Promise<string[]> => {
    const response = await ApiService.get<{ data: string[] }>('/activity-logs/types');
    return response.data;
  },

  /**
   * Export activity logs based on filters
   */
  exportActivityLogs: async (params?: ActivityLogParams): Promise<Blob> => {
    const response = await ApiService.getAxiosInstance().get('/activity-logs/export', { 
      params,
      responseType: 'blob' 
    });
    return new Blob([response.data], { type: response.headers['content-type'] });
  }
};

export default activityLogService;
