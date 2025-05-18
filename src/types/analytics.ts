/**
 * Analytics Types
 * 
 * This file contains all types related to analytics data across the application.
 * These types are used for consistent data handling in analytics components and services.
 */

// Common analytics date range type
export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

// Widget Analytics Types
export interface WidgetAnalytics {
  interactions: WidgetInteractions;
  messages: MessageMetrics;
  performance: WidgetPerformance;
  usage: WidgetUsage;
  satisfaction: SatisfactionMetrics;
  trends: WidgetTrends;
}

export interface WidgetInteractions {
  total: number;
  uniqueUsers: number;
  averageDuration: number;
  bounceRate: number;
  interactionsOverTime: TimeSeriesData[];
}

export interface MessageMetrics {
  total: number;
  userMessages: number;
  aiResponses: number;
  averageResponseTime: number;
  messageDistribution: {
    category: string;
    count: number;
  }[];
}

export interface WidgetPerformance {
  loadTime: number;
  errorRate: number;
  uptime: number;
  responseLatency: TimeSeriesData[];
}

export interface WidgetUsage {
  byDevice: {
    device: string;
    percentage: number;
  }[];
  byBrowser: {
    browser: string;
    percentage: number;
  }[];
  byLocation: {
    country: string;
    count: number;
  }[];
  byTime: {
    hour: number;
    count: number;
  }[];
}

export interface SatisfactionMetrics {
  averageRating: number;
  ratingsDistribution: {
    rating: number;
    count: number;
  }[];
  feedbackSummary: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recentFeedback: {
    id: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface WidgetTrends {
  dailyActiveUsers: TimeSeriesData[];
  messageVolume: TimeSeriesData[];
  satisfactionTrend: TimeSeriesData[];
  topIntents: {
    intent: string;
    count: number;
  }[];
}

// Common time series data structure
export interface TimeSeriesData {
  date: string;
  value: number;
}

// Re-export analytics types from analyticsService for consistency
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

// Customization options type
export interface CustomizationOptions {
  themes: {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  }[];
  fonts: {
    id: string;
    name: string;
    family: string;
    category: string;
  }[];
  sizes: {
    id: string;
    name: string;
    dimensions: {
      width: string;
      height: string;
    };
  }[];
  positions: {
    id: string;
    name: string;
    value: string;
  }[];
}
