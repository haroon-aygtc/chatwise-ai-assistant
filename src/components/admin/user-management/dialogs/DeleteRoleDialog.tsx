
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
import { Role } from "@/types";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onDelete: (id: string) => Promise<boolean>;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  role,
  onDelete,
}: DeleteRoleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await onDelete(role.id);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Role
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role "{role.name}"? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {role.isSystem ? (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm">
              This is a system role and cannot be deleted.
            </div>
          ) : (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm dark:bg-yellow-900/20 dark:border-yellow-800">
              Deleting this role will remove all associated permissions. Users with
              this role will need to be assigned a new role.
            </div>
          )}
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
            onClick={handleDelete}
            disabled={isDeleting || role.isSystem}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
