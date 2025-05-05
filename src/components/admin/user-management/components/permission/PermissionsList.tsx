
import React from "react";
import { PermissionCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PermissionGroup } from "../PermissionGroup";
import { TabsContent } from "@/components/ui/tabs";

interface PermissionsListProps {
  activeTab: string;
  filteredCategories: PermissionCategory[];
  selectedPermissions: string[];
  onChange: (permissionIds: string[]) => void;
}

export const PermissionsList = ({
  activeTab,
  filteredCategories,
  selectedPermissions,
  onChange,
}: PermissionsListProps) => {
  return (
    <TabsContent value={activeTab} className="mt-4 space-y-4">
      {filteredCategories.map((category) => (
        <PermissionGroup
          key={category.category}
          name={category.category}
          permissions={category.permissions}
          selectedPermissions={selectedPermissions}
          onChange={onChange}
        />
      ))}
    </TabsContent>
  );
};

export const SimplePermissionsList = ({
  filteredCategories,
  selectedPermissions,
  onChange,
}: Omit<PermissionsListProps, 'activeTab'>) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {filteredCategories.map((category, index) => (
          <React.Fragment key={category.category}>
            <PermissionGroup
              name={category.category}
              permissions={category.permissions}
              selectedPermissions={selectedPermissions}
              onChange={onChange}
            />
            {index < filteredCategories.length - 1 && (
              <Separator className="my-4" />
            )}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
