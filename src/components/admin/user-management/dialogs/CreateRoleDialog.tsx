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
import { Loader2, Search, CheckCircle2, CircleSlash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { CategoryPermissionsGroup } from "../components/CategoryPermissionsGroup";
import { PermissionCategory } from "@/types";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Role name must be at least 2 characters",
  }),
  description: z.string().optional(),
});

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRole: (name: string, description: string, permissions: string[]) => Promise<boolean>;
  permissionCategories: PermissionCategory[];
  isSubmitting?: boolean;
  children?: React.ReactNode;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreateRole,
  permissionCategories,
  isSubmitting = false,
  children,
}: CreateRoleDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelectAllDialog, setShowSelectAllDialog] = useState(false);
  const { toast } = useToast();

  // Use external isSubmitting state if provided
  const isCreating = isSubmitting || submitting;

  // Count selected permissions for badge
  const selectedCount = selectedPermissions.length;
  const totalCount = permissionCategories.reduce(
    (sum, category) => sum + category.permissions.length,
    0
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        description: "",
      });
      setSelectedPermissions([]);
      setActiveTab("details");
      setSearchQuery("");
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const success = await onCreateRole(
        values.name,
        values.description || "",
        selectedPermissions
      );

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to create role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create role. Please try again.",
      });
    } finally {
      setSubmitting(false);
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

  const handleTogglePermission = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Add a new role with specific permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="details">Role Details</TabsTrigger>
                <TabsTrigger value="permissions" className="relative">
                  <span>Permissions</span>
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
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter role name" {...field} />
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
              </TabsContent>

              <TabsContent value="permissions" className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Assign Permissions</h3>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialog open={showSelectAllDialog} onOpenChange={setShowSelectAllDialog}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs">
                                <span>Select All Permissions</span>
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
                                <AlertDialogCancel>
                                  <span>Cancel</span>
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleSelectAll}>
                                  <span>Continue</span>
                                </AlertDialogAction>
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
                      <span>Clear All</span>
                    </Button>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search permissions across all categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
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
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Role"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
