
import { useState, useEffect } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  ip_address?: string;
  device_info?: string;
}

export const ActivityLog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: ActivityLogItem[] = [
          {
            id: "1",
            action: "Login",
            timestamp: new Date().toISOString(),
            details: "User logged in successfully",
            ip_address: "192.168.1.1",
            device_info: "Chrome on Windows",
          },
          {
            id: "2",
            action: "Password Changed",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            details: "User changed their password",
            ip_address: "192.168.1.1",
            device_info: "Chrome on Windows",
          },
        ];
        setActivityLogs(mockData);
        setTotalPages(3); // Mock total pages
        setIsLoading(false);
      }, 1000);
    };

    fetchActivityLogs();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loading state
              Array(5)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                  </TableRow>
                ))
            ) : activityLogs.length > 0 ? (
              activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{formatDate(log.timestamp)}</TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell>{log.ip_address || "N/A"}</TableCell>
                  <TableCell>{log.device_info || "Unknown"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No activity logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
