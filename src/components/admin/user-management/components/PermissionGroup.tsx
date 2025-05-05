import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PermissionCategory } from "@/types";

interface PermissionGroupProps {
  category: PermissionCategory;
  selectedPermissions: string[];
  setStateFunction: React.Dispatch<React.SetStateAction<any>>;
  currentState: any;
  idPrefix: string;
  disabled?: boolean;
}

const PermissionGroup = ({
  category,
  selectedPermissions,
  setStateFunction,
  currentState,
  idPrefix,
  disabled = false,
}: PermissionGroupProps) => {
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setStateFunction({
        ...currentState,
        permissions: [...selectedPermissions, permissionId],
      });
    } else {
      setStateFunction({
        ...currentState,
        permissions: selectedPermissions.filter((id) => id !== permissionId),
      });
    }
  };

  const allPermissionsSelected = category.permissions.every((permission) =>
    selectedPermissions.includes(permission.id)
  );

  const somePermissionsSelected =
    !allPermissionsSelected &&
    category.permissions.some((permission) =>
      selectedPermissions.includes(permission.id)
    );

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      // Add all permissions from this category
      const permissionsToAdd = category.permissions
        .map((p) => p.id)
        .filter((id) => !selectedPermissions.includes(id));

      setStateFunction({
        ...currentState,
        permissions: [...selectedPermissions, ...permissionsToAdd],
      });
    } else {
      // Remove all permissions from this category
      setStateFunction({
        ...currentState,
        permissions: selectedPermissions.filter(
          (id) => !category.permissions.some((p) => p.id === id)
        ),
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}-${category.category}-all`}
          checked={allPermissionsSelected}
          indeterminate={somePermissionsSelected}
          onCheckedChange={handleSelectAllChange}
          disabled={disabled}
        />
        <Label
          htmlFor={`${idPrefix}-${category.category}-all`}
          className="text-base font-medium"
        >
          {category.category}
        </Label>
      </div>
      <div className="ml-6 space-y-2">
        {category.permissions.map((permission) => (
          <div key={permission.id} className="flex items-start space-x-2">
            <Checkbox
              id={`${idPrefix}-${permission.id}`}
              checked={selectedPermissions.includes(permission.id)}
              onCheckedChange={(checked) =>
                handlePermissionChange(permission.id, checked === true)
              }
              disabled={disabled}
            />
            <div className="grid gap-0.5">
              <Label
                htmlFor={`${idPrefix}-${permission.id}`}
                className="font-medium"
              >
                {permission.name}
              </Label>
              {permission.description && (
                <p className="text-sm text-muted-foreground">
                  {permission.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionGroup;
