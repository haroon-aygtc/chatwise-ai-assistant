
import { useState, useEffect } from "react";
import { PermissionCategory } from "@/types";
import PermissionService from "@/services/permission/permissionService";

export function usePermissionManagement() {
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState<Error | null>(null);

  // Fetch permissions
  const fetchPermissions = async () => {
    setIsLoadingPermissions(true);
    setPermissionsError(null);
    
    try {
      const permissionsData = await PermissionService.getPermissionsByCategory();
      setPermissionCategories(permissionsData);
      return permissionsData;
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setPermissionsError(error instanceof Error ? error : new Error("Failed to fetch permissions"));
      return [];
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  return {
    permissionCategories,
    isLoadingPermissions,
    permissionsError,
    fetchPermissions,
  };
}
