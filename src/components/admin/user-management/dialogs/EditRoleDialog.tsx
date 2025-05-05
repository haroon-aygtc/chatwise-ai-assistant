
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { PermissionManagement } from "../components/PermissionManagement";
import { Role, PermissionCategory } from "@/types/ai-configuration";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters",
  }),
  description: z.string().optional(),
});

interface EditRoleDialogProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateRole: (
    id: string,
    name: string,
    description: string,
    permissions: string[]
  ) => Promise<void>;
  permissionCategories: PermissionCategory[];
}

export function EditRoleDialog({
  role,
  open,
  onOpenChange,
  onUpdateRole,
  permissionCategories,
}: EditRoleDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role.name,
      description: role.description || "",
    },
  });

  // Set initial values when role changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: role.name,
        description: role.description || "",
      });
      setSelectedPermissions(role.permissions || []);
    }
  }, [open, role, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onUpdateRole(
        role.id,
        values.name,
        values.description || "",
        selectedPermissions
      );
      toast({
        title: "Role updated",
        description: `Role "${values.name}" has been updated successfully.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update role. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSystemRole = role.isSystem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Edit role details and assigned permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter role name"
                      {...field}
                      disabled={isSystemRole}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this role"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-4">
              <FormLabel className="block mb-2">Permissions</FormLabel>
              <PermissionManagement
                permissionCategories={permissionCategories}
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
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
