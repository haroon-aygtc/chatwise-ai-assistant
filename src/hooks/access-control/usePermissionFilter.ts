import { useState, useEffect, useMemo } from "react";
import { PermissionCategory, Permission } from "@/types";

export function usePermissionFilter(
  categories: PermissionCategory[],
  searchQuery: string = ""
) {
  const [filteredCategories, setFilteredCategories] = useState<
    PermissionCategory[]
  >([]);

  // Filter categories and permissions based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();

    // Filter permissions in each category
    const filtered = categories
      .map((category) => {
        // Check if any permission in the category matches the search
        const matchingPermissions = category.permissions.filter(
          (permission) =>
            permission.name.toLowerCase().includes(query) ||
            permission.displayName.toLowerCase().includes(query) ||
            (permission.description &&
              permission.description.toLowerCase().includes(query))
        );

        // If category name matches, include all permissions
        if (category.category.toLowerCase().includes(query)) {
          return { ...category };
        }

        // If some permissions match, return the category with just those permissions
        if (matchingPermissions.length > 0) {
          return {
            ...category,
            permissions: matchingPermissions,
          };
        }

        // No matches in this category
        return null;
      })
      .filter(Boolean) as PermissionCategory[];

    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  return { filteredCategories };
}
