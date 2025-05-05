
import { useState } from 'react';
import { Role } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  Edit,
  MoreHorizontal,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
} from 'lucide-react';

interface RolesCardProps {
  roles: Role[];
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  isLoading?: boolean;
}

export function RolesCard({
  roles,
  onCreateRole,
  onEditRole,
  onDeleteRole,
  isLoading = false,
}: RolesCardProps) {
  const [expandedRoles, setExpandedRoles] = useState<string[]>([]);

  const toggleRoleExpanded = (roleId: string) => {
    setExpandedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Roles</CardTitle>
            <CardDescription>
              Manage user roles and their permissions
            </CardDescription>
          </div>
          <Button onClick={onCreateRole} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-320px)] pr-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-pulse space-y-3 w-full">
                <div className="h-12 bg-muted rounded-md w-full"></div>
                <div className="h-12 bg-muted rounded-md w-full"></div>
                <div className="h-12 bg-muted rounded-md w-full"></div>
              </div>
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No roles found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't created any roles yet.
              </p>
              <Button onClick={onCreateRole} variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="border rounded-md">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="mr-2"
                        onClick={() => toggleRoleExpanded(role.id)}
                      >
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedRoles.includes(role.id)
                              ? 'transform rotate-180'
                              : ''
                          }`}
                        />
                      </button>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{role.name}</span>
                          {role.isSystem && (
                            <Badge variant="secondary" className="ml-2">
                              <ShieldAlert className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={role.isSystem}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditRole(role)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {expandedRoles.includes(role.id) && (
                    <div className="p-3 pt-0 border-t">
                      <div className="text-sm">
                        <span className="font-medium">Permissions:</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.map((permission) => (
                              <Badge
                                key={permission.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {permission.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No permissions assigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t py-3 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {roles.length} {roles.length === 1 ? 'role' : 'roles'}
        </span>
      </CardFooter>
    </Card>
  );
}
