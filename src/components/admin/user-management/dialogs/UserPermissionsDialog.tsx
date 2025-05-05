
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { PermissionCategory } from "@/types";
import { PermissionManagement } from "../components/PermissionManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserPermissionsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, permissions: string[]) => Promise<void>;
  permissionCategories: PermissionCategory[];
}

export function UserPermissionsDialog({
  user,
  open,
  onOpenChange,
  onSave,
  permissionCategories,
}: UserPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Set initial permissions when dialog opens
  useEffect(() => {
    if (open && user.permissions) {
      setSelectedPermissions(user.permissions);
    }
  }, [open, user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(user.id, selectedPermissions);
      toast({
        title: "Permissions updated",
        description: `Permissions for ${user.name} have been updated successfully.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update permissions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit User Permissions</DialogTitle>
          <DialogDescription>
            Manage permissions for <span className="font-medium">{user.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <PermissionManagement
            permissionCategories={permissionCategories}
            selectedPermissions={selectedPermissions}
            onChange={setSelectedPermissions}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
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
