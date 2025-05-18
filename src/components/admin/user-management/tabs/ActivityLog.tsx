import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import activityLogService from "@/services/activity/activityLogService";

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activityLogService.getActivityLogs({ page: currentPage });
      setActivityLogs(response.data);
      setTotalLogs(response.meta?.total || response.data.length);
    } catch (err) {
      setError(err);
      setActivityLogs([]);
      setTotalLogs(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchLogs();
    return () => {
      controller.abort();
    };
  }, [currentPage]);

  const exportLogs = async (format) => {
    console.log(`Exporting logs in ${format} format`);
    return Promise.resolve();
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleExport = async () => {
    try {
      await exportLogs("csv");
    } catch (err) {
      console.error("Error exporting activity logs:", err);
    }
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPage(Math.max(1, currentPage - 1));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Track user actions and system events
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh activity logs"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || "Failed to load activity logs"}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading activity logs...
            </p>
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activity logs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activityLogs.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <Avatar className="h-9 w-9">
                  {activity.user_avatar ? (
                    <AvatarImage
                      src={activity.user_avatar}
                      alt={activity.user_name || "User"}
                    />
                  ) : (
                    <AvatarFallback>
                      {(activity.user_name || "U").charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {activity.user_name || "Unknown User"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">
                    {activity.action}{" "}
                    <span className="font-medium">{activity.description}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => goToPage(1)}>
          View All Activity
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || currentPage <= 1}
            onClick={goToPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              isLoading || (totalLogs > 0 && currentPage * 10 >= totalLogs)
            }
            onClick={goToNextPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityLog;
