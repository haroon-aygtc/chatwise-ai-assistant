
import { useState, useEffect } from "react";
import { PermissionGroup } from "./PermissionGroup";
import { PermissionCategory } from "@/types/user";
import { usePermissionFilter } from "../hooks/usePermissionFilter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface PermissionManagementProps {
  permissionCategories: PermissionCategory[];
  searchQuery?: string;
}

export function PermissionManagement({
  permissionCategories,
  searchQuery = "",
}: PermissionManagementProps) {
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  
  // Map the input data to the correct format if needed
  useEffect(() => {
    // Make sure the data is in the expected format
    const formattedCategories: PermissionCategory[] = permissionCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      permissions: category.permissions,
    }));
    
    setCategories(formattedCategories);
  }, [permissionCategories]);

  // Get filtered categories based on search
  const { filteredCategories } = usePermissionFilter(categories, searchQuery);

  return (
    <div className="space-y-4">
      {filteredCategories.map((category) => (
        <PermissionGroup
          key={category.id}
          title={category.name}
          permissions={category.permissions}
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
