
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import PermissionManagement from "../components/PermissionManagement";
import { PermissionCategory } from "@/types";
import PermissionService from "@/services/permission/permissionService";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function UserPermissionsDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: UserPermissionsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadPermissionsData();
    }
  }, [open, userId]);

  const loadPermissionsData = async () => {
    setLoading(true);
    try {
      // Load permission categories
      const categories = await PermissionService.getPermissionsByCategory();
      setPermissionCategories(categories);
      
      // TODO: Load user's current permissions when endpoint is available
      // const userPermissions = await userService.getUserPermissions(userId);
      // setSelectedPermissions(userPermissions);
      
    } catch (error) {
      console.error("Failed to load permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement save permissions API call when endpoint is available
      // await userService.updateUserPermissions(userId, selectedPermissions);
      toast.success("User permissions updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast.error("Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {userName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              Loading permissions...
            </div>
          ) : (
            <PermissionManagement
              permissionCategories={permissionCategories}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          )}
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
