
import { useState } from "react";
import { Role, PermissionCategory } from "@/types/domain";
import { RoleService } from "@/services/role";
import { useToast } from "@/components/ui/use-toast";

export function useRoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch roles
  const fetchRoles = async () => {
    setIsLoadingRoles(true);
    setRolesError(null);

    try {
      const response = await RoleService.getRoles();
      setRoles(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRolesError(
        error instanceof Error ? error : new Error("Failed to fetch roles")
      );
      return [];
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Create a new role
  const createRole = async (
    name: string,
    description: string,
    permissions: string[]
  ) => {
    try {
      const response = await RoleService.createRole({
        name,
        description,
        permissions,
      });

      toast({
        title: "Role created",
        description: `Role "${name}" has been created successfully.`,
      });

      await fetchRoles();
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
  const updateRole = async (
    id: string,
    name: string,
    description: string,
    permissions: string[]
  ) => {
    try {
      await RoleService.updateRole(id, { name, description });
      await RoleService.updateRolePermissions(id, permissions);

      toast({
        title: "Role updated",
        description: `Role "${name}" has been updated successfully.`,
      });

      await fetchRoles();
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
  const deleteRole = async (id: string) => {
    try {
      await RoleService.deleteRole(id);

      toast({
        title: "Role deleted",
        description: "The role has been deleted successfully.",
      });

      await fetchRoles();
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

  // Update role permissions
  const updateRolePermissions = async (
    roleId: string,
    permissions: string[]
  ) => {
    try {
      await RoleService.updateRolePermissions(roleId, permissions);

      // Update local state
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === roleId ? { ...role, permissions: permissions } : role
        )
      );

      toast({
        title: "Permissions updated",
        description: "Role permissions have been saved successfully.",
      });

      return true;
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update permissions. Please try again.",
      });
      return false;
    }
  };

  return {
    roles,
    isLoadingRoles,
    rolesError,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    updateRolePermissions,
  };
}
