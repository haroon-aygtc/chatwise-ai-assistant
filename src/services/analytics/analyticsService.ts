
import ApiService from '../api/base';

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
  dailyChats: Array<{ date: string; count: number }>;
}

export interface UsageMetrics {
  dailyActiveUsers: Array<{ date: string; count: number }>;
  messageVolume: Array<{ date: string; count: number }>;
  peakUsageTimes: Array<{ hour: number; count: number }>;
  totalTokens: number;
  tokenTrend: number;
}

export interface PerformanceMetrics {
  responseLatency: Array<{ date: string; avgTime: number }>;
  errorRates: Array<{ date: string; rate: number }>;
  systemUptime: number;
  avgResponseTime: number;
  responseTimeTrend: number;
}

export interface UserFeedback {
  overall: number;
  helpful: number;
  accurate: number;
  feedback: Array<{ id: string; rating: number; comment: string; date: string }>;
}

export interface RecentSession {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  messageCount: number;
  date: string;
}

export interface AnalyticsData {
  overview: {
    totalConversations: number;
    conversationTrend: number;
    activeUsers: number;
    userTrend: number;
  };
  chatMetrics: ChatMetrics;
  usageMetrics: UsageMetrics;
  performanceMetrics: PerformanceMetrics;
  userFeedback: UserFeedback;
  recentSessions: RecentSession[];
}

// Individual analytics functions
export const getAnalyticsOverview = async (
  startDate?: string,
  endDate?: string
): Promise<AnalyticsOverview> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });

  return ApiService.get<AnalyticsOverview>('/analytics/overview', { params });
};

export const getChatMetrics = async (
  startDate?: string,
  endDate?: string
): Promise<ChatMetrics> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });

  return ApiService.get<ChatMetrics>('/analytics/chat-metrics', { params });
};

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

export const getPerformanceMetrics = async (
  startDate?: string,
  endDate?: string
): Promise<PerformanceMetrics> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });

  return ApiService.get<PerformanceMetrics>('/analytics/performance', { params });
};

export const getUserFeedback = async (
  startDate?: string,
  endDate?: string
): Promise<UserFeedback> => {
  const params = {};
  if (startDate) Object.assign(params, { start_date: startDate });
  if (endDate) Object.assign(params, { end_date: endDate });

  return ApiService.get<UserFeedback>('/analytics/feedback', { params });
};

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

// Create an AnalyticsService object that matches what's being imported in Analytics.tsx
export const AnalyticsService = {
  // Get all analytics data in one call
  getAnalytics: async (params: { startDate?: string; endDate?: string }): Promise<AnalyticsData> => {
    try {
      // In a real implementation, we might make a single API call that returns all data
      // For now, we'll simulate it by making multiple calls and combining the results
      const [overview, chatMetrics, usageMetrics, performanceMetrics, userFeedback] = await Promise.all([
        getAnalyticsOverview(params.startDate, params.endDate),
        getChatMetrics(params.startDate, params.endDate),
        getUsageMetrics(params.startDate, params.endDate),
        getPerformanceMetrics(params.startDate, params.endDate),
        getUserFeedback(params.startDate, params.endDate)
      ]);

      // Create mock data for the fields expected by the Analytics component
      return {
        overview: {
          totalConversations: overview.totalSessions,
          conversationTrend: 5.2, // Mock trend data
          activeUsers: overview.activeUsers,
          userTrend: 3.1 // Mock trend data
        },
        chatMetrics,
        usageMetrics,
        performanceMetrics,
        userFeedback,
        recentSessions: [
          {
            id: '1',
            user: {
              name: 'John Doe',
              email: 'john@example.com',
              avatar: '/avatars/01.png'
            },
            messageCount: 12,
            date: new Date().toISOString()
          },
          {
            id: '2',
            user: {
              name: 'Jane Smith',
              email: 'jane@example.com',
              avatar: '/avatars/02.png'
            },
            messageCount: 8,
            date: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3',
            user: {
              name: 'Bob Johnson',
              email: 'bob@example.com',
              avatar: '/avatars/03.png'
            },
            messageCount: 15,
            date: new Date(Date.now() - 7200000).toISOString()
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  // Export analytics data
  exportAnalyticsData: async (format: string = 'csv'): Promise<Blob> => {
    // Get current date range (last 30 days by default)
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    return exportAnalyticsData(startDate, endDate, format as 'csv' | 'json' | 'excel');
  }
};
