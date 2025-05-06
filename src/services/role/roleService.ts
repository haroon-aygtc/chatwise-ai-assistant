
import ApiService, { ApiResponse } from '../api/base';
import { Role, NewRole, EditedRole } from '@/types/domain';

class RoleService {
  /**
   * Get all roles
   */
  static async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await ApiService.get<Role[]>('/roles');
    return { data: response.data };
  }

  /**
   * Get a single role by ID
   */
  static async getRole(id: string): Promise<ApiResponse<Role>> {
    const response = await ApiService.get<Role>(`/roles/${id}`);
    return { data: response.data };
  }

  /**
   * Create a new role
   */
  static async createRole(roleData: NewRole): Promise<ApiResponse<{ role: Role; message: string }>> {
    const response = await ApiService.post<{ role: Role; message: string }>('/roles', roleData);
    return { data: response.data };
  }

  /**
   * Update an existing role
   */
  static async updateRole(id: string, roleData: Partial<EditedRole>): Promise<ApiResponse<{ role: Role; message: string }>> {
    const response = await ApiService.put<{ role: Role; message: string }>(`/roles/${id}`, roleData);
    return { data: response.data };
  }

  /**
   * Delete a role
   */
  static async deleteRole(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await ApiService.delete<{ message: string }>(`/roles/${id}`);
    return { data: response.data };
  }

  /**
   * Update role permissions
   */
  static async updateRolePermissions(id: string, permissions: string[]): Promise<ApiResponse<{ role: Role; message: string }>> {
    const response = await ApiService.put<{ role: Role; message: string }>(`/roles/${id}/permissions`, { permissions });
    return { data: response.data };
  }
}

export default RoleService;
