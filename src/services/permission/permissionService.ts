
import ApiService from '../api/api';
import { Permission, PermissionCategory } from '@/types/domain';
import { PERMISSION_ENDPOINTS } from '../api/config';

class PermissionService {
  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    return await ApiService.get<Permission[]>(PERMISSION_ENDPOINTS.PERMISSIONS);
  }

  /**
   * Get permissions grouped by category
   */
  static async getPermissionsByCategory(): Promise<PermissionCategory[]> {
    return await ApiService.get<PermissionCategory[]>(PERMISSION_ENDPOINTS.PERMISSION_CATEGORIES);
  }
}

export default PermissionService;
