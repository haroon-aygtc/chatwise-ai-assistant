
import React from "react";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface SelectAllToggleProps {
  allSelected: boolean;
  someSelected: boolean;
  toggleAllPermissions: () => void;
}

export const SelectAllToggle = ({
  allSelected,
  someSelected,
  toggleAllPermissions,
}: SelectAllToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <CustomCheckbox
        checked={allSelected}
        indeterminate={someSelected}
        onCheckedChange={toggleAllPermissions}
      />
      <span className="text-sm">Select All</span>
    </div>
  );
};
