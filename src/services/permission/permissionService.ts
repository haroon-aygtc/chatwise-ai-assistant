
import ApiService from '../api/base';
import { Permission, PermissionCategory } from '@/types';

class PermissionService {
  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    return ApiService.get<Permission[]>('/permissions');
  }

  /**
   * Get permissions grouped by category
   */
  static async getPermissionsByCategory(): Promise<PermissionCategory[]> {
    return ApiService.get<PermissionCategory[]>('/permissions/categories');
  }
}

export default PermissionService;
