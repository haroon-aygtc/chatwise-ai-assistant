import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Role, PermissionCategory } from "../../../../types";

interface PermissionManagementProps {
  role: Role;
  availablePermissions: PermissionCategory[];
}

const PermissionManagement = ({
  role,
  availablePermissions,
}: PermissionManagementProps) => {
  // In a real application, this would update the role's permissions
  // For now, we'll just track the state locally
  const [permissions, setPermissions] = useState<string[]>(role.permissions);

  const hasPermission = (permissionId: string) => {
    return permissions.includes(permissionId);
  };

  const togglePermission = (permissionId: string) => {
    if (hasPermission(permissionId)) {
      setPermissions(permissions.filter((id) => id !== permissionId));
    } else {
      setPermissions([...permissions, permissionId]);
    }
  };

  return (
    <div className="space-y-4">
      {availablePermissions.map((category) => (
        <div key={category.category}>
          <h3 className="text-lg font-medium mb-2">{category.category}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {category.permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <Label htmlFor={`${role.id}-${permission.id}`}>
                  {permission.name}
                </Label>
                <Switch
                  id={`${role.id}-${permission.id}`}
                  checked={hasPermission(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                />
              </div>
            ))}
          </div>
          {category !==
            availablePermissions[availablePermissions.length - 1] && (
            <Separator className="my-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PermissionManagement;
