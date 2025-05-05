import { useState } from "react";
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

// Mock interfaces
interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: string[];
  userCount?: number;
  isSystem?: boolean;
  createdAt?: string;
}

// Mock components
const RoleCard = ({ role, onEdit, onDelete, canEdit, canDelete }: { 
  role: Role, 
  onEdit: (role: Role) => void, 
  onDelete: (role: Role) => void,
  canEdit: boolean,
  canDelete: boolean
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{role.name}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {role.userCount || 0} users with this role
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
            Edit
          </Button>
        )}
        {canDelete && !role.isSystem && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(role)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const PermissionManagement = ({ role, availablePermissions, canEdit }: {
  role: Role,
  availablePermissions: Permission[],
  canEdit: boolean
}) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configure permissions for the {role.name} role
      </p>
      <div className="border rounded-md p-4">
        <p>Permission management UI would go here</p>
      </div>
    </div>
  );
};

// Mock dialogs
const CreateRoleDialog = ({ open, onOpenChange, onSuccess, availablePermissions, canCreate }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void,
  availablePermissions: Permission[],
  canCreate: boolean
}) => {
  return null; // Mock implementation
};

const EditRoleDialog = ({ open, onOpenChange, role, onSuccess, availablePermissions, canEdit }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  role: Role,
  onSuccess: () => void,
  availablePermissions: Permission[],
  canEdit: boolean
}) => {
  return null; // Mock implementation
};

const DeleteRoleDialog = ({ open, onOpenChange, role, onSuccess, canDelete }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  role: Role,
  onSuccess: () => void,
  canDelete: boolean
}) => {
  return null; // Mock implementation
};

// Mock roles data
const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all system features and settings",
    userCount: 3,
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    permissions: ["view_dashboard", "manage_users", "manage_roles"]
  },
  {
    id: "manager",
    name: "Manager",
    description: "Can manage users and view most system features",
    userCount: 8,
    isSystem: false,
    createdAt: "2023-01-15T00:00:00Z",
    permissions: ["view_dashboard", "view_users", "view_roles"]
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can edit content but has limited administrative access",
    userCount: 12,
    isSystem: false,
    createdAt: "2023-02-01T00:00:00Z",
    permissions: ["view_dashboard", "view_users"]
  },
  {
    id: "user",
    name: "User",
    description: "Basic access to the system",
    userCount: 45,
    isSystem: true,
    createdAt: "2023-01-01T00:00:00Z",
    permissions: ["view_dashboard"]
  }
];

// Mock permissions data
const mockPermissions: Permission[] = [
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
  }
];

const RolesPermissions = () => {
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState("admin");
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [rolesError, setRolesError] = useState<Error | null>(null);
  const [permissionsError, setPermissionsError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);

  // Mock permission checks - in a real app, these would come from an auth context
  const effectiveCanCreateRoles = true;
  const effectiveCanEditRoles = true;
  const effectiveCanDeleteRoles = true;
  const effectiveCanManagePermissions = true;
  
  // Mock refresh function
  const refreshRoles = () => {
    setIsLoadingRoles(true);
    
    // Simulate API delay
    setTimeout(() => {
      setRoles([...mockRoles]);
      setIsLoadingRoles(false);
    }, 800);
  };

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
