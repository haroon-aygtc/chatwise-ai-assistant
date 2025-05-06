
import { useState, useEffect } from "react";
import { PermissionCategory } from "@/types/domain";

export const usePermissionToggle = (
  permissionCategories: PermissionCategory[],
  selectedPermissions: string[],
  onChange: (selectedPermissions: string[]) => void
) => {
  // Calculate the "select all" state
  const allPermissionsCount = permissionCategories.flatMap(
    (category) => category.permissions
  ).length;
  
  const allSelected = selectedPermissions.length === allPermissionsCount;
  
  const someSelected =
    selectedPermissions.length > 0 &&
    selectedPermissions.length < allPermissionsCount;

  // Toggle all permissions
  const toggleAllPermissions = () => {
    // If all permissions are already selected, deselect all
    const allPermissions = permissionCategories.flatMap(
      (category) => category.permissions.map((permission) => permission.id)
    );

    const allAreSelected = allPermissions.every((permission) =>
      selectedPermissions.includes(permission)
    );

    if (allAreSelected) {
      onChange([]);
    } else {
      onChange(allPermissions);
    }
  };

  return {
    allSelected,
    someSelected,
    toggleAllPermissions
  };
};
