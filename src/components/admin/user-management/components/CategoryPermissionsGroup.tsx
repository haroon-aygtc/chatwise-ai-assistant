
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@/types/user";

export interface CategoryPermissionsGroupProps {
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
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate if all permissions in this category are selected
  const allSelected = permissions.every((permission) =>
    selectedPermissions.includes(permission.id)
  );
  
  // Calculate if some (but not all) permissions in this category are selected
  const someSelected =
    !allSelected &&
    permissions.some((permission) => selectedPermissions.includes(permission.id));

  // Filter permissions based on search query
  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    permission.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (permission.description &&
      permission.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleAll = (checked: boolean) => {
    permissions.forEach((permission) => {
      onTogglePermission(permission.id, checked);
    });
  };

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between space-x-4 rounded-t-md border px-4 py-3">
        <div className="flex items-center space-x-4">
          <Checkbox
            id={`category-${category}`}
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={toggleAll}
            disabled={disabled}
            aria-label={`Select all ${category} permissions`}
          />
          <Label
            htmlFor={`category-${category}`}
            className="text-sm font-medium leading-none cursor-pointer"
          >
            {formatCategoryName(category)}
          </Label>
          <Badge variant="outline" className="ml-2">
            {permissions.length}
          </Badge>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="border border-t-0 rounded-b-md bg-muted/20">
        <div className="p-4">
          <Input
            placeholder="Search permissions..."
            className="mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2">
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-start space-x-2 py-2 px-1 rounded hover:bg-muted/40"
                >
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) =>
                      onTogglePermission(permission.id, checked === true)
                    }
                    disabled={disabled}
                    className="mt-0.5"
                  />
                  <div className="grid gap-1">
                    <Label
                      htmlFor={permission.id}
                      className="font-medium leading-none cursor-pointer"
                    >
                      {permission.displayName || permission.name}
                    </Label>
                    {permission.description && (
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-2 text-muted-foreground">
                No permissions found matching your search
              </p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
