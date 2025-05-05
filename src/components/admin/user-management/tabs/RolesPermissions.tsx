
import { useEffect, useState } from "react";
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
import { RolesCard } from "../components/RolesCard";
import { PermissionManagement } from "../components/PermissionManagement";
import { CreateRoleDialog } from "../dialogs/CreateRoleDialog";
import { EditRoleDialog } from "../dialogs/EditRoleDialog";
import { PermissionCategory, Role } from "@/types/user";
import roleService from "@/services/role/roleService";
import permissionService from "@/services/permission/permissionService";

export function RolesPermissions() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Load roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedRoles, fetchedPermissions] = await Promise.all([
          roleService.getAllRoles(),
          permissionService.getPermissionsByCategory()
        ]);
        setRoles(fetchedRoles);
        setPermissionCategories(fetchedPermissions);
      } catch (error) {
        console.error("Error loading roles and permissions:", error);
        toast({
          title: "Error",
          description: "Failed to load roles and permissions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Handle role creation
  const handleCreateRole = async (name: string, description: string, permissions: string[]) => {
    setIsCreating(true);
    try {
      const newRole = await roleService.createRole({ name, description, permissions });
      setRoles([...roles, newRole]);
      setShowCreateRoleDialog(false);
      toast({
        title: "Success",
        description: `Role "${name}" created successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error creating role:", error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle role update
  const handleUpdateRole = async (id: string, name: string, description: string, permissions: string[]) => {
    try {
      const updatedRole = await roleService.updateRole(id, { name, description, permissions });
      setRoles(roles.map(role => role.id === id ? updatedRole : role));
      setSelectedRole(null);
      setShowEditRoleDialog(false);
      toast({
        title: "Success",
        description: `Role "${name}" updated successfully`,
      });
      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Handle role deletion
  const handleDeleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };
  
  // Filter roles based on search
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Roles & Permissions</CardTitle>
        <CardDescription>
          Manage user roles and their permission sets
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {filteredRoles.map((role) => (
              <RolesCard
                key={role.id}
                role={role}
                onClick={() => {
                  setSelectedRole(role);
                  setShowEditRoleDialog(true);
                }}
                onDelete={() => handleDeleteRole(role.id)}
              />
            ))}
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
          isCreating={isCreating}
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
