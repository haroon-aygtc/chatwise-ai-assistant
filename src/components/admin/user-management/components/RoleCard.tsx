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
import { PERMISSION_CATEGORIES, hasPermissionInCategory } from "@/constants/permissions";

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
          {PERMISSION_CATEGORIES.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <Label>{category}</Label>
              {hasPermissionInCategory(role.permissions as string[], category) ? (
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
