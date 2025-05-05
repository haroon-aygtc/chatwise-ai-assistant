
import React from "react";
import { PermissionCategory } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PermissionTabsProps {
  permissionCategories: PermissionCategory[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PermissionTabs = ({
  permissionCategories,
  activeTab,
  setActiveTab,
}: PermissionTabsProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full flex overflow-auto">
        <TabsTrigger value="all" className="flex-shrink-0">
          All Permissions
        </TabsTrigger>
        {permissionCategories.map((category) => (
          <TabsTrigger
            key={category.category}
            value={category.category}
            className="flex-shrink-0"
          >
            {category.category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
