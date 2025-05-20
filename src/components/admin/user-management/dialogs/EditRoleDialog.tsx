import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryPermissionsGroup } from "../components/CategoryPermissionsGroup";
import { PermissionCategory, Role } from "@/types";
import { Loader2, Info, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

export interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  permissionCategories: PermissionCategory[];
  onSave: (id: string, name: string, description: string, permissions: string[]) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  permissionCategories,
  onSave,
  isSubmitting = false,
}: EditRoleDialogProps) {
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    Array.isArray(role.permissions) ?
      (typeof role.permissions[0] === 'string' ?
        role.permissions as string[] :
        (role.permissions as any).map((p: any) => p.id || p.name)
      ) : []
  );
  const [activeTab, setActiveTab] = useState("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelectAllDialog, setShowSelectAllDialog] = useState(false);

  // Use external isSubmitting state if provided
  const isSaving = isSubmitting || localSubmitting;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name || "",
      description: role.description || "",
    },
  });

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    setLocalSubmitting(true);
    try {
      const success = await onSave(
        role.id,
        values.name,
        values.description || "",
        selectedPermissions
      );
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  // Handle selecting all permissions across all categories
  const handleSelectAll = () => {
    const allPermissionIds = permissionCategories.flatMap((category) =>
      category.permissions.map((permission) => permission.id)
    );
    setSelectedPermissions(allPermissionIds);
    setShowSelectAllDialog(false);
  };

  // Handle clearing all permissions
  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  // Count selected permissions for badge
  const selectedCount = selectedPermissions.length;
  const totalCount = permissionCategories.reduce(
    (sum, category) => sum + category.permissions.length,
    0
  );

  const isSystemRole = role.isSystem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update role details and permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="details">Role Details</TabsTrigger>
                <TabsTrigger value="permissions" className="relative">
                  Permissions
                  {selectedCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Role name"
                          {...field}
                          disabled={isSystemRole}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear name for this role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Role description"
                          {...field}
                          value={field.value || ""}
                          disabled={isSystemRole}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the purpose of this role
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSystemRole && (
                  <div className="bg-muted/50 p-4 rounded-md flex items-start space-x-2">
                    <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">System Role</p>
                      <p>This is a system-defined role and cannot be edited. You can view its permissions but cannot modify them.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="permissions" className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Manage Permissions</h3>
                  {!isSystemRole && (
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog open={showSelectAllDialog} onOpenChange={setShowSelectAllDialog}>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                  Select All Permissions
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Select All Permissions?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will select all {totalCount} permissions across all categories. This gives complete access to all features and should be used with caution.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleSelectAll}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Grant all permissions to this role</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button variant="outline" size="sm" className="text-xs" onClick={handleClearAll} disabled={selectedCount === 0}>
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions across all categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                    disabled={isSystemRole}
                  />
                </div>

                <div className="space-y-6">
                  {permissionCategories.map((category) => (
                    <CategoryPermissionsGroup
                      key={category.id}
                      category={category.category}
                      permissions={category.permissions}
                      selectedPermissions={selectedPermissions}
                      onTogglePermission={handleTogglePermission}
                      disabled={isSystemRole}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || isSystemRole}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
