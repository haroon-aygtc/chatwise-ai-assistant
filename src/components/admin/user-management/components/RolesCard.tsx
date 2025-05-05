
import { useState } from 'react';
import { Role } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  Edit,
  MoreHorizontal,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
} from 'lucide-react';

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const RoleCard = ({
  role,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: RoleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-lg mr-2">{role.name}</CardTitle>
            {role.isSystem && (
              <Badge variant="secondary" className="text-xs">
                <ShieldAlert className="h-3 w-3 mr-1" />
                System
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={role.isSystem && !canEdit}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(role)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && !role.isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onClick={() => onDelete(role)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between text-sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Permissions</span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </Button>
          
          {isExpanded && (
            <div className="border rounded-md p-2">
              {role.permissions && role.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge 
                      key={permission.id} 
                      variant="outline" 
                      className="text-xs"
                    >
                      {permission.displayName || permission.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
export { RoleCard };
