
import { useState, useEffect, useCallback } from "react";
import { PermissionCategory } from "@/types";
import { PermissionService } from "@/services/permission";
import { PERMISSION_CATEGORIES } from "@/constants/permissions";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook for managing permissions throughout the application.
 * Provides centralized access to permission data, loading state, and actions.
 */
export function usePermissionManagement() {
  const [permissionCategories, setPermissionCategories] = useState<
    PermissionCategory[]
  >([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [permissionsError, setPermissionsError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch permissions from the API
  const fetchPermissions = useCallback(async () => {
    setIsLoadingPermissions(true);
    setPermissionsError(null);

    try {
      const response = await PermissionService.getPermissionsByCategory();
      setPermissionCategories(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to fetch permissions");
      setPermissionsError(err);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch permissions. Please try again.",
      });

      return [];
    } finally {
      setIsLoadingPermissions(false);
    }
  }, [toast]);

  // Load permissions on initial mount
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Get all permissions as a flat array
  const getAllPermissions = useCallback(() => {
    return permissionCategories.flatMap((category) =>
      category.permissions.map((p) => p.id)
    );
  }, [permissionCategories]);

  // Check if a permission exists
  const hasPermission = useCallback(
    (permissionId: string, permissions: string[]) => {
      return permissions.includes(permissionId);
    },
    []
  );

  // Create a new permission category
  const createPermissionCategory = useCallback(
    async (name: string, description: string) => {
      try {
        // This would call to your API
        // const response = await permissionService.createPermissionCategory({ name, description });
        toast({
          title: "Success",
          description: `Category "${name}" has been created.`,
        });
        await fetchPermissions();
        // return response.data;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create permission category.",
        });
        throw error;
      }
    },
    [fetchPermissions, toast]
  );

  return {
    permissionCategories,
    isLoadingPermissions,
    permissionsError,
    fetchPermissions,
    getAllPermissions,
    hasPermission,
    createPermissionCategory,
    predefinedCategories: PERMISSION_CATEGORIES,
  };
}
