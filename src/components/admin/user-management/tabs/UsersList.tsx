import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Edit,
  Key,
  Mail,
  Trash2,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for users
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar?: string;
}

// Mock data for roles
interface Role {
  id: string;
  name: string;
}

// Mock status component
const StatusIcon = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "pending":
        return "bg-amber-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 rounded-full ${getStatusColor()} mr-2`}></div>
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Mock dialogs
const EditUserDialog = ({ user, open, onOpenChange }: { user: User, open: boolean, onOpenChange: (open: boolean) => void }) => {
  return null; // Mock implementation
};

const DeleteUserDialog = ({ user, open, onOpenChange }: { user: User, open: boolean, onOpenChange: (open: boolean) => void }) => {
  return null; // Mock implementation
};

// Helper function for badge variants
const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (role.toLowerCase()) {
    case "admin":
      return "destructive";
    case "manager":
      return "default";
    case "editor":
      return "secondary";
    default:
      return "outline";
  }
};

// Mock constants
const SEARCH_DEBOUNCE_TIME = 300;
const USER_STATUSES_ARRAY = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" }
];

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-06-15T10:30:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "manager",
    status: "active",
    lastActive: "2023-06-14T14:20:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane"
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "editor",
    status: "inactive",
    lastActive: "2023-05-28T09:15:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "user",
    status: "pending",
    lastActive: "2023-06-10T16:45:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "user",
    status: "suspended",
    lastActive: "2023-06-01T11:20:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
  }
];

// Mock roles data
const mockRoles: Role[] = [
  { id: "1", name: "admin" },
  { id: "2", name: "manager" },
  { id: "3", name: "editor" },
  { id: "4", name: "user" }
];

// UsersList component with proper role and status filtering
const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all"); // Default role filter
  const [selectedStatus, setSelectedStatus] = useState("all"); // Default status filter
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<Error | null>(null);

  // Filter users based on search, role, and status
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timeout = setTimeout(() => {
      try {
        let filtered = [...mockUsers];
        
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            user => 
              user.name.toLowerCase().includes(query) || 
              user.email.toLowerCase().includes(query)
          );
        }
        
        // Apply role filter
        if (selectedRole !== "all") {
          filtered = filtered.filter(user => user.role === selectedRole);
        }
        
        // Apply status filter
        if (selectedStatus !== "all") {
          filtered = filtered.filter(user => user.status === selectedStatus);
        }
        
        setFilteredUsers(filtered);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
        setIsLoading(false);
      }
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedRole, selectedStatus]);

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setShowEditUserDialog(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteUserDialog(true);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate refresh
    setTimeout(() => {
      setFilteredUsers([...mockUsers]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUSES_ARRAY.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                title="Refresh users"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-12 w-12 mb-2 animate-spin" />
                      <p>Loading users...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-destructive">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>Error loading users</p>
                      <p className="text-sm">
                        {error.message || "Please try again."}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="mt-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusIcon status={user.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditUserDialog(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteUserDialog(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {mockUsers.length} users
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  isLoading ||
                  (mockUsers.length > 0 && currentPage * 10 >= mockUsers.length)
                }
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {showEditUserDialog && selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={showEditUserDialog}
          onOpenChange={setShowEditUserDialog}
        />
      )}
      {showDeleteUserDialog && selectedUser && (
        <DeleteUserDialog
          user={selectedUser}
          open={showDeleteUserDialog}
          onOpenChange={setShowDeleteUserDialog}
        />
      )}
    </>
  );
};

export default UsersList;
