
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as analyticsService from '@/services/analytics/analyticsService';

export const useAnalytics = () => {
  const [overview, setOverview] = useState<analyticsService.AnalyticsOverview | null>(null);
  const [chatMetrics, setChatMetrics] = useState<analyticsService.ChatMetrics | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<analyticsService.UsageMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<analyticsService.PerformanceMetrics | null>(null);
  const [userFeedback, setUserFeedback] = useState<analyticsService.UserFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate?: string; endDate?: string }>({});
  const { toast } = useToast();

  const fetchAnalyticsOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getAnalyticsOverview(
        dateRange.startDate,
        dateRange.endDate
      );
      setOverview(data);
      return data;
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics overview',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  const fetchChatMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getChatMetrics(
        dateRange.startDate,
        dateRange.endDate
      );
      setChatMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching chat metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat metrics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  const fetchUsageMetrics = useCallback(async (interval: 'day' | 'week' | 'month' = 'day') => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUsageMetrics(
        dateRange.startDate,
        dateRange.endDate,
        interval
      );
      setUsageMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load usage metrics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getPerformanceMetrics(
        dateRange.startDate,
        dateRange.endDate
      );
      setPerformanceMetrics(data);
      return data;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load performance metrics',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  const fetchUserFeedback = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUserFeedback(
        dateRange.startDate,
        dateRange.endDate
      );
      setUserFeedback(data);
      return data;
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user feedback',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  const exportAnalyticsData = useCallback(async (format: 'csv' | 'json' | 'excel' = 'csv') => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        toast({
          title: 'Error',
          description: 'Please select a date range for export',
          variant: 'destructive',
        });
        return null;
      }
      
      setIsLoading(true);
      const blob = await analyticsService.exportAnalyticsData(
        dateRange.startDate,
        dateRange.endDate,
        format
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'Analytics data exported successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export analytics data',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  // Fetch all analytics data when the component mounts or date range changes
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAnalyticsOverview(),
        fetchChatMetrics(),
        fetchUsageMetrics(),
        fetchPerformanceMetrics(),
        fetchUserFeedback(),
      ]);
      setIsLoading(false);
    };
    
    fetchAllData();
  }, [
    fetchAnalyticsOverview,
    fetchChatMetrics,
    fetchUsageMetrics,
    fetchPerformanceMetrics,
    fetchUserFeedback,
  ]);

  return {
    overview,
    chatMetrics,
    usageMetrics,
    performanceMetrics,
    userFeedback,
    isLoading,
    dateRange,
    setDateRange,
    fetchAnalyticsOverview,
    fetchChatMetrics,
    fetchUsageMetrics,
    fetchPerformanceMetrics,
    fetchUserFeedback,
    exportAnalyticsData,
  };
};
