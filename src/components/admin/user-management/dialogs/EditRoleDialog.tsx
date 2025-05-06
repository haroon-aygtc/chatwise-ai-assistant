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
import { Loader2 } from "lucide-react";

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

  const isSystemRole = role.isSystem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              <TabsList>
                <TabsTrigger value="details">Role Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
              </TabsContent>

              <TabsContent value="permissions" className="py-4">
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
                disabled={isSaving || isSystemRole}
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
