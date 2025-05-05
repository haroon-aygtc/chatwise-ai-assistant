
import { useState, useEffect } from "react";
import { PermissionGroup } from "./PermissionGroup";
import { PermissionCategory, Permission } from "@/types/ai-configuration";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PermissionManagementProps {
  selectedPermissions: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  permissionCategories: PermissionCategory[];
}

export const PermissionManagement = ({
  selectedPermissions,
  onChange,
  permissionCategories
}: PermissionManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<PermissionCategory[]>([]);

  // Group permissions by module/category if not already grouped
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(permissionCategories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = permissionCategories
      .map(category => {
        // Filter permissions within each category
        const filteredPermissions = category.permissions.filter(
          permission =>
            permission.name.toLowerCase().includes(query) ||
            (permission.description && permission.description.toLowerCase().includes(query)) ||
            (permission.module && permission.module.toLowerCase().includes(query))
        );

        // Return category with filtered permissions if any match
        return filteredPermissions.length > 0
          ? { ...category, permissions: filteredPermissions }
          : null;
      })
      .filter(Boolean) as PermissionCategory[];

    setFilteredCategories(filtered);
  }, [searchQuery, permissionCategories]);

  // Handle select all permissions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Get all permission IDs from all categories
      const allPermissionIds = permissionCategories.flatMap(category =>
        category.permissions.map(permission => permission.id)
      );
      onChange(allPermissionIds);
    } else {
      onChange([]);
    }
  };

  // Calculate if all permissions are selected
  const allSelected = permissionCategories.every(category =>
    category.permissions.every(permission => selectedPermissions.includes(permission.id))
  );

  // Calculate if some permissions are selected
  const someSelected =
    selectedPermissions.length > 0 &&
    !permissionCategories.every(category =>
      category.permissions.every(permission => selectedPermissions.includes(permission.id))
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <CustomCheckbox
            id="select-all-permissions"
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all-permissions"
            className="text-sm font-medium cursor-pointer"
          >
            Select All Permissions
          </label>
        </div>

        <div className="space-y-2">
          {filteredCategories.map((category) => (
            <PermissionGroup
              key={category.name}
              name={category.name}
              permissions={category.permissions}
              selectedPermissions={selectedPermissions}
              onChange={onChange}
            />
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No permissions match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
