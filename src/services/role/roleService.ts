
import apiService from "../api/api";
import { Role, NewRole, EditedRole } from "@/types/domain";

class RoleService {
  /**
   * Get all roles
   */
  static async getRoles(): Promise<Role[]> {
    return await apiService.get<Role[]>("/roles");
  }

  /**
   * Get a single role by ID
   */
  static async getRole(id: string): Promise<Role> {
    return await apiService.get<Role>(`/roles/${id}`);
  }

  /**
   * Create a new role
   */
  static async createRole(
    roleData: NewRole
  ): Promise<{ role: Role; message: string }> {
    return await apiService.post<{ role: Role; message: string }>(
      "/roles",
      roleData
    );
  }

  /**
   * Update an existing role
   */
  static async updateRole(
    id: string,
    roleData: Partial<EditedRole>
  ): Promise<{ role: Role; message: string }> {
    return await apiService.put<{ role: Role; message: string }>(
      `/roles/${id}`,
      roleData
    );
  }

  /**
   * Delete a role
   */
  static async deleteRole(id: string): Promise<{ message: string }> {
    return await apiService.delete<{ message: string }>(`/roles/${id}`);
  }

  /**
   * Update role permissions
   */
  static async updateRolePermissions(
    id: string,
    permissions: string[]
  ): Promise<{ role: Role; message: string }> {
    // Ensure permissions is an array of strings (names, not IDs)
    const validPermissions = permissions
      .filter(p => p && typeof p === 'string')
      .map(p => p.trim());

    // Log the permissions being sent for debugging
    console.log(`Updating permissions for role ${id}:`, validPermissions);

    try {
      return await apiService.put<{ role: Role; message: string }>(
        `/roles/${id}/permissions`,
        { permissions: validPermissions }
      );
    } catch (error) {
      // Log detailed error information
      if (error.response?.status === 422) {
        console.error('Validation error when updating permissions:', error.response?.data);
      }
      throw error;
    }
  }
}

export default RoleService;
