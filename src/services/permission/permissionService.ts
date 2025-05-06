
import ApiService, { ApiResponse } from '../api/base';
import { Permission, PermissionCategory } from '@/types/domain';

class PermissionService {
  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await ApiService.get<Permission[]>('/permissions');
    return { data: response.data };
  }

  /**
   * Get permissions grouped by category
   */
  static async getPermissionsByCategory(): Promise<ApiResponse<PermissionCategory[]>> {
    const response = await ApiService.get<PermissionCategory[]>('/permissions/categories');
    return { data: response.data };
  }
}

export default PermissionService;
