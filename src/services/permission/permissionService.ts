
import ApiService from '../api/base';
import { Permission, PermissionCategory } from '@/types/domain';

class PermissionService {
  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    return await ApiService.get<Permission[]>('/permissions');
  }

  /**
   * Get permissions grouped by category
   */
  static async getPermissionsByCategory(): Promise<PermissionCategory[]> {
    return await ApiService.get<PermissionCategory[]>('/permissions/categories');
  }
}

export default PermissionService;
