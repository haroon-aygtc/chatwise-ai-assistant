
import { Role } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const RoleCard = ({
  role,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: RoleCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{role.name}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {role.userCount || 0} users with this role
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(role)}>
            Edit
          </Button>
        )}
        {canDelete && !role.isSystem && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(role)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
