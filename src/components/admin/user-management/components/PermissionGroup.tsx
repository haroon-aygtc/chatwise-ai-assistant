
import { useState } from 'react';
import { Permission } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

interface PermissionGroupProps {
  category: string;
  permissions: Permission[];
  selectedPermissions: string[];
  onTogglePermission: (permissionId: string, checked: boolean) => void;
  disabled?: boolean;
}

export function PermissionGroup({
  category,
  permissions,
  selectedPermissions,
  onTogglePermission,
  disabled = false,
}: PermissionGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  const allSelected = permissions.every((permission) =>
    selectedPermissions.includes(permission.id)
  );
  
  const someSelected = permissions.some((permission) =>
    selectedPermissions.includes(permission.id)
  ) && !allSelected;

  const handleToggleAll = (checked: boolean) => {
    permissions.forEach((permission) => {
      if (selectedPermissions.includes(permission.id) !== checked) {
        onTogglePermission(permission.id, checked);
      }
    });
  };

  return (
    <div className="mb-4 border rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center p-3 bg-muted/30 rounded-t-lg">
          <CollapsibleTrigger asChild>
            <button
              className="p-1 rounded-md hover:bg-muted/50 mr-2"
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-90' : ''
                }`}
              />
            </button>
          </CollapsibleTrigger>

          <div className="flex-1 flex items-center">
            <Checkbox
              id={`select-all-${category}`}
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleToggleAll}
              disabled={disabled}
              aria-label={`Select all ${category} permissions`}
              className="mr-2 data-[state=indeterminate]:bg-primary"
            />
            <label
              htmlFor={`select-all-${category}`}
              className="text-sm font-medium flex-1 cursor-pointer"
            >
              {category}
            </label>
            <span className="text-xs text-muted-foreground">
              {selectedPermissions.filter((id) =>
                permissions.some((p) => p.id === id)
              ).length}{' '}
              / {permissions.length}
            </span>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-3 pt-2 space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-start">
                <Checkbox
                  id={permission.id}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={(checked) =>
                    onTogglePermission(permission.id, !!checked)
                  }
                  disabled={disabled}
                  className="mt-0.5 mr-2"
                />
                <div className="flex-1">
                  <label
                    htmlFor={permission.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {permission.name}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
