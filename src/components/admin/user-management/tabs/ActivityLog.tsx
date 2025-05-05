import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Calendar, Download, RefreshCw, User, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ActivityLog as ActivityLogType, type ActivityLogParams } from "@/services/activity/activityLogService";
import ActivityLogService from "@/services/activity/activityLogService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper to get action color
const getActionColor = (action: string): string => {
  const actionMap: Record<string, string> = {
    login: "bg-green-500",
    logout: "bg-blue-500",
    "user created": "bg-purple-500",
    "user updated": "bg-amber-500",
    "user deleted": "bg-red-500",
    "role created": "bg-indigo-500",
    "role updated": "bg-cyan-500",
    "role deleted": "bg-rose-500",
    "permissions updated": "bg-teal-500",
    default: "bg-gray-500",
  };

  // Convert to lowercase and check for partial matches
  const lowerAction = action.toLowerCase();
  
  for (const [key, value] of Object.entries(actionMap)) {
    if (lowerAction.includes(key)) {
      return value;
    }
  }
  
  return actionMap.default;
};

// Activity Log List Component
const ActivityLog = () => {
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ActivityLogParams>({
    page: 1,
    per_page: 10,
  });
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [isLoadingActionTypes, setIsLoadingActionTypes] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined
  });

  // Fetch activity logs
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Apply date range filter if set
      const dateFilters: Partial<ActivityLogParams> = {};
      if (dateRange.from) {
        dateFilters.date_from = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange.to) {
        dateFilters.date_to = format(dateRange.to, "yyyy-MM-dd");
      }

      const response = await ActivityLogService.getActivityLogs({
        ...filters,
        ...dateFilters,
      });
      
      setLogs(response.data);
      setTotal(response.total);
      setLastPage(response.last_page);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch action types for filtering
  const fetchActionTypes = async () => {
    setIsLoadingActionTypes(true);
    try {
      const types = await ActivityLogService.getActivityTypes();
      setActionTypes(types);
    } catch (error) {
      console.error("Failed to fetch action types:", error);
    } finally {
      setIsLoadingActionTypes(false);
    }
  };

  // Export logs
  const handleExport = async () => {
    try {
      // Apply date range filter if set
      const dateFilters: Partial<ActivityLogParams> = {};
      if (dateRange.from) {
        dateFilters.date_from = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange.to) {
        dateFilters.date_to = format(dateRange.to, "yyyy-MM-dd");
      }
      
      const blob = await ActivityLogService.exportActivityLogs({
        ...filters,
        ...dateFilters,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `activity-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export activity logs:", error);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      search: e.target.value,
      page: 1, // Reset to first page when searching
    });
  };

  // Handle action type filter
  const handleActionTypeChange = (value: string) => {
    setFilters({
      ...filters,
      action_type: value === "all" ? undefined : value,
      page: 1, // Reset to first page when filtering
    });
  };

  // Handle user filter
  const handleUserFilter = (userId: string) => {
    setFilters({
      ...filters,
      user_id: userId,
      page: 1, // Reset to first page when filtering
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  // Apply filters when they change
  useEffect(() => {
    fetchLogs();
  }, [filters, dateRange]);

  // Fetch action types on component mount
  useEffect(() => {
    fetchActionTypes();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Track and monitor user activities in the system
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchLogs}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activity logs..."
                  className="pl-8"
                  value={filters.search || ""}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex gap-2">
                <Select 
                  value={filters.action_type || "all"} 
                  onValueChange={handleActionTypeChange}
                  disabled={isLoadingActionTypes}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {actionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                >
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Date Range</span>
                    )}
                  </Button>
                </DateRangePicker>
              </div>
            </div>

            {/* Activity Log Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">IP Address</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: filters.per_page || 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {log.user_avatar ? (
                                <AvatarImage src={log.user_avatar} alt={log.user_name} />
                              ) : null}
                              <AvatarFallback>
                                {log.user_name
                                  ? log.user_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{log.user_name || "System"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getActionColor(log.action)} text-white`}
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {log.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {log.ip_address || "N/A"}
                        </TableCell>
                        <TableCell>
                          {formatDate(log.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Filter className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {log.user_id && (
                                <DropdownMenuItem onClick={() => handleUserFilter(log.user_id)}>
                                  <User className="mr-2 h-4 w-4" />
                                  Filter by this user
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleActionTypeChange(log.action)}>
                                Filter by this action
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No activity logs found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {logs.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{Math.min((filters.page || 1) * (filters.per_page || 10) - (filters.per_page || 10) + 1, total)}</strong> to{" "}
                  <strong>{Math.min((filters.page || 1) * (filters.per_page || 10), total)}</strong> of{" "}
                  <strong>{total}</strong> results
                </div>
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
