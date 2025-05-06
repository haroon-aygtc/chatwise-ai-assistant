
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRoleManagement } from "@/hooks/access-control/useRoleManagement";
import { Role, PermissionCategory } from "@/types";
import { CreateRoleDialog, DeleteRoleDialog, EditRoleDialog } from "../dialogs";
import RoleCard from "../components/RoleCard";

const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    roles,
    permissionCategories,
    isLoading,
    error,
    refreshRoles,
  } = useRoleManagement();

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditRoleDialog(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteRoleDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateRoleDialog(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading roles...</span>
            </div>
          ) : roles && roles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => handleEditRole(role)}
                  onDelete={() => handleDeleteRole(role)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No roles found. Create your first role to get started.
            </div>
          )}
        </TabsContent>

        <TabsContent value="permissions">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-medium mb-4">Available Permissions</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Loading permissions...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {permissionCategories.map((category: PermissionCategory) => (
                  <div key={category.id} className="space-y-2">
                    <h4 className="font-medium text-md">{category.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="p-2 border rounded-md"
                        >
                          <p className="font-medium">{permission.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {permission.description ||
                              "No description available"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateRoleDialog
        open={showCreateRoleDialog}
        onOpenChange={setShowCreateRoleDialog}
        permissionCategories={permissionCategories}
        onSuccess={refreshRoles}
      />

      {selectedRole && (
        <>
          <EditRoleDialog
            role={selectedRole}
            open={showEditRoleDialog}
            onOpenChange={setShowEditRoleDialog}
            permissionCategories={permissionCategories}
            onSuccess={refreshRoles}
          />
          <DeleteRoleDialog
            role={selectedRole}
            open={showDeleteRoleDialog}
            onOpenChange={setShowDeleteRoleDialog}
            onSuccess={refreshRoles}
          />
        </>
      )}
    </div>
  );
};

export default RolesPermissions;
