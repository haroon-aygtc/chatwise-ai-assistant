
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Permission } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface PermissionGroupProps {
  categoryId: string;
  categoryName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissionIds: string[]) => void;
}

export function PermissionGroup({
  categoryId,
  categoryName,
  permissions,
  selectedPermissions,
  onChange,
}: PermissionGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const allChecked = permissions.every(p => selectedPermissions.includes(p.id));
  const someChecked = !allChecked && permissions.some(p => selectedPermissions.includes(p.id));

  const handleToggleCategory = (checked: boolean) => {
    if (checked) {
      // Add all permissions from this category
      const permissionIds = permissions.map(p => p.id);
      const newSelectedPermissions = [
        ...selectedPermissions.filter(id => !permissionIds.includes(id)),
        ...permissionIds,
      ];
      onChange(newSelectedPermissions);
    } else {
      // Remove all permissions from this category
      const newSelectedPermissions = selectedPermissions.filter(
        id => !permissions.map(p => p.id).includes(id)
      );
      onChange(newSelectedPermissions);
    }
  };

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permissionId]);
    } else {
      onChange(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex items-center space-x-2 mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
          aria-label={isExpanded ? "Collapse category" : "Expand category"}
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`category-${categoryId}`}
              checked={allChecked}
              onCheckedChange={handleToggleCategory}
              aria-label={`Toggle all permissions in ${categoryName}`}
              className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
              data-state={someChecked ? "indeterminate" : undefined}
            />
            <label
              htmlFor={`category-${categoryId}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {categoryName}
            </label>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-9 space-y-3">
          {permissions.map(permission => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={`permission-${permission.id}`}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={(checked) => 
                  handleTogglePermission(permission.id, checked as boolean)
                }
                aria-label={`Toggle permission ${permission.displayName}`}
              />
              <div className="grid gap-1.5">
                <label
                  htmlFor={`permission-${permission.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {permission.displayName}
                </label>
                {permission.description && (
                  <p className="text-xs text-muted-foreground">
                    {permission.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PermissionGroup;
