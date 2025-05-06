
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionCategory, Permission } from "@/types/domain";

interface CategoryPermissionsGroupProps {
  category: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onTogglePermission: (permissionId: string, checked: boolean) => void;
  disabled?: boolean;
}

export function CategoryPermissionsGroup({
  category,
  permissions,
  selectedPermissions,
  onTogglePermission,
  disabled = false,
}: CategoryPermissionsGroupProps) {
  // Check if all permissions in this category are selected
  const allSelected = permissions.every(
    (permission) => selectedPermissions.includes(permission.id) || selectedPermissions.includes(permission.name)
  );

  // Check if some but not all permissions in this category are selected
  const someSelected =
    permissions.some((permission) => selectedPermissions.includes(permission.id) || selectedPermissions.includes(permission.name)) && !allSelected;

  // Handle toggling all permissions in this category
  const handleToggleAll = (checked: boolean) => {
    permissions.forEach((permission) => {
      const permId = permission.id || permission.name;
      const isCurrentlySelected = selectedPermissions.includes(permId);
      if (checked !== isCurrentlySelected) {
        onTogglePermission(permId, checked);
      }
    });
  };

  return (
    <div className="space-y-3 border rounded-lg p-4">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Checkbox
          id={`category-${category}`}
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onCheckedChange={handleToggleAll}
          disabled={disabled}
        />
        <label
          htmlFor={`category-${category}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
        >
          {category}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
        {permissions.map((permission) => {
          const permId = permission.id || permission.name;
          return (
            <div key={permId} className="flex items-center space-x-2">
              <Checkbox
                id={`perm-${permId}`}
                checked={selectedPermissions.includes(permId)}
                onCheckedChange={(checked) => onTogglePermission(permId, !!checked)}
                disabled={disabled}
              />
              <label
                htmlFor={`perm-${permId}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
              >
                {permission.displayName || permission.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
