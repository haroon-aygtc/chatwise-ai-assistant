
import React from "react";
import { PermissionCategory } from "@/types";
import { usePermissionFilter } from "../hooks/usePermissionFilter";
import { usePermissionToggle } from "../hooks/usePermissionToggle";
import { SearchBar } from "./permission/SearchBar";
import { SelectAllToggle } from "./permission/SelectAllToggle";
import { PermissionTabs } from "./permission/PermissionTabs";
import { PermissionsList, SimplePermissionsList } from "./permission/PermissionsList";

interface PermissionManagementProps {
  permissionCategories: PermissionCategory[];
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
  tabs?: boolean;
}

export function PermissionManagement({
  permissionCategories,
  selectedPermissions,
  onChange,
  tabs = true,
}: PermissionManagementProps) {
  const {
    searchQuery,
    setSearchQuery,
    permissionsByCategory,
    activeCategory,
    setActiveCategory
  } = usePermissionFilter(permissionCategories);

  const {
    allSelected,
    someSelected,
    toggleAllPermissions
  } = usePermissionToggle(permissionCategories, selectedPermissions, onChange);

  return (
    <div className="space-y-4">
      {/* Search and select all */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <SelectAllToggle 
          allSelected={allSelected} 
          someSelected={someSelected} 
          toggleAllPermissions={toggleAllPermissions}
        />
      </div>

      {/* Tabs or simple list */}
      {tabs ? (
        <>
          <PermissionTabs 
            permissionCategories={Object.keys(permissionsByCategory).map(key => ({
              id: key,
              name: key,
              permissions: permissionsByCategory[key]
            }))}
            activeTab={activeCategory}
            setActiveTab={setActiveCategory}
          />
          <PermissionsList
            activeTab={activeCategory}
            permissionsByCategory={permissionsByCategory}
            selectedPermissions={selectedPermissions}
            onChange={onChange}
          />
        </>
      ) : (
        <SimplePermissionsList
          permissionsByCategory={permissionsByCategory}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
        />
      )}
    </div>
  );
}
