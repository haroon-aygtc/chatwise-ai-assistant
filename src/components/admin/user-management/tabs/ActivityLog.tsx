
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "@/types/domain";
import { format } from "date-fns";
import { CalendarIcon, RefreshCw, Search } from "lucide-react";

const ActivityLog = () => {
  const [activityType, setActivityType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  
  // This should take a DateRange type, not use SetStateAction
  const handleDateSelection = (range: DateRange) => {
    if (range.from) {
      setDate({
        from: range.from,
        to: range.to || range.from,
      });
    }
  };

  const activities = [
    {
      id: "1",
      user: "John Doe",
      action: "User login",
      timestamp: "2023-09-10T14:23:01Z",
      details: "Logged in from 192.168.1.101",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Updated role",
      timestamp: "2023-09-10T13:15:22Z",
      details: "Changed role from Editor to Manager for user Mark Johnson",
    },
    {
      id: "3",
      user: "Admin",
      action: "System update",
      timestamp: "2023-09-09T23:51:44Z",
      details: "Updated system settings - chat retention policy",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="user">User Changes</SelectItem>
                <SelectItem value="role">Role Updates</SelectItem>
                <SelectItem value="system">System Updates</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelection}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              title="Refresh activities"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="bg-muted/50 p-3 grid grid-cols-12 font-medium">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Action</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-5">Details</div>
          </div>
          {activities.length > 0 ? (
            <div className="divide-y">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 grid grid-cols-12 hover:bg-muted/50"
                >
                  <div className="col-span-3">{activity.user}</div>
                  <div className="col-span-2">{activity.action}</div>
                  <div className="col-span-2">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                  <div className="col-span-5">{activity.details}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No activity records found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
