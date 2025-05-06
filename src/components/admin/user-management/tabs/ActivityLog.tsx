
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, Filter, Search } from "lucide-react";
import { DateRange } from "@/types/user";
import activityLogService from "@/services/activity/activityLogService";

// Temporary placeholder until ActivityLogTable is implemented
const ActivityLogTable = ({ logs, isLoading, currentPage, totalPages, totalItems, onPageChange }: { 
  logs: any[], 
  isLoading: boolean,
  currentPage: number,
  totalPages: number,
  totalItems: number,
  onPageChange: (page: number) => void
}) => {
  return (
    <div className="p-4 border rounded-md">
      <p className="text-center">Activity Log Table Placeholder</p>
      {isLoading && <p className="text-center">Loading...</p>}
      {!isLoading && logs.length === 0 && <p className="text-center">No logs found</p>}
    </div>
  );
};

// Temporary DatePicker component
const DatePicker = ({ selected, onSelect }: { selected?: Date, onSelect: (date: Date | undefined) => void }) => {
  return (
    <Input 
      type="date" 
      value={selected ? selected.toISOString().split('T')[0] : ''} 
      onChange={(e) => onSelect(e.target.value ? new Date(e.target.value) : undefined)}
    />
  );
};

// Define ActivityLog type
interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

const ActivityLog = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  
  // Filter states
  const [search, setSearch] = useState("");
  const [actionType, setActionType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  
  // Load activity logs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get activity logs with filters
        const params: any = {
          page: currentPage,
          per_page: 20,
          search: search || undefined,
          action_type: actionType !== "all" ? actionType : undefined,
        };
        
        // Add date range if available
        if (dateRange.from) {
          params.from_date = dateRange.from.toISOString().split('T')[0];
        }
        if (dateRange.to) {
          params.to_date = dateRange.to.toISOString().split('T')[0];
        }
        
        const response = await activityLogService.getActivityLogs(params);
        setLogs(response.data);
        setTotalPages(response.last_page);
        setTotalLogs(response.total);
        
        // Get action types for filter
        const types = await activityLogService.getActionTypes();
        setActionTypes(types);
      } catch (error) {
        console.error("Error loading activity logs:", error);
        toast({
          title: "Error",
          description: "Failed to load activity logs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, search, actionType, dateRange, toast]);
  
  // Handle export logs
  const handleExport = async () => {
    try {
      // Export with current filters
      const params: any = {
        search: search || undefined,
        action_type: actionType !== "all" ? actionType : undefined,
      };
      
      // Add date range if available
      if (dateRange.from) {
        params.from_date = dateRange.from.toISOString().split('T')[0];
      }
      if (dateRange.to) {
        params.to_date = dateRange.to.toISOString().split('T')[0];
      }
      
      const blob = await activityLogService.exportActivityLogs(params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Activity logs exported successfully",
      });
    } catch (error) {
      console.error("Error exporting logs:", error);
      toast({
        title: "Error",
        description: "Failed to export activity logs",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              Track user actions and system events
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <ArrowDown className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search activity logs..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="border rounded-md p-4 grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action type" />
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
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker
                selected={dateRange.from}
                onSelect={(date) => setDateRange({ ...dateRange, from: date })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker
                selected={dateRange.to}
                onSelect={(date) => setDateRange({ ...dateRange, to: date })}
              />
            </div>
          </div>
        )}
        
        <Separator />
        
        <ActivityLogTable
          logs={logs}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalLogs}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
