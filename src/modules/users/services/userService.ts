
import ApiService from "@/services/api/base";
import {
  User,
  Role,
  Permission,
  DateRange,
} from "@/types/domain";
import { NewUser, EditedUser } from "@/modules/users/types";

/**
 * Get all users
 */
const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await ApiService.get<{ data: User[] }>("/users");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get user by ID
 */
const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await ApiService.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 */
const createUser = async (userData: NewUser): Promise<User> => {
  try {
    const response = await ApiService.post<{ data: User }>("/users", userData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update an existing user
 */
const updateUser = async (id: string, userData: EditedUser): Promise<User> => {
  try {
    const response = await ApiService.put<{ data: User }>(
      `/users/${id}`,
      userData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user
 */
const deleteUser = async (id: string): Promise<void> => {
  try {
    await ApiService.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

/**
 * Get user permissions
 */
const getUserPermissions = async (id: string): Promise<Permission[]> => {
  try {
    const response = await ApiService.get<{ data: Permission[] }>(
      `/users/${id}/permissions`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching permissions for user ${id}:`, error);
    throw error;
  }
};

/**
 * Update user permissions
 */
const updateUserPermissions = async (
  id: string,
  permissionIds: string[]
): Promise<User> => {
  try {
    const response = await ApiService.put<{ data: User }>(
      `/users/${id}/permissions`,
      { permissions: permissionIds }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating permissions for user ${id}:`, error);
    throw error;
  }
};

/**
 * Get user activity logs
 */
const getUserActivityLogs = async (
  id: string,
  dateRange?: DateRange
): Promise<any[]> => {
  try {
    const params: Record<string, any> = {};
    if (dateRange?.from) {
      params.from = dateRange.from.toISOString().split("T")[0];
      if (dateRange.to) {
        params.to = dateRange.to.toISOString().split("T")[0];
      }
    }

    const response = await ApiService.get<{ data: any[] }>(
      `/users/${id}/activity`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching activity logs for user ${id}:`, error);
    throw error;
  }
};

/**
 * Get all roles
 */
const getAllRoles = async (): Promise<Role[]> => {
  try {
    const response = await ApiService.get<{ data: Role[] }>("/roles");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

/**
 * Assign role to user
 */
const assignRoleToUser = async (
  userId: string,
  roleId: string
): Promise<User> => {
  try {
    const response = await ApiService.post<{ data: User }>(
      `/users/${userId}/roles`,
      { role_id: roleId }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
    throw error;
  }
};

/**
 * Remove role from user
 */
const removeRoleFromUser = async (
  userId: string,
  roleId: string
): Promise<User> => {
  try {
    const response = await ApiService.delete<{ data: User }>(
      `/users/${userId}/roles/${roleId}`
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    throw error;
  }
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserPermissions,
  updateUserPermissions,
  getUserActivityLogs,
  getAllRoles,
  assignRoleToUser,
  removeRoleFromUser,
};

export default userService;
