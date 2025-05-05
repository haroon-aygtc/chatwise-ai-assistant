
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
import { useToast } from "@/components/ui/use-toast";
import ActivityLogService, { ActivityLog, ActivityLogParams } from "@/services/activity/activityLogService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [filters, setFilters] = useState<ActivityLogParams>({
    page: 1,
    per_page: 10,
  });
  const { toast } = useToast();

  // Load activity logs
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ActivityLogService.getActivityLogs(filters);
      setActivityLogs(response.data);
      setTotalLogs(response.total);
      setCurrentPage(response.current_page);
      setLastPage(response.last_page);
      setPerPage(response.per_page);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      setError(error instanceof Error ? error : new Error("Failed to fetch activity logs"));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activity logs. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load activity types for filter
  const fetchActivityTypes = async () => {
    setIsLoadingTypes(true);
    
    try {
      const types = await ActivityLogService.getActivityTypes();
      setActivityTypes(types);
    } catch (error) {
      console.error("Error fetching activity types:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activity types for filtering.",
      });
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Initial loads
  useEffect(() => {
    fetchLogs();
    fetchActivityTypes();
  }, []);

  // Reload when filters change
  useEffect(() => {
    fetchLogs();
  }, [filters]);

  // Export logs
  const exportLogs = async (format: string) => {
    setIsExporting(true);
    
    try {
      const blob = await ActivityLogService.exportActivityLogs(filters);
      
      // Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity-logs-${format === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Activity logs have been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting activity logs:", error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export activity logs. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Pagination
  const goToPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleExport = async () => {
    await exportLogs('csv');
  };

  // Apply filters
  const applyFilters = (newFilters: Partial<ActivityLogParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      per_page: perPage,
    });
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Activity Logs</SheetTitle>
                  <SheetDescription>
                    Apply filters to narrow down your activity logs.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="action-type">Action Type</Label>
                    <Select
                      onValueChange={(value) => 
                        applyFilters({ action_type: value !== "all" ? value : undefined })
                      }
                      value={filters.action_type || "all"}
                    >
                      <SelectTrigger id="action-type">
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        {activityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex flex-col gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {filters.date_from ? format(new Date(filters.date_from), 'PPP') : "From Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.date_from ? new Date(filters.date_from) : undefined}
                            onSelect={(date) => 
                              applyFilters({ date_from: date ? format(date, 'yyyy-MM-dd') : undefined })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {filters.date_to ? format(new Date(filters.date_to), 'PPP') : "To Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.date_to ? new Date(filters.date_to) : undefined}
                            onSelect={(date) => 
                              applyFilters({ date_to: date ? format(date, 'yyyy-MM-dd') : undefined })
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search in descriptions..."
                      value={filters.search || ""}
                      onChange={(e) => applyFilters({ search: e.target.value || undefined })}
                    />
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                    <Button onClick={() => fetchLogs()}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" /> 
              {isExporting ? "Exporting..." : "Export"}
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
            <AlertCircle className="h-4 w-4 mr-2" />
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
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {activityLogs.length} of {totalLogs} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {lastPage}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || currentPage >= lastPage}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityLog;
