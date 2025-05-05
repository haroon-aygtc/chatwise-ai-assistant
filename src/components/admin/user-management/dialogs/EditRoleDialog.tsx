
import { useEffect, useState } from 'react';
import { Permission, Role } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { CategoryPermissionsGroup } from '../components/CategoryPermissionsGroup';

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
  onSave: (name: string, description: string, permissions: string[]) => Promise<void>;
  isLoading?: boolean;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSave,
  isLoading = false,
}: EditRoleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setSelectedPermissions(
        role.permissions ? role.permissions.map((p) => p.id) : []
      );
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions([]);
    }
    setNameError('');
  }, [role, open]);

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setNameError('Role name is required');
      return;
    }
    
    await onSave(name, description, selectedPermissions);
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {}
  );

  // Sort categories
  const sortedCategories = Object.keys(permissionsByCategory).sort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {role ? `Edit ${role.name} Role` : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {role && role.isSystem
                ? 'System roles have predefined permissions and limited customization.'
                : 'Define the role name and assign permissions.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setNameError('');
                }}
                placeholder="Enter role name"
                disabled={isLoading || (role?.isSystem ?? false)}
                aria-invalid={!!nameError}
              />
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter role description"
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4">
                <div className="space-y-4">
                  {sortedCategories.map((category) => (
                    <CategoryPermissionsGroup
                      key={category}
                      category={category}
                      permissions={permissionsByCategory[category]}
                      selectedPermissions={selectedPermissions}
                      onTogglePermission={handleTogglePermission}
                      disabled={isLoading || (role?.isSystem ?? false)}
                    />
                  ))}
                </div>
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {selectedPermissions.length} permissions selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (role?.isSystem ?? false)}>
              {isLoading ? 'Saving...' : 'Save Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
