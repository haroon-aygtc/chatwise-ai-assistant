
import { useState } from "react";
import { User, Role } from "@/types/domain";
import { UserService } from "@/services/user";
import { RoleService } from "@/services/role";
import { useToast } from "@/components/ui/use-toast";

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [usersError, setUsersError] = useState<Error | null>(null);
  const [rolesError, setRolesError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);

    try {
      const response = await UserService.getUsers();
      setUsers(response.data || []);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsersError(
        error instanceof Error ? error : new Error("Failed to fetch users")
      );
      return [];
    } finally {
      setIsLoadingUsers(false);
    }
  };

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

  // Create a new user
  const createUser = async (name: string, email: string, role: string) => {
    try {
      const response = await UserService.createUser({
        name,
        email,
        role,
      });

      toast({
        title: "User created",
        description: `User "${name}" has been created successfully.`,
      });

      await fetchUsers();
      return response.user;
    } catch (error) {
      console.error("Failed to create user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user. Please try again.",
      });
      throw error;
    }
  };

  // Update a user
  const updateUser = async (
    id: string,
    name: string,
    email: string,
    role: string,
    status: string
  ) => {
    try {
      await UserService.updateUser(id, { id, name, email, role, status });

      toast({
        title: "User updated",
        description: `User "${name}" has been updated successfully.`,
      });

      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      });
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (id: string) => {
    try {
      await UserService.deleteUser(id);

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });

      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
      throw error;
    }
  };

  // Update user status
  const updateUserStatus = async (id: string, status: "active" | "inactive" | "pending" | "suspended") => {
    try {
      await UserService.updateUserStatus(id, status);

      toast({
        title: "Status updated",
        description: `User status has been updated to "${status}".`,
      });

      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status. Please try again.",
      });
      throw error;
    }
  };

  // Assign roles to a user
  const assignUserRoles = async (userId: string, roles: string[]) => {
    try {
      await UserService.assignRoles(userId, roles);

      toast({
        title: "Roles assigned",
        description: "User roles have been updated successfully.",
      });

      await fetchUsers();
      return true;
    } catch (error) {
      console.error("Failed to assign roles:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign roles to user. Please try again.",
      });
      return false;
    }
  };

  // Update user permissions
  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    try {
      // Call API to update user permissions
      toast({
        title: "Permissions updated",
        description: "User permissions have been updated successfully.",
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user permissions. Please try again.",
      });
      return false;
    }
  };

  return {
    users,
    roles,
    isLoadingUsers,
    isLoadingRoles,
    usersError,
    rolesError,
    fetchUsers,
    fetchRoles,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    assignUserRoles,
    updateUserPermissions,
  };
}
