
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { FileDownIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import * as analyticsService from '@/services/analytics/analyticsService';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date(),
  });

  const {
    data: analyticsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => analyticsService.getAnalyticsOverview(
      dateRange.from.toISOString(),
      dateRange.to.toISOString()
    )
  });

  const { mutateAsync: exportData, isPending: isExporting } = useMutation({
    mutationFn: (format: 'csv' | 'json' | 'excel' = 'csv') => 
      analyticsService.exportAnalyticsData(
        dateRange.from.toISOString(),
        dateRange.to.toISOString(),
        format
      ),
    onSuccess: () => {
      toast.success("Analytics data exported successfully");
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    }
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = (format: 'csv' | 'json' | 'excel' = 'csv') => {
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
                {isLoading ? "Loading..." : analyticsData?.totalSessions?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : 
                  analyticsData?.averageSessionTime ? `${analyticsData.averageSessionTime.toFixed(1)} min avg. session time` : "No data available"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
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
                {isLoading ? "Loading..." : analyticsData?.activeUsers?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : 
                  analyticsData?.totalUsers ? `${analyticsData.totalUsers.toLocaleString()} total registered users` : "No users data"}
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
                {isLoading ? "Loading..." : 
                  analyticsData?.averageResponseTime !== undefined ? 
                  `${analyticsData.averageResponseTime.toFixed(2)}s` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : 
                  "Response time for AI-generated replies"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Satisfaction
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
                  analyticsData?.satisfactionRate !== undefined ? 
                  `${(analyticsData.satisfactionRate * 100).toFixed(0)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "" : 
                  "User satisfaction rate"}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Chat activity for the selected period.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview 
                data={analyticsData?.dailyActiveUsers || []} 
                isLoading={isLoading} 
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                Latest user conversations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales 
                data={analyticsData?.feedback?.feedback || []} 
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
            <Button variant="outline" onClick={() => handleExport('csv')} disabled={isLoading}>
              <FileDownIcon className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('json')} disabled={isLoading}>
              <FileDownIcon className="mr-2 h-4 w-4" /> Export JSON
            </Button>
          </div>
        </div>
        <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
      </div>
    </div>
  );
};

export default Analytics;
