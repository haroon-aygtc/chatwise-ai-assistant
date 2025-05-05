
import { useState, useEffect } from "react";
import { Role, PermissionCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionManagement } from "./PermissionManagement";

interface PermissionsTabProps {
  roles: Role[];
  permissionCategories: PermissionCategory[];
  isLoadingPermissions: boolean;
  permissionsError: Error | null;
  onSavePermissions: (roleId: string, permissions: string[]) => Promise<boolean>;
  canManagePermissions: boolean;
}

export const PermissionsTab = ({
  roles,
  permissionCategories,
  isLoadingPermissions,
  permissionsError,
  onSavePermissions,
  canManagePermissions,
}: PermissionsTabProps) => {
  const [activeRoleTab, setActiveRoleTab] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // Initialize active tab when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !activeRoleTab) {
      setActiveRoleTab(roles[0].id);
      setSelectedPermissions(roles[0].permissions || []);
    }
  }, [roles, activeRoleTab]);

  // Update selected permissions when changing role
  useEffect(() => {
    if (activeRoleTab && roles.length > 0) {
      const role = roles.find(r => r.id === activeRoleTab);
      if (role) {
        setSelectedPermissions(role.permissions || []);
      }
    }
  }, [activeRoleTab, roles]);

  // Save role permissions
  const saveRolePermissions = async () => {
    if (!activeRoleTab || !canManagePermissions) return;
    
    setIsSavingPermissions(true);
    try {
      await onSavePermissions(activeRoleTab, selectedPermissions);
    } finally {
      setIsSavingPermissions(false);
    }
  };

  return (
    <>
      <CardContent>
        {permissionsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {permissionsError.message || "Failed to load permissions"}
            </AlertDescription>
          </Alert>
        )}

        {isLoadingPermissions ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Loading permissions...
            </p>
          </div>
        ) : permissionCategories.length > 0 ? (
          <Tabs
            value={activeRoleTab}
            onValueChange={setActiveRoleTab}
          >
            <TabsList className="mb-4 w-full flex overflow-auto">
              {roles.map((role) => (
                <TabsTrigger key={role.id} value={role.id} className="flex-shrink-0">
                  {role.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeRoleTab} className="mt-4">
              <PermissionManagement
                permissionCategories={permissionCategories}
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-md">
            <p>No permissions available for configuration.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end gap-2">
        {canManagePermissions && (
          <>
            <Button 
              variant="outline"
              onClick={() => {
                const role = roles.find(r => r.id === activeRoleTab);
                if (role) {
                  setSelectedPermissions(role.permissions || []);
                }
              }}
              disabled={isSavingPermissions}
            >
              Reset Changes
            </Button>
            <Button 
              onClick={saveRolePermissions}
              disabled={isSavingPermissions}
            >
              {isSavingPermissions ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </>
  );
};

export default PermissionsTab;
