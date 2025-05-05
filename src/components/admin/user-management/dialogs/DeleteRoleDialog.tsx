import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Role } from "@/types";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onSuccess?: () => void;
  canDelete?: boolean;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
  canDelete = true,
}: DeleteRoleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleDeleteRole = () => {
    // Check if user has permission to delete roles
    if (!canDelete) {
      setPermissionError("You don't have permission to delete roles.");
      return;
    }

    setIsDeleting(true);
    setPermissionError(null);

    // Simulate API call
    setTimeout(() => {
      // In a real implementation, this would delete the role from the database
      onOpenChange(false);
      setIsDeleting(false);
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this role? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {permissionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{permissionError}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <div className="rounded-md bg-muted p-4">
            <h4 className="text-sm font-medium">{role.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {role.description || "No description provided"}
            </p>
            {role.userCount !== undefined && role.userCount > 0 && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This role is currently assigned to {role.userCount}{" "}
                  {role.userCount === 1 ? "user" : "users"}. These users will need
                  to be reassigned to another role.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteRole}
            disabled={isDeleting || !canDelete}
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                Deleting...
              </>
            ) : (
              "Delete Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
