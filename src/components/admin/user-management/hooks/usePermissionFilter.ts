
import { useState, useEffect } from "react";
import { PermissionCategory } from "@/types";

export const usePermissionFilter = (permissionCategories: PermissionCategory[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<PermissionCategory[]>(permissionCategories);
  const [activeTab, setActiveTab] = useState("all");

  // Filter permissions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(permissionCategories);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = permissionCategories.map((category) => {
      const matchingPermissions = category.permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(lowercaseQuery) ||
          (permission.description && permission.description.toLowerCase().includes(lowercaseQuery))
      );

      return {
        ...category,
        permissions: matchingPermissions,
      };
    }).filter((category) => category.permissions.length > 0);

    setFilteredCategories(filtered);
  }, [searchQuery, permissionCategories]);

  // Filter categories by active tab
  useEffect(() => {
    if (activeTab === "all") {
      if (searchQuery.trim() === "") {
        setFilteredCategories(permissionCategories);
      }
      return;
    }

    const categoryId = activeTab;
    const filtered = permissionCategories.filter(
      (category) => category.category === categoryId
    );

    setFilteredCategories(filtered);
  }, [activeTab, permissionCategories, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    activeTab,
    setActiveTab
  };
};
