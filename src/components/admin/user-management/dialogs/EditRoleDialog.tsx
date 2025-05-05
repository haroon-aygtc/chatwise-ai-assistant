import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Role, EditedRole, PermissionCategory } from "../../../../types";
import PermissionGroup from "../components/PermissionGroup";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  availablePermissions: PermissionCategory[];
}

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  availablePermissions,
}: EditRoleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedRole, setEditedRole] = useState<EditedRole>({
    id: role.id,
    name: role.name,
    description: role.description || "",
    permissions: Array.isArray(role.permissions) ? [...role.permissions] : [],
  });

  const handleEditRole = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, this would update the role in the database
      onOpenChange(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Modify role details and permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <div className="space-y-4 py-4 overflow-hidden flex flex-col h-full">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input
                id="edit-role-name"
                placeholder="e.g., Content Manager"
                value={editedRole.name}
                onChange={(e) =>
                  setEditedRole({ ...editedRole, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-description">Description</Label>
              <Textarea
                id="edit-role-description"
                placeholder="Describe the purpose and responsibilities of this role"
                value={editedRole.description}
                onChange={(e) =>
                  setEditedRole({
                    ...editedRole,
                    description: e.target.value,
                  })
                }
                className="resize-none"
              />
            </div>
            <div className="space-y-2 flex-1 overflow-hidden">
              <Label>Permissions</Label>
              <div className="border rounded-md overflow-hidden flex-1">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="p-4 space-y-6">
                    {availablePermissions.map((category) => (
                      <PermissionGroup
                        key={category.category}
                        category={category}
                        selectedPermissions={editedRole.permissions}
                        setStateFunction={setEditedRole}
                        currentState={editedRole}
                        idPrefix={`edit-${role.id}`}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditRole}
            disabled={isSubmitting || !editedRole.name.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
