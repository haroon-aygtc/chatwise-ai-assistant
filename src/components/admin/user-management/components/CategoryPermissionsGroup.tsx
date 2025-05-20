import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionCategory, Permission } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, CircleSlash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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

  // Count of selected permissions in this category
  const selectedCount = permissions.filter(
    (permission) => selectedPermissions.includes(permission.id) || selectedPermissions.includes(permission.name)
  ).length;

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
    <TooltipProvider>
      <div className="space-y-3 border rounded-lg p-4">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center space-x-2">
            {/* Each child in a flex container needs a key */}
            <Checkbox
              key={`checkbox-${category}`}
              id={`category-${category}`}
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleToggleAll}
              disabled={disabled}
              className="h-5 w-5"
            />
            <label
              key={`label-${category}`}
              htmlFor={`category-${category}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
            >
              {category}
            </label>

            {/* Tooltip also needs a key as it's a child in the flex container */}
            <Tooltip key={`tooltip-${category}`}>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Check this box to select all permissions in this category</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-2">
            {/* Each child in this flex container also needs a key */}
            <Badge
              key={`badge-${category}`}
              variant={allSelected ? "success" : someSelected ? "secondary" : "outline"}
            >
              {selectedCount}/{permissions.length}
            </Badge>
            <Button
              key={`btn-all-${category}`}
              variant="ghost"
              size="sm"
              onClick={() => handleToggleAll(true)}
              disabled={disabled || allSelected}
              className="h-7 px-2 text-xs"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" /> All
            </Button>
            <Button
              key={`btn-none-${category}`}
              variant="ghost"
              size="sm"
              onClick={() => handleToggleAll(false)}
              disabled={disabled || selectedCount === 0}
              className="h-7 px-2 text-xs"
            >
              <CircleSlash className="h-3 w-3 mr-1" /> None
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {permissions.map((permission) => {
            const permId = permission.id || permission.name;
            const isSelected = selectedPermissions.includes(permId);
            return (
              <Tooltip key={`tooltip-${permId}`}>
                <TooltipTrigger asChild>
                  <div className={`flex items-center space-x-2 p-1.5 ${isSelected ? 'bg-secondary/20 rounded-md' : ''}`}>
                    {/* Each child in the flex container needs a key */}
                    <Checkbox
                      key={`checkbox-${permId}`}
                      id={`perm-${permId}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => onTogglePermission(permId, !!checked)}
                      disabled={disabled}
                    />
                    <label
                      key={`label-${permId}`}
                      htmlFor={`perm-${permId}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none cursor-pointer"
                    >
                      {permission.displayName || permission.name}
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="start" key={`tooltip-content-${permId}`}>
                  <p key={`tooltip-text-${permId}`}>{permission.description || "No description available"}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
