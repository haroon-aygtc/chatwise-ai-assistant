import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/types";
import { CreateRoleDialog } from "../dialogs/CreateRoleDialog";
import { EditRoleDialog } from "../dialogs/EditRoleDialog";
import { DeleteRoleDialog } from "../dialogs/DeleteRoleDialog";
import { useRoleManagement } from "../hooks/useRoleManagement";
import { usePermissionManagement } from "../hooks/usePermissionManagement";
import RolesList from "../components/RolesList";
import PermissionsTab from "../components/PermissionsTab";

const RolesPermissions = () => {
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Custom hooks for role and permission management
  const {
    roles,
    isLoadingRoles,
    rolesError,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions
  } = useRoleManagement();

  const {
    permissionCategories,
    isLoadingPermissions,
    permissionsError,
    fetchPermissions
  } = usePermissionManagement();

  // Mock permission checks - in a real app, these would come from an auth context
  // TODO: Replace with actual permission checks from your auth system
  const effectiveCanCreateRoles = true;
  const effectiveCanEditRoles = true;
  const effectiveCanDeleteRoles = true;
  const effectiveCanManagePermissions = true;

  // Fetch both roles and permissions on initial load
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

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

  // Execute role deletion
  const executeRoleDeletion = async (id: string) => {
    await deleteRole(id);
  };

  // Update only the onCreateRole function to make it return void:
  const handleCreateRole = async (
    name: string,
    description: string,
    permissions: string[]
  ): Promise<void> => {
    try {
      setIsCreating(true);
      await roleService.createRole(name, description, permissions);
      toast({
        title: 'Role created',
        description: `Role "${name}" has been created successfully.`,
      });
      fetchRoles();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Failed to create role',
        description: 'There was an error creating the role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
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
        <RolesList
          roles={roles}
          isLoading={isLoadingRoles}
          error={rolesError}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onRefresh={fetchRoles}
          canEdit={effectiveCanEditRoles}
          canDelete={effectiveCanDeleteRoles}
        />
      </Card>

      {roles.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Permission Management</CardTitle>
            <CardDescription>
              Configure detailed permissions for each role
            </CardDescription>
          </CardHeader>
          <PermissionsTab
            roles={roles}
            permissionCategories={permissionCategories}
            isLoadingPermissions={isLoadingPermissions}
            permissionsError={permissionsError}
            onSavePermissions={updateRolePermissions}
            canManagePermissions={effectiveCanManagePermissions}
          />
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
          onUpdateRole={updateRole}
          permissionCategories={permissionCategories}
        />
      )}

      {/* Delete Role Dialog */}
      {selectedRole && (
        <DeleteRoleDialog
          open={showDeleteRoleDialog}
          onOpenChange={setShowDeleteRoleDialog}
          role={selectedRole}
          onSuccess={() => executeRoleDeletion(selectedRole.id)}
        />
      )}
    </>
  );
};

export default RolesPermissions;
