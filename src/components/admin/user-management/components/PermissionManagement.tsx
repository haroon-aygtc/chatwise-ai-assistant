import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Role, Permission } from "@/types";
import { Loader2 } from "lucide-react";

interface PermissionManagementProps {
  role: Role;
  availablePermissions: Permission[];
}

const PermissionManagement = ({
  role,
  availablePermissions,
}: PermissionManagementProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    if (!availablePermissions || availablePermissions.length === 0) {
      return {};
    }

    return availablePermissions.reduce<Record<string, Permission[]>>(
      (acc, permission) => {
        const module = permission.module || "General";
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
      },
      {},
    );
  }, [availablePermissions]);

  // Initialize selected permissions based on role
  useEffect(() => {
    if (role && role.permissions) {
      const permissionIds = role.permissions.map((p) => p.id);
      setSelectedPermissions(permissionIds);
    } else {
      setSelectedPermissions([]);
    }
  }, [role]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    }
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleSelectAllInModule = (module: string, checked: boolean) => {
    const modulePermissionIds = permissionsByModule[module].map((p) => p.id);

    if (checked) {
      // Add all permissions from this module that aren't already selected
      const newSelectedPermissions = [
        ...selectedPermissions,
        ...modulePermissionIds.filter(
          (id) => !selectedPermissions.includes(id),
        ),
      ];
      setSelectedPermissions(newSelectedPermissions);
    } else {
      // Remove all permissions from this module
      setSelectedPermissions(
        selectedPermissions.filter((id) => !modulePermissionIds.includes(id)),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{role.name} Permissions</h2>
          <p className="text-sm text-muted-foreground">
            Configure permissions for this role
          </p>
        </div>
        <Button onClick={handleSavePermissions} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Permissions"
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {Object.keys(permissionsByModule).length > 0 ? (
          Object.entries(permissionsByModule).map(([module, permissions]) => (
            <Card key={module} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{module}</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-all-${module}`}
                    checked={
                      permissions.every((p) =>
                        selectedPermissions.includes(p.id),
                      ) && permissions.length > 0
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAllInModule(module, checked === true)
                    }
                  />
                  <Label htmlFor={`select-all-${module}`}>Select All</Label>
                </div>
              </div>
              <Separator className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm font-medium"
                    >
                      {permission.name}
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </Label>
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No permissions available for this role.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionManagement;
