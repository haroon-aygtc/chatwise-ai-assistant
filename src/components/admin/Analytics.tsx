
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { FileDown, RefreshCw } from 'lucide-react';
import { AnalyticsService } from '@/services/analytics/analyticsService';
import { toast } from "@/components/ui/use-toast";

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => AnalyticsService.getAnalytics({
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString()
    })
  });

  const { mutateAsync: exportData, isPending: isExporting } = useMutation({
    mutationFn: (format: string = 'csv') => AnalyticsService.exportAnalyticsData(format),
    onSuccess: () => {
      toast({
        title: "Analytics data exported successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: `Export failed: ${error.message}`
      });
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = (format: string = 'csv') => {
    exportData(format);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : analyticsData?.overview.totalConversations.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : analyticsData?.overview.conversationTrend > 0 
                  ? `+${analyticsData.overview.conversationTrend}% from previous period` 
                  : `${analyticsData.overview.conversationTrend}% from previous period`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : analyticsData?.overview.activeUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : analyticsData?.overview.userTrend > 0 
                  ? `+${analyticsData.overview.userTrend}% from previous period` 
                  : `${analyticsData.overview.userTrend}% from previous period`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response Time
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${analyticsData?.performanceMetrics.avgResponseTime.toFixed(2)}s`}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : analyticsData?.performanceMetrics.responseTimeTrend < 0 
                  ? `${analyticsData.performanceMetrics.responseTimeTrend}% faster than previous period` 
                  : `+${analyticsData.performanceMetrics.responseTimeTrend}% slower than previous period`
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Token Usage
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : 
                  analyticsData?.usageMetrics.totalTokens > 1000000 
                    ? `${(analyticsData.usageMetrics.totalTokens / 1000000).toFixed(2)}M` 
                    : analyticsData?.usageMetrics.totalTokens > 1000 
                      ? `${(analyticsData.usageMetrics.totalTokens / 1000).toFixed(2)}K` 
                      : analyticsData?.usageMetrics.totalTokens.toLocaleString()
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : analyticsData?.usageMetrics.tokenTrend > 0 
                  ? `+${analyticsData.usageMetrics.tokenTrend}% from previous period` 
                  : `${analyticsData.usageMetrics.tokenTrend}% from previous period`
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Chat activity for the selected period.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview 
                data={analyticsData?.chatMetrics.dailyChats || []} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Latest user conversations.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales 
                data={analyticsData?.recentSessions || []} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex-grow w-full flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')} disabled={isLoading || isExporting}>
              <FileDown className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('json')} disabled={isLoading || isExporting}>
              <FileDown className="mr-2 h-4 w-4" /> Export JSON
            </Button>
          </div>
        </div>
        <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
      </div>
    </div>
  );
};

export default Analytics;
