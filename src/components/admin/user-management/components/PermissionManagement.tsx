
import { useState, useEffect } from "react";
import { PermissionGroup } from "./PermissionGroup";
import { PermissionCategory } from "@/types";
import { usePermissionFilter } from "../../../../hooks/access-control/usePermissionFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface PermissionManagementProps {
  permissionCategories: PermissionCategory[];
  searchQuery?: string;
  selectedPermissions?: string[];
  onPermissionChange?: (selected: string[]) => void;
  onChange?: (selected: string[]) => void;  // Add this prop for backward compatibility
}

export function PermissionManagement({
  permissionCategories,
  searchQuery = "",
  selectedPermissions: initialSelectedPermissions = [],
  onPermissionChange,
  onChange,
}: PermissionManagementProps) {
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialSelectedPermissions);

  // Map the input data to the correct format if needed
  useEffect(() => {
    // Make sure the data is in the expected format
    const formattedCategories: PermissionCategory[] = permissionCategories.map(category => ({
      id: category.id,
      category: category.category,
      permissions: category.permissions,
    }));
    
    setCategories(formattedCategories);
  }, [permissionCategories]);

  // Get filtered categories based on search
  const { filteredCategories } = usePermissionFilter(categories, searchQuery);

  const handlePermissionChange = (selected: string[]) => {
    setSelectedPermissions(selected);
    onPermissionChange?.(selected);
    onChange?.(selected); // Also call onChange for backward compatibility
  };

  return (
    <div className="space-y-4">
      {filteredCategories.map((category) => (
        <PermissionGroup
          key={category.id}
          categoryId={category.id}
          categoryName={category.category}
          permissions={category.permissions}
          selectedPermissions={selectedPermissions}
          onChange={handlePermissionChange}
          searchQuery={searchQuery}
        />
      ))}
      
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? (
            <p>No permissions match your search criteria</p>
          ) : (
            <p>No permission categories available</p>
          )}
        </div>
      )}
    </div>
  );
}
