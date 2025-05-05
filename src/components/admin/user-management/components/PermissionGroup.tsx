
import React, { useState, useEffect } from "react";
import { Permission } from "@/types/ai-configuration";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

interface PermissionGroupProps {
  name: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onChange: (permissionIds: string[]) => void;
  disabled?: boolean;
}

export const PermissionGroup = ({
  name,
  permissions,
  selectedPermissions,
  onChange,
  disabled = false,
}: PermissionGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupState, setGroupState] = useState<{
    checked: boolean;
    indeterminate: boolean;
  }>({
    checked: false,
    indeterminate: false,
  });

  // Calculate the group state based on selected permissions
  useEffect(() => {
    if (!permissions.length) return;
    
    const permissionIds = permissions.map((p) => p.id);
    const selectedCount = permissionIds.filter(id => 
      selectedPermissions.includes(id)
    ).length;
    
    setGroupState({
      checked: selectedCount === permissions.length,
      indeterminate: selectedCount > 0 && selectedCount < permissions.length,
    });
  }, [permissions, selectedPermissions]);

  // Toggle all permissions in this group
  const handleGroupToggle = (checked: boolean) => {
    const permissionIds = permissions.map((p) => p.id);
    
    if (checked) {
      // Add all permissions from this group that aren't already selected
      const newPermissions = [
        ...selectedPermissions,
        ...permissionIds.filter(id => !selectedPermissions.includes(id)),
      ];
      onChange(newPermissions);
    } else {
      // Remove all permissions from this group
      const newPermissions = selectedPermissions.filter(
        id => !permissionIds.includes(id)
      );
      onChange(newPermissions);
    }
  };

  // Toggle individual permission
  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedPermissions, permissionId]);
    } else {
      onChange(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 mb-2">
          <CustomCheckbox
            checked={groupState.checked}
            indeterminate={groupState.indeterminate}
            onCheckedChange={handleGroupToggle}
            disabled={disabled}
          />
          <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary flex-1 text-sm font-medium">
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} 
            />
            {name}
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="ml-7 space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start gap-2">
                <CustomCheckbox
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) => 
                    handlePermissionToggle(permission.id, !!checked)
                  }
                  disabled={disabled}
                />
                <div className="space-y-1">
                  <label 
                    htmlFor={permission.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {permission.name}
                  </label>
                  {permission.description && (
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
