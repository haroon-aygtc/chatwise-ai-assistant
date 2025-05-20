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
  Shield,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { getRoleBadgeVariant, formatDate } from "@/utils/helpers";
import StatusIcon from "@/components/admin/user-management/components/StatusIcon";
import { EditUserDialog } from "@/components/admin/user-management/dialogs/EditUserDialog";
import { DeleteUserDialog } from "@/components/admin/user-management/dialogs/DeleteUserDialog";
import { ResetPasswordDialog } from "@/components/admin/user-management/dialogs/ResetPasswordDialog";
import { User, Role } from "@/types/domain";

import { useRoles } from "@/hooks/access-control/useRoles";
import { useUsers } from "@/hooks/user-management/useUsers";
import { SEARCH_DEBOUNCE_TIME, USER_STATUSES_ARRAY } from "@/constants";

// Helper function to get the user's primary role name
const getUserRoleName = (user: User): string => {
  // First check if there's a direct role property
  if (user.role) return user.role;

  // Otherwise check the roles array
  if (user.roles && user.roles.length > 0) {
    const primaryRole = user.roles[0];
    // Handle both string roles and role objects
    return typeof primaryRole === 'string'
      ? primaryRole
      : (primaryRole.name || 'Unknown Role');
  }

  // Default if no role information is available
  return 'No Role';
};

// Helper to get all roles from a user as a formatted string
const getAllUserRoles = (user: User): string => {
  if (!user.roles || user.roles.length === 0) {
    return user.role || 'No Roles';
  }

  return user.roles.map(role => {
    if (typeof role === 'string') return role;
    return role.name || 'Unknown';
  }).join(', ');
};

// UsersList component with proper role and status filtering
const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all"); // Default role filter
  const [selectedStatus, setSelectedStatus] = useState("all"); // Default status filter
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Get users data using the useUsers hook
  const {
    users,
    totalUsers,
    currentPage,
    perPage,
    lastPage,
    isLoading,
    error,
    fetchUsers,
    updateQueryParams,
  } = useUsers();

  // Get roles data
  const { roles, isLoading: isLoadingRoles } = useRoles();

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      updateQueryParams({ search: searchQuery || undefined });
    }, SEARCH_DEBOUNCE_TIME);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery, updateQueryParams]);

  // Handle role filter changes
  useEffect(() => {
    updateQueryParams({
      role: selectedRole !== "all" ? selectedRole : undefined,
    });
  }, [selectedRole, updateQueryParams]);

  // Handle status filter changes
  useEffect(() => {
    updateQueryParams({
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    });
  }, [selectedStatus, updateQueryParams]);

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setShowEditUserDialog(true);
  };

  const openDeleteUserDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteUserDialog(true);
  };

  const openResetPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchUsers();
  };

  // Generate avatar fallback text from user name
  const getAvatarFallback = (name?: string): string => {
    if (!name) return "?";

    // Get first letter of first and last name
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }

    // If only one name, return first letter
    return name.charAt(0).toUpperCase();
  };

  return (
    <TooltipProvider>
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
                  {roles &&
                    roles.map((role: { id: string; name: string }) => (
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
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          {user.organization && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {user.organization}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Badge
                              variant={getRoleBadgeVariant(getUserRoleName(user))}
                              className="flex items-center space-x-1"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              <span>{getUserRoleName(user)}</span>
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        {user.roles && user.roles.length > 1 && (
                          <TooltipContent side="right">
                            <div className="font-semibold">All Roles:</div>
                            <div>{getAllUserRoles(user)}</div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <StatusIcon status={user.status} showText={true} />
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDate(user.lastActive, 'relative')}
                        </TooltipTrigger>
                        <TooltipContent>
                          {user.lastActive ?
                            new Date(user.lastActive).toLocaleString() :
                            'Never logged in'
                          }
                        </TooltipContent>
                      </Tooltip>
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
                          <DropdownMenuLabel>
                            Manage User
                          </DropdownMenuLabel>
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
                          <DropdownMenuItem
                            onClick={() => openResetPasswordDialog(user)}
                          >
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
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-8 w-8 mb-2" />
                      <p>No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {users?.length || 0} of {totalUsers || 0} users (Page {currentPage || 1} of {lastPage || 1})
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || currentPage <= 1}
                onClick={() =>
                  updateQueryParams({ page: Math.max(1, currentPage - 1) })
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  isLoading ||
                  !lastPage ||
                  currentPage >= lastPage
                }
                onClick={() => updateQueryParams({ page: currentPage + 1 })}
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
      {showResetPasswordDialog && selectedUser && (
        <ResetPasswordDialog
          user={selectedUser}
          open={showResetPasswordDialog}
          onOpenChange={setShowResetPasswordDialog}
        />
      )}
    </TooltipProvider>
  );
};

export default UsersList;
