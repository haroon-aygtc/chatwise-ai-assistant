import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleCard from "../components/RoleCard";
import { PermissionManagement } from "../components/PermissionManagement";
import { CreateRoleDialog } from "../dialogs/CreateRoleDialog";
import { EditRoleDialog } from "../dialogs/EditRoleDialog";
import { Role, PermissionCategory } from '@/types';
import { useRoleManagement } from "@/hooks/access-control/useRoleManagement";
import { usePermissionManagement } from "@/hooks/access-control/usePermissionManagement";

const RolesPermissions = () => {
  const { toast } = useToast();
  
  // Use role and permission management hooks
  const { 
    roles, 
    isLoadingRoles, 
    rolesError, 
    fetchRoles, 
    createRole, 
    updateRole, 
    deleteRole 
  } = useRoleManagement();
  
  const {
    permissionCategories,
    isLoadingPermissions,
    permissionsError,
    fetchPermissions
  } = usePermissionManagement();
  
  const [activeTab, setActiveTab] = useState("roles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered roles based on search query
  const filteredRoles = useMemo(() => roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [roles, searchQuery]);

  // Load roles and permissions on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRoles(), fetchPermissions()]);
    };
    
    loadData();
  }, [fetchRoles, fetchPermissions]);

  const handleCreateRole = async (name: string, description: string, permissions: string[]): Promise<boolean> => {
    setIsCreating(true);
    try {
      await createRole(name, description, permissions);
      setShowCreateRoleDialog(false);
      return true;
    } catch (error) {
      // Error is already handled by the hook
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateRole = async (id: string, name: string, description: string, permissions: string[]): Promise<boolean> => {
    setIsUpdating(true);
    try {
      await updateRole(id, name, description, permissions);
      setSelectedRole(null);
      setShowEditRoleDialog(false);
      return true;
    } catch (error) {
      // Error is already handled by the hook
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRole = async (id: string): Promise<boolean> => {
    try {
      await deleteRole(id);
      return true;
    } catch (error) {
      // Error is already handled by the hook
      return false;
    }
  };

  const isLoading = isLoadingRoles || isLoadingPermissions;
  const error = rolesError?.message || permissionsError?.message || null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>
          Manage user roles and their permission sets
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
            {error}
          </div>
        )}
        
        <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center pb-4">
            <TabsList>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            {activeTab === "roles" && (
              <Button onClick={() => setShowCreateRoleDialog(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Role
              </Button>
            )}
          </div>
          
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={activeTab === "roles" ? "Search roles..." : "Search permissions..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabsContent value="roles" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                Loading roles...
              </div>
            ) : filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => {
                    setSelectedRole(role);
                    setShowEditRoleDialog(true);
                  }}
                  onDelete={() => handleDeleteRole(role.id)}
                  canEdit={true}
                  canDelete={true}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                {searchQuery ? "No roles match your search" : "No roles available"}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="permissions">
            <PermissionManagement 
              permissionCategories={permissionCategories} 
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
        
        <CreateRoleDialog
          open={showCreateRoleDialog}
          onOpenChange={setShowCreateRoleDialog}
          permissionCategories={permissionCategories}
          onCreateRole={handleCreateRole}
        />
        
        {selectedRole && (
          <EditRoleDialog
            open={showEditRoleDialog}
            onOpenChange={setShowEditRoleDialog}
            role={selectedRole}
            permissionCategories={permissionCategories}
            onSave={handleUpdateRole}
          />
        )}
      </CardContent>
    </Card>
  );
}

