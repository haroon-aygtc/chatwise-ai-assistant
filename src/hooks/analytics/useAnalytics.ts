
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as analyticsService from '@/services/analytics/analyticsService';

export const useAnalytics = (
  startDate?: string,
  endDate?: string,
  autoload = true
) => {
  const [overview, setOverview] = useState<analyticsService.AnalyticsOverview | null>(null);
  const [chatMetrics, setChatMetrics] = useState<analyticsService.ChatMetrics | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<analyticsService.UsageMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<analyticsService.PerformanceMetrics | null>(null);
  const [userFeedback, setUserFeedback] = useState<analyticsService.UserFeedback | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getAnalyticsOverview(startDate, endDate);
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
  }, [startDate, endDate, toast]);

  const fetchChatMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getChatMetrics(startDate, endDate);
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
  }, [startDate, endDate, toast]);

  const fetchUsageMetrics = useCallback(async (interval: 'day' | 'week' | 'month' = 'day') => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUsageMetrics(startDate, endDate, interval);
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
  }, [startDate, endDate, toast]);

  const fetchPerformanceMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getPerformanceMetrics(startDate, endDate);
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
  }, [startDate, endDate, toast]);

  const fetchUserFeedback = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await analyticsService.getUserFeedback(startDate, endDate);
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
  }, [startDate, endDate, toast]);

  const exportAnalytics = useCallback(async (format: 'csv' | 'json' | 'excel' = 'csv') => {
    if (!startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Start and end dates are required for export',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsExporting(true);
      const blob = await analyticsService.exportAnalyticsData(startDate, endDate, format);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics_${startDate}_to_${endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'Analytics data exported successfully',
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to export analytics data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [startDate, endDate, toast]);

  const loadAllMetrics = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchOverview(),
      fetchChatMetrics(),
      fetchUsageMetrics(),
      fetchPerformanceMetrics(),
      fetchUserFeedback(),
    ]);
    setIsLoading(false);
  }, [fetchOverview, fetchChatMetrics, fetchUsageMetrics, fetchPerformanceMetrics, fetchUserFeedback]);

  // Load all metrics on component mount if autoload is true
  useEffect(() => {
    if (autoload) {
      loadAllMetrics();
    }
  }, [autoload, loadAllMetrics]);

  return {
    overview,
    chatMetrics,
    usageMetrics,
    performanceMetrics,
    userFeedback,
    isLoading,
    isExporting,
    fetchOverview,
    fetchChatMetrics,
    fetchUsageMetrics,
    fetchPerformanceMetrics,
    fetchUserFeedback,
    loadAllMetrics,
    exportAnalytics,
  };
};
