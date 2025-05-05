import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import RoleCard from "../components/RoleCard";
import PermissionManagement from "./PermissionManagement";
import { CreateRoleDialog } from "../dialogs/CreateRoleDialog";
import { EditRoleDialog } from "../dialogs/EditRoleDialog";
import { DeleteRoleDialog } from "../dialogs/DeleteRoleDialog";
import { Role } from "@/types";
import { useRoles } from "@/hooks/access-control/useRoles";
import { usePermissions } from "@/hooks/access-control/usePermissions";
import { useAuth } from "@/contexts/AuthContext";

const RolesPermissions = () => {
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState("super-admin");

  // Get roles data from API
  const {
    roles,
    isLoading: isLoadingRoles,
    error: rolesError,
    fetchRoles: refreshRoles,
  } = useRoles();

  // Get permissions data from API
  const {
    permissions,
    isLoading: isLoadingPermissions,
    error: permissionsError,
  } = usePermissions();

  // Get auth context for permission checks
  const { hasPermission } = useAuth();

  // Check if user has permission to manage roles
  const canCreateRoles = hasPermission("create_roles");
  const canEditRoles = hasPermission("edit_roles");
  const canDeleteRoles = hasPermission("delete_roles");
  const canManagePermissions = hasPermission("manage_permissions");

  // Fallback to general manage_roles permission if specific permissions aren't defined
  const hasManageRolesPermission = hasPermission("manage_roles");
  const effectiveCanCreateRoles = canCreateRoles || hasManageRolesPermission;
  const effectiveCanEditRoles = canEditRoles || hasManageRolesPermission;
  const effectiveCanDeleteRoles = canDeleteRoles || hasManageRolesPermission;
  const effectiveCanManagePermissions =
    canManagePermissions || hasManageRolesPermission;

  const handleEditRole = (role: Role) => {
    if (!effectiveCanEditRoles) return;
    setSelectedRole(role);
    setShowEditRoleDialog(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (!effectiveCanDeleteRoles) return;
    setSelectedRole(role);
    setShowDeleteRoleDialog(true);
  };

  const handleCreateRoleSuccess = () => {
    setShowCreateRoleDialog(false);
    refreshRoles();
  };

  const handleEditRoleSuccess = () => {
    setShowEditRoleDialog(false);
    refreshRoles();
  };

  const handleDeleteRoleSuccess = () => {
    setShowDeleteRoleDialog(false);
    refreshRoles();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Roles</CardTitle>
              <CardDescription>
                Manage user roles and their descriptions
              </CardDescription>
            </div>
            {effectiveCanCreateRoles && (
              <Button onClick={() => setShowCreateRoleDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Role
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {rolesError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {rolesError.message || "Failed to load roles"}
              </AlertDescription>
            </Alert>
          )}

          {isLoadingRoles ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading roles...</p>
            </div>
          ) : roles && roles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteRole}
                  canEdit={effectiveCanEditRoles}
                  canDelete={effectiveCanDeleteRoles}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              <p>No roles found. Create your first role to get started.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRoles}
            disabled={isLoadingRoles}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoadingRoles ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Permission Management</CardTitle>
          <CardDescription>
            Configure detailed permissions for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {permissionsError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {permissionsError.message || "Failed to load permissions"}
              </AlertDescription>
            </Alert>
          )}

          {isLoadingPermissions ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading permissions...
              </p>
            </div>
          ) : roles && roles.length > 0 ? (
            <Tabs
              value={activeRoleTab || roles[0]?.id}
              onValueChange={setActiveRoleTab}
            >
              <TabsList className="mb-4">
                {roles.map((role) => (
                  <TabsTrigger key={role.id} value={role.id}>
                    {role.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {roles.map((role) => (
                <TabsContent key={role.id} value={role.id}>
                  <PermissionManagement
                    role={role}
                    availablePermissions={
                      permissions || [
                        {
                          id: "view_dashboard",
                          name: "View Dashboard",
                          description: "Can view dashboard",
                          module: "Dashboard",
                        },
                        {
                          id: "manage_users",
                          name: "Manage Users",
                          description: "Can create, edit and delete users",
                          module: "Users",
                        },
                        {
                          id: "view_users",
                          name: "View Users",
                          description: "Can view user list",
                          module: "Users",
                        },
                        {
                          id: "manage_roles",
                          name: "Manage Roles",
                          description: "Can create, edit and delete roles",
                          module: "Access Control",
                        },
                        {
                          id: "create_roles",
                          name: "Create Roles",
                          description: "Can create new roles",
                          module: "Access Control",
                        },
                        {
                          id: "edit_roles",
                          name: "Edit Roles",
                          description: "Can edit existing roles",
                          module: "Access Control",
                        },
                        {
                          id: "delete_roles",
                          name: "Delete Roles",
                          description: "Can delete roles",
                          module: "Access Control",
                        },
                        {
                          id: "view_roles",
                          name: "View Roles",
                          description: "Can view role list",
                          module: "Access Control",
                        },
                        {
                          id: "manage_permissions",
                          name: "Manage Permissions",
                          description: "Can assign permissions to roles",
                          module: "Access Control",
                        },
                        {
                          id: "view_activity_log",
                          name: "View Activity Log",
                          description: "Can view activity logs",
                          module: "System",
                        },
                        {
                          id: "manage_settings",
                          name: "Manage Settings",
                          description: "Can change system settings",
                          module: "System",
                        },
                        {
                          id: "manage_ai_models",
                          name: "Manage AI Models",
                          description: "Can configure AI models",
                          module: "AI Configuration",
                        },
                        {
                          id: "manage_knowledge_base",
                          name: "Manage Knowledge Base",
                          description: "Can manage knowledge base content",
                          module: "AI Configuration",
                        },
                        {
                          id: "manage_prompts",
                          name: "Manage Prompts",
                          description: "Can create and edit prompt templates",
                          module: "AI Configuration",
                        },
                        {
                          id: "manage_response_formatting",
                          name: "Manage Response Formatting",
                          description: "Can configure response formatting",
                          module: "AI Configuration",
                        },
                      ]
                    }
                    canEdit={effectiveCanManagePermissions}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              <p>No roles available for permission management.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          {effectiveCanManagePermissions && (
            <>
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Changes</Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Create Role Dialog */}
      <CreateRoleDialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
        onSuccess={handleCreateRoleSuccess}
        availablePermissions={permissions || []}
        canCreate={effectiveCanCreateRoles}
      />

      {/* Edit Role Dialog */}
      {selectedRole && (
        <EditRoleDialog
          open={showEditRoleDialog}
          onOpenChange={setShowEditRoleDialog}
          role={selectedRole}
          onSuccess={handleEditRoleSuccess}
          availablePermissions={permissions || []}
          canEdit={effectiveCanEditRoles}
        />
      )}

      {/* Delete Role Dialog */}
      {selectedRole && (
        <DeleteRoleDialog
          open={showDeleteRoleDialog}
          onOpenChange={setShowDeleteRoleDialog}
          role={selectedRole}
          onSuccess={handleDeleteRoleSuccess}
          canDelete={effectiveCanDeleteRoles}
        />
      )}
    </>
  );
};

export default RolesPermissions;
