
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
import { useToast } from "@/components/ui/use-toast";
import { Role, PermissionCategory } from "@/types/ai-configuration";
import RoleService from "@/services/role/roleService";
import PermissionService from "@/services/permission/permissionService";
import { CreateRoleDialog } from "../dialogs/CreateRoleDialog";
import { EditRoleDialog } from "../dialogs/EditRoleDialog";
import { DeleteRoleDialog } from "../dialogs/DeleteRoleDialog";
import { PermissionManagement } from "../components/PermissionManagement";

// Role card component
const RoleCard = ({ 
  role, 
  onEdit, 
  onDelete, 
  canEdit, 
  canDelete 
}: { 
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

const RolesPermissions = () => {
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [rolesError, setRolesError] = useState<Error | null>(null);
  const [permissionsError, setPermissionsError] = useState<Error | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);
  const { toast } = useToast();

  // Mock permission checks - in a real app, these would come from an auth context
  // TODO: Replace with actual permission checks from your auth system
  const effectiveCanCreateRoles = true;
  const effectiveCanEditRoles = true;
  const effectiveCanDeleteRoles = true;
  const effectiveCanManagePermissions = true;

  // Fetch roles
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    setRolesError(null);
    
    try {
      const rolesData = await RoleService.getRoles();
      setRoles(rolesData);
      
      // Set first role as active if none is selected
      if (rolesData.length > 0 && !activeRoleTab) {
        setActiveRoleTab(rolesData[0].id);
        setSelectedPermissions(rolesData[0].permissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRolesError(error instanceof Error ? error : new Error("Failed to fetch roles"));
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Fetch permissions
  const fetchPermissions = async () => {
    setIsLoadingPermissions(true);
    setPermissionsError(null);
    
    try {
      const permissionsData = await PermissionService.getPermissionsByCategory();
      setPermissionCategories(permissionsData);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setPermissionsError(error instanceof Error ? error : new Error("Failed to fetch permissions"));
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  // Fetch both roles and permissions on initial load
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Update selected permissions when changing role
  useEffect(() => {
    if (activeRoleTab && roles.length > 0) {
      const role = roles.find(r => r.id === activeRoleTab);
      if (role) {
        setSelectedPermissions(role.permissions || []);
      }
    }
  }, [activeRoleTab, roles]);

  // Handle role editing
  const handleEditRole = (role: Role) => {
    if (!effectiveCanEditRoles) return;
    setSelectedRole(role);
    setShowEditRoleDialog(true);
  };

  // Handle role deletion
  const handleDeleteRole = (role: Role) => {
    if (!effectiveCanDeleteRoles) return;
    setSelectedRole(role);
    setShowDeleteRoleDialog(true);
  };

  // Save role permissions
  const saveRolePermissions = async () => {
    if (!activeRoleTab || !effectiveCanManagePermissions) return;
    
    setIsSavingPermissions(true);
    try {
      await RoleService.updateRolePermissions(activeRoleTab, selectedPermissions);
      
      // Update local state
      setRoles(prevRoles => prevRoles.map(role => 
        role.id === activeRoleTab 
          ? { ...role, permissions: selectedPermissions } 
          : role
      ));
      
      toast({
        title: "Permissions updated",
        description: "Role permissions have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update permissions. Please try again.",
      });
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // Create a new role
  const handleCreateRole = async (name: string, description: string, permissions: string[]) => {
    try {
      const response = await RoleService.createRole({
        name,
        description,
        permissions
      });
      
      toast({
        title: "Role created",
        description: `Role "${name}" has been created successfully.`,
      });
      
      fetchRoles();
      return response.role;
    } catch (error) {
      console.error("Failed to create role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create role. Please try again.",
      });
      throw error;
    }
  };

  // Update a role
  const handleUpdateRole = async (id: string, name: string, description: string, permissions: string[]) => {
    try {
      await RoleService.updateRole(id, { name, description });
      await RoleService.updateRolePermissions(id, permissions);
      
      toast({
        title: "Role updated",
        description: `Role "${name}" has been updated successfully.`,
      });
      
      fetchRoles();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role. Please try again.",
      });
      throw error;
    }
  };

  // Delete a role
  const handleDeleteRole = async (id: string) => {
    try {
      await RoleService.deleteRole(id);
      
      toast({
        title: "Role deleted",
        description: "The role has been deleted successfully.",
      });
      
      fetchRoles();
      
      // If the deleted role was active, select another role
      if (activeRoleTab === id && roles.length > 1) {
        const newActiveRole = roles.find(r => r.id !== id);
        if (newActiveRole) {
          setActiveRoleTab(newActiveRole.id);
        }
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete role. Please try again.",
      });
      throw error;
    }
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
              <AlertCircle className="h-4 w-4 mr-2" />
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
          ) : roles.length > 0 ? (
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
            onClick={fetchRoles}
            disabled={isLoadingRoles}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoadingRoles ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardFooter>
      </Card>

      {roles.length > 0 && (
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
                <AlertCircle className="h-4 w-4 mr-2" />
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
            ) : permissionCategories.length > 0 ? (
              <Tabs
                value={activeRoleTab}
                onValueChange={setActiveRoleTab}
              >
                <TabsList className="mb-4 w-full flex overflow-auto">
                  {roles.map((role) => (
                    <TabsTrigger key={role.id} value={role.id} className="flex-shrink-0">
                      {role.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeRoleTab} className="mt-4">
                  <PermissionManagement
                    permissionCategories={permissionCategories}
                    selectedPermissions={selectedPermissions}
                    onChange={setSelectedPermissions}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                <p>No permissions available for configuration.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end gap-2">
            {effectiveCanManagePermissions && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const role = roles.find(r => r.id === activeRoleTab);
                    if (role) {
                      setSelectedPermissions(role.permissions || []);
                    }
                  }}
                  disabled={isSavingPermissions}
                >
                  Reset Changes
                </Button>
                <Button 
                  onClick={saveRolePermissions}
                  disabled={isSavingPermissions}
                >
                  {isSavingPermissions ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Create Role Dialog */}
      <CreateRoleDialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
        onCreateRole={handleCreateRole}
        permissionCategories={permissionCategories}
      />

      {/* Edit Role Dialog */}
      {selectedRole && (
        <EditRoleDialog
          open={showEditRoleDialog}
          onOpenChange={setShowEditRoleDialog}
          role={selectedRole}
          onUpdateRole={handleUpdateRole}
          permissionCategories={permissionCategories}
        />
      )}

      {/* Delete Role Dialog */}
      {selectedRole && (
        <DeleteRoleDialog
          open={showDeleteRoleDialog}
          onOpenChange={setShowDeleteRoleDialog}
          role={selectedRole}
          onSuccess={() => handleDeleteRole(selectedRole.id)}
        />
      )}
    </>
  );
};

export default RolesPermissions;
