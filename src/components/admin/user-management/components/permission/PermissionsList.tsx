
import React from "react";
import { PermissionGroup } from "../PermissionGroup";
import { Permission } from "@/types";

interface PermissionsListProps {
  activeTab: string;
  permissionsByCategory: Record<string, Permission[]>;
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
}

export function PermissionsList({
  activeTab,
  permissionsByCategory,
  selectedPermissions,
  onChange,
}: PermissionsListProps) {
  if (Object.keys(permissionsByCategory).length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No permissions found that match your criteria.
      </div>
    );
  }

  return (
    <div>
      {activeTab === "all" ? (
        Object.keys(permissionsByCategory).map((categoryName) => (
          <PermissionGroup
            key={categoryName}
            categoryId={categoryName}
            categoryName={categoryName}
            permissions={permissionsByCategory[categoryName]}
            selectedPermissions={selectedPermissions}
            onChange={onChange}
          />
        ))
      ) : permissionsByCategory[activeTab] ? (
        <PermissionGroup
          categoryId={activeTab}
          categoryName={activeTab}
          permissions={permissionsByCategory[activeTab]}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
        />
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          No permissions found in this category.
        </div>
      )}
    </div>
  );
}

interface SimplePermissionsListProps {
  permissionsByCategory: Record<string, Permission[]>;
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
}

export function SimplePermissionsList({
  permissionsByCategory,
  selectedPermissions,
  onChange,
}: SimplePermissionsListProps) {
  if (Object.keys(permissionsByCategory).length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No permissions found that match your criteria.
      </div>
    );
  }

  return (
    <div>
      {Object.keys(permissionsByCategory).map((categoryName) => (
        <PermissionGroup
          key={categoryName}
          categoryId={categoryName}
          categoryName={categoryName}
          permissions={permissionsByCategory[categoryName]}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
