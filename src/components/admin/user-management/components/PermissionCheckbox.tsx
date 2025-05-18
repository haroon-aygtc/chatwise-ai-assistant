
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { handlePermissionChange } from "@/utils/helpers";

interface PermissionCheckboxProps {
  id: string;
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PermissionCheckbox = ({
  id,
  checked,
  indeterminate,
  onCheckedChange,
  disabled = false,
}: PermissionCheckboxProps) => {
  return (
    <Checkbox
      id={id}
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  );
};

export default PermissionCheckbox;
