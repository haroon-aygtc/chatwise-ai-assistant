import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "../../../../types";
import { handlePermissionChange } from "../../../../utils/helpers";

interface PermissionCheckboxProps {
  permission: Permission;
  checked: boolean;
  setStateFunction: Function;
  currentState: any;
  idPrefix?: string;
}

const PermissionCheckbox = ({
  permission,
  checked,
  setStateFunction,
  currentState,
  idPrefix = "perm",
}: PermissionCheckboxProps) => {
  const id = `${idPrefix}-${permission.id}`;

  return (
    <div className="flex items-center space-x-2 border p-2 rounded-md">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(isChecked) =>
          handlePermissionChange(
            permission.id,
            !!isChecked,
            setStateFunction,
            currentState,
          )
        }
      />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {permission.name}
      </Label>
    </div>
  );
};

export default PermissionCheckbox;
