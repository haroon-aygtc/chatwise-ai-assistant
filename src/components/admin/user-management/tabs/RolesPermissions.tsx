import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { useRoleManagement } from "@/hooks/access-control/useRoleManagement";
import { usePermissionManagement } from "@/hooks/access-control/usePermissionManagement";
import { Role } from "@/types";
import { CreateRoleDialog, DeleteRoleDialog, EditRoleDialog } from "../dialogs";
import RoleCard from "../components/RoleCard";

const RolesPermissions = () => {
  const [activeTab, setActiveTab] = useState("roles");
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showDeleteRoleDialog, setShowDeleteRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const rolesLoaded = useRef(false);

  // Check if current user has permission to edit system roles
  // This would typically come from your auth context or permissions check
  // For demo purposes, we'll add a toggle button to simulate this permission
  const [canEditSystemRoles, setCanEditSystemRoles] = useState(false);

  // Get roles data
  const {
    roles,
    isLoadingRoles, // Correctly use isLoadingRoles from the hook
    rolesError, // Correctly use rolesError from the hook
    fetchRoles, // Use fetchRoles as the refresh function
    createRole,
    updateRole,
    deleteRole
  } = useRoleManagement();

  // Get permission categories
  const {
    permissionCategories,
    isLoadingPermissions
  } = usePermissionManagement();

  // Use isLoading to combine both loading states
  const isLoading = isLoadingRoles || isLoadingPermissions;
  // Handle error state
  const error = rolesError;

  // Load roles on component mount - only once
  useEffect(() => {
    // Small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      if (!rolesLoaded.current) {
        fetchRoles();
        rolesLoaded.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchRoles]);

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditRoleDialog(true);
  };

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteRoleDialog(true);
  };

  const handleCreateRole = async (
    name: string,
    description: string,
    permissions: string[]
  ) => {
    try {
      await createRole(name, description, permissions);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleUpdateRole = async (
    id: string,
    name: string,
    description: string,
    permissions: string[]
  ) => {
    try {
      await updateRole(id, name, description, permissions);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleDeleteRoleConfirm = async (id: string) => {
    try {
      await deleteRole(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleTabChange = (newTab: string) => {
    // Only change the tab, but don't fetch roles again
    // Use a small delay to prevent any race conditions
    setTimeout(() => {
      setActiveTab(newTab);
    }, 50);
  };

  return (
    <div>
      <div className="bg-card border rounded-lg overflow-hidden mb-6">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Roles & Permissions</h2>
            <p className="text-muted-foreground mt-1">
              Manage roles and their permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle for system role editing permission - only visible in roles tab */}
            {activeTab === "roles" && (
              <div key="system-roles-toggle" className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                <label key="system-roles-label" htmlFor="edit-system-roles" className="text-sm font-medium cursor-pointer">
                  {canEditSystemRoles ? "System roles editable" : "System roles locked"}
                </label>
                <div
                  key="system-roles-switch"
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${canEditSystemRoles ? 'bg-amber-500' : 'bg-gray-200'}`}
                  onClick={() => setCanEditSystemRoles(!canEditSystemRoles)}
                >
                  <span
                    key="system-roles-handle"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${canEditSystemRoles ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </div>
              </div>
            )}
            <Button key="create-role-button" onClick={() => setShowCreateRoleDialog(true)} className="bg-primary hover:bg-primary/90">
              <PlusCircle key="create-role-icon" className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="border-b px-6">
            <TabsList className="bg-transparent -mb-px mt-0 h-12 w-auto">
              <TabsTrigger
                key="roles-tab"
                value="roles"
                className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 h-12 font-medium"
              >
                Roles
              </TabsTrigger>
              <TabsTrigger
                key="permissions-tab"
                value="permissions"
                className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-6 h-12 font-medium"
              >
                Permissions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="roles" className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 key="roles-loader" className="w-8 h-8 animate-spin text-primary" />
                <span key="roles-loading-text" className="ml-2 text-muted-foreground font-medium">Loading roles...</span>
              </div>
            ) : roles && roles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onEdit={() => handleEditRole(role)}
                    onDelete={() => handleDeleteRole(role)}
                    canEditSystemRoles={canEditSystemRoles}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <div className="max-w-md mx-auto">
                  <h3 key="empty-roles-title" className="text-lg font-medium mb-2">No roles found</h3>
                  <p key="empty-roles-description" className="text-muted-foreground mb-4">
                    Create your first role to get started with permission management.
                  </p>
                  <Button key="empty-roles-button" onClick={() => setShowCreateRoleDialog(true)}>
                    <PlusCircle key="empty-roles-icon" className="w-4 h-4 mr-2" />
                    Create Role
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="p-6">
            <div className="bg-card rounded-lg border">
              <div className="border-b p-4">
                <h3 className="text-lg font-medium">Available Permissions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  These permissions can be assigned to roles to control access to different features
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 key="permissions-loader" className="w-8 h-8 animate-spin text-primary" />
                  <span key="permissions-loading-text" className="ml-2 text-muted-foreground font-medium">Loading permissions...</span>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {permissionCategories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center">
                        <h4 key={`cat-name-${category.id}`} className="font-medium text-md">{category.category}</h4>
                        <div key={`cat-count-${category.id}`} className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                          {category.permissions.length} permissions
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.permissions.map((permission) => (
                          <div
                            key={`perm-${permission.id}`}
                            className="p-3 border rounded-md hover:border-primary/30 hover:bg-primary/5 transition-colors"
                          >
                            <p key={`perm-name-${permission.id}`} className="font-medium">{permission.name}</p>
                            <p key={`perm-desc-${permission.id}`} className="text-sm text-muted-foreground mt-1">
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
          onCreateRole={handleCreateRole}
        />

        {selectedRole && (
          <>
            {showEditRoleDialog && (
              <EditRoleDialog
                key={`edit-role-${selectedRole.id}`}
                role={selectedRole}
                open={showEditRoleDialog}
                onOpenChange={setShowEditRoleDialog}
                permissionCategories={permissionCategories}
                onSave={handleUpdateRole}
              />
            )}
            {showDeleteRoleDialog && (
              <DeleteRoleDialog
                key={`delete-role-${selectedRole.id}`}
                role={selectedRole}
                open={showDeleteRoleDialog}
                onOpenChange={setShowDeleteRoleDialog}
                onDelete={() => handleDeleteRoleConfirm(selectedRole.id)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RolesPermissions;
