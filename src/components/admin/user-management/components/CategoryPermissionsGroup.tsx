
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Permission } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryPermissionsGroupProps {
  category: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
}

export function CategoryPermissionsGroup({
  category,
  permissions,
  selectedPermissions,
  onChange,
}: CategoryPermissionsGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const categoryPermissionIds = permissions.map((p) => p.id);
  const isAllSelected = categoryPermissionIds.every((id) =>
    selectedPermissions.includes(id)
  );
  const isSomeSelected =
    !isAllSelected &&
    categoryPermissionIds.some((id) => selectedPermissions.includes(id));

  const handleCategoryChange = (checked: boolean) => {
    if (checked) {
      // Add all permissions in this category
      const newPermissions = [
        ...selectedPermissions.filter(
          (id) => !categoryPermissionIds.includes(id)
        ),
        ...categoryPermissionIds,
      ];
      onChange(newPermissions);
    } else {
      // Remove all permissions in this category
      onChange(
        selectedPermissions.filter((id) => !categoryPermissionIds.includes(id))
      );
    }
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, id]);
    } else {
      onChange(selectedPermissions.filter((p) => p !== id));
    }
  };

  return (
    <div className="border rounded-md mb-4">
      <div
        className="flex items-center space-x-2 p-3 cursor-pointer hover:bg-accent"
        onClick={toggleExpand}
      >
        <button type="button" className="text-muted-foreground">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <div className="flex-1 flex items-center space-x-2">
          <Checkbox
            id={`category-${category}`}
            checked={isAllSelected}
            onCheckedChange={(checked) => {
              handleCategoryChange(checked as boolean);
            }}
            onClick={(e) => e.stopPropagation()}
            data-state={isSomeSelected ? "indeterminate" : undefined}
          />
          <label
            htmlFor={`category-${category}`}
            className="text-sm font-medium cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {category}
          </label>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 pt-0 pl-9 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-start space-x-2 p-1"
              >
                <Checkbox
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => {
                    handlePermissionChange(permission.id, checked as boolean);
                  }}
                />
                <div>
                  <label
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium cursor-pointer"
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
        </div>
      )}
    </div>
  );
}

export default CategoryPermissionsGroup;
