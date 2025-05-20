import { useState } from "react";
import { Check, ChevronsUpDown, CheckCircle2, CircleSlash, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Permission } from "@/types";

export interface PermissionGroupProps {
  categoryId: string;
  categoryName: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
  searchQuery?: string;
}

export function PermissionGroup({
  categoryName,
  permissions,
  searchQuery = "",
  selectedPermissions,
  onChange,
  categoryId,
}: PermissionGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Use the combined search terms
  const effectiveSearchQuery = (searchQuery || localSearchQuery).toLowerCase();

  // Filter permissions based on search query
  const filteredPermissions = effectiveSearchQuery
    ? permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(effectiveSearchQuery) ||
        (permission.displayName && permission.displayName.toLowerCase().includes(effectiveSearchQuery)) ||
        (permission.description &&
          permission.description.toLowerCase().includes(effectiveSearchQuery))
    )
    : permissions;

  // Get count of filtered permissions
  const filteredCount = filteredPermissions.length;
  const totalCount = permissions.length;

  // Check if all permissions in this category are selected
  const allSelected = permissions.every(
    (permission) => selectedPermissions.includes(permission.id)
  );

  // Check if some but not all permissions in this category are selected
  const someSelected =
    permissions.some((permission) => selectedPermissions.includes(permission.id)) && !allSelected;

  // Count of selected permissions in this category
  const selectedCount = permissions.filter(
    (permission) => selectedPermissions.includes(permission.id)
  ).length;

  // Format title for display
  const formatTitle = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  };

  // Toggle all permissions in this category
  const handleToggleAll = (checked: boolean) => {
    let newSelectedPermissions = [...selectedPermissions];

    if (checked) {
      // Add all permissions from this category that aren't already selected
      permissions.forEach(permission => {
        if (!newSelectedPermissions.includes(permission.id)) {
          newSelectedPermissions.push(permission.id);
        }
      });
    } else {
      // Remove all permissions from this category
      newSelectedPermissions = newSelectedPermissions.filter(
        id => !permissions.some(permission => permission.id === id)
      );
    }

    onChange(newSelectedPermissions);
  };

  // Toggle a single permission
  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permissionId]);
    } else {
      onChange(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`category-${categoryId}`}
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={handleToggleAll}
                className="h-5 w-5"
              />
              <label
                htmlFor={`category-${categoryId}`}
                className="text-lg font-semibold cursor-pointer"
              >
                {formatTitle(categoryName)}
              </label>

              <Badge variant={allSelected ? "success" : someSelected ? "secondary" : "outline"}>
                {selectedCount}/{totalCount}
              </Badge>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check this box to select all permissions in this category</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleAll(true)}
                disabled={allSelected}
                className="h-7 px-2 text-xs"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" /> Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleAll(false)}
                disabled={selectedCount === 0}
                className="h-7 px-2 text-xs"
              >
                <CircleSlash className="h-3 w-3 mr-1" /> Clear All
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <Separator />
            {!searchQuery && (
              <div className="p-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission.id);
                  return (
                    <Tooltip key={permission.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`p-2 border rounded-md ${isSelected ? 'bg-secondary/20 border-primary/30' : ''}`}
                          onClick={() => handleTogglePermission(permission.id, !isSelected)}
                        >
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id={`perm-${permission.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleTogglePermission(permission.id, !!checked)}
                              className="mt-0.5"
                            />
                            <div>
                              <label
                                htmlFor={`perm-${permission.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {permission.displayName || permission.name}
                              </label>
                              {permission.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" className="max-w-md">
                        <p>{permission.description || "No description available"}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-4 text-muted-foreground">
                  No permissions match your search
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </TooltipProvider>
  );
}
