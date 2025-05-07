
import ApiService from "../api/api";
import { Role, NewRole, EditedRole } from "@/types/domain";

class RoleService {
  /**
   * Get all roles
   */
  static async getRoles(): Promise<Role[]> {
    return await ApiService.get<Role[]>("/roles");
  }

  /**
   * Get a single role by ID
   */
  static async getRole(id: string): Promise<Role> {
    return await ApiService.get<Role>(`/roles/${id}`);
  }

  /**
   * Create a new role
   */
  static async createRole(
    roleData: NewRole
  ): Promise<{ role: Role; message: string }> {
    return await ApiService.post<{ role: Role; message: string }>(
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
    return await ApiService.put<{ role: Role; message: string }>(
      `/roles/${id}`,
      roleData
    );
  }

  /**
   * Delete a role
   */
  static async deleteRole(id: string): Promise<{ message: string }> {
    return await ApiService.delete<{ message: string }>(`/roles/${id}`);
  }

  /**
   * Update role permissions
   */
  static async updateRolePermissions(
    id: string,
    permissions: string[]
  ): Promise<{ role: Role; message: string }> {
    return await ApiService.put<{ role: Role; message: string }>(
      `/roles/${id}/permissions`,
      { permissions }
    );
  }
}

export default RoleService;
