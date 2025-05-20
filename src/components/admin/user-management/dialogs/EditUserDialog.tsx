import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRoles } from "@/hooks/access-control/useRoles";
import { useQueryClient } from "@tanstack/react-query";
import UserService from "@/services/user/userService";

import { User, EditedUser, Role } from "@/types/domain";

// Helper function to get the user's primary role name
const getUserRoleName = (user: User): string => {
  // First check if there's a direct role property
  if (user.role) return user.role;

  // Otherwise check the roles array
  if (user.roles && user.roles.length > 0) {
    const primaryRole = user.roles[0];
    // Handle both string roles and role objects
    return typeof primaryRole === 'string'
      ? primaryRole
      : (primaryRole.name || 'Unknown Role');
  }

  // Default if no role information is available
  return 'No Role';
};

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { roles, isLoading: isLoadingRoles, fetchRoles } = useRoles();

  // Initialize editedUser with the correct role from the user
  const [editedUser, setEditedUser] = useState<EditedUser>({
    id: user.id,
    name: user.name,
    email: user.email,
    role: getUserRoleName(user),
    status: user.status || 'active',
  });

  // Fetch roles when the dialog opens
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open, fetchRoles]);

  const handleEditUser = async () => {
    setIsSubmitting(true);
    try {
      // Call the API to update the user
      await UserService.updateUser(user.id, {
        name: editedUser.name,
        email: editedUser.email,
        status: editedUser.status,
      });

      // If the role has changed, update it separately
      if (editedUser.role !== getUserRoleName(user)) {
        await UserService.assignRoles(user.id, [editedUser.role]);
      }

      // Show success message
      toast({
        title: "User updated",
        description: `User ${editedUser.name} has been updated successfully.`,
      });

      // Invalidate the users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role assignment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input
              id="edit-name"
              placeholder="John Doe"
              value={editedUser.name}
              onChange={(e) =>
                setEditedUser({ ...editedUser, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="john@example.com"
              value={editedUser.email}
              onChange={(e) =>
                setEditedUser({ ...editedUser, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={editedUser.role}
              onValueChange={(value) =>
                setEditedUser({ ...editedUser, role: value })
              }
              disabled={isLoadingRoles}
            >
              <SelectTrigger id="edit-role">
                {isLoadingRoles ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Loading roles...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select role" />
                )}
              </SelectTrigger>
              <SelectContent>
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={typeof role === 'string' ? role : role.name}
                    >
                      {typeof role === 'string' ? role : role.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="user" disabled>
                    No roles available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={editedUser.status}
              onValueChange={(value) =>
                setEditedUser({ ...editedUser, status: value })
              }
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
            onClick={handleEditUser}
            disabled={isSubmitting || !editedUser.name || !editedUser.email || isLoadingRoles}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
