import { CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/types";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const RoleCard = ({
  role,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: RoleCardProps) => {
  // Define the permission categories to display
  const permissionCategories = [
    "User Management",
    "AI Configuration",
    "Widget Builder",
    "Knowledge Base",
    "System Settings",
  ];

  // Helper function to check if role has any permission in a category
  const hasPermissionInCategory = (category: string): boolean => {
    if (!role.permissions) return false;

    switch (category) {
      case "User Management":
        return (
          role.permissions?.some((p) =>
            [
              "create_users",
              "edit_users",
              "delete_users",
              "assign_roles",
            ].includes(p),
          ) || false
        );
      case "AI Configuration":
        return (
          role.permissions?.some((p) =>
            [
              "manage_models",
              "edit_prompts",
              "test_ai",
              "view_ai_logs",
            ].includes(p),
          ) || false
        );
      case "Widget Builder":
        return (
          role.permissions?.some((p) =>
            [
              "create_widgets",
              "edit_widgets",
              "publish_widgets",
              "delete_widgets",
            ].includes(p),
          ) || false
        );
      case "Knowledge Base":
        return (
          role.permissions?.some((p) =>
            [
              "create_kb_articles",
              "edit_kb_articles",
              "delete_kb_articles",
              "manage_kb_categories",
            ].includes(p),
          ) || false
        );
      case "System Settings":
        return (
          role.permissions?.some((p) =>
            [
              "manage_api_keys",
              "billing_subscription",
              "system_backup",
              "view_audit_logs",
            ].includes(p),
          ) || false
        );
      default:
        return false;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{role.name}</CardTitle>
          <Badge>{role.userCount || 0} Users</Badge>
        </div>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {permissionCategories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <Label>{category}</Label>
              {hasPermissionInCategory(category) ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        {canEdit && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(role)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Role
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            className={canEdit ? "flex-none" : "flex-1"}
            onClick={() => onDelete(role)}
          >
            <Trash2 className="h-4 w-4" />
            {!canEdit && <span className="ml-2">Delete Role</span>}
          </Button>
        )}
        {!canEdit && !canDelete && (
          <div className="text-sm text-muted-foreground py-2">
            You don't have permission to modify this role
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
