
import ApiService from '../api/api';

// Types for analytics data
export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number;
  satisfactionRate: number;
}

export interface ChatMetrics {
  totalMessages: number;
  averageResponseTime: number;
  aiResponses: number;
  humanResponses: number;
  topIntents: Array<{ intent: string; count: number }>;
}

export interface UsageMetrics {
  dailyActiveUsers: Array<{ date: string; count: number }>;
  messageVolume: Array<{ date: string; count: number }>;
  peakUsageTimes: Array<{ hour: number; count: number }>;
}

export interface PerformanceMetrics {
  responseLatency: Array<{ date: string; avgTime: number }>;
  errorRates: Array<{ date: string; rate: number }>;
  systemUptime: number;
}

export interface UserFeedback {
  overall: number;
  helpful: number;
  accurate: number;
  feedback: Array<{ id: string; rating: number; comment: string; date: string }>;
}

// Get analytics overview
export const getAnalyticsOverview = async (
  startDate?: string,
  endDate?: string
): Promise<AnalyticsOverview> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });
  
  return ApiService.get<AnalyticsOverview>('/analytics/overview', { params });
};

// Get chat metrics
export const getChatMetrics = async (
  startDate?: string,
  endDate?: string
): Promise<ChatMetrics> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });
  
  return ApiService.get<ChatMetrics>('/analytics/chat-metrics', { params });
};

// Get usage metrics
export const getUsageMetrics = async (
  startDate?: string,
  endDate?: string,
  interval: 'day' | 'week' | 'month' = 'day'
): Promise<UsageMetrics> => {
  const params = { interval };
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });
  
  return ApiService.get<UsageMetrics>('/analytics/usage-metrics', { params });
};

// Get performance metrics
export const getPerformanceMetrics = async (
  startDate?: string,
  endDate?: string
): Promise<PerformanceMetrics> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });
  
  return ApiService.get<PerformanceMetrics>('/analytics/performance', { params });
};

// Get user feedback
export const getUserFeedback = async (
  startDate?: string,
  endDate?: string
): Promise<UserFeedback> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });
  
  return ApiService.get<UserFeedback>('/analytics/feedback', { params });
};

// Export analytics data
export const exportAnalyticsData = async (
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' | 'excel' = 'csv'
): Promise<Blob> => {
  return ApiService.get<Blob>('/analytics/export', {
    params: { start_date: startDate, end_date: endDate, format },
    responseType: 'blob'
  });
};

