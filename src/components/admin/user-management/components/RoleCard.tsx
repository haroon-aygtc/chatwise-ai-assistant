import { CheckCircle2, XCircle, Edit, Trash2, Users, Shield, Lock } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canEditSystemRoles?: boolean; // New prop to control if admin can edit system roles
}

const RoleCard = ({
  role,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
  canEditSystemRoles = false, // Default to false - most users can't edit system roles
}: RoleCardProps) => {
  // Calculate permission coverage percentage dynamically based on actual permissions
  // Count how many categories have at least one permission
  const rolePermissions = Array.isArray(role.permissions) ? role.permissions : [];

  // Count total permissions in the system
  let totalSystemPermissions = 0;
  PERMISSION_CATEGORIES.forEach(category => {
    // This would ideally come from your permissions data
    // For now, we're estimating based on what's available in the constants
    totalSystemPermissions += 5; // Assuming average of 5 permissions per category
  });

  // Count how many permissions this role has
  const totalRolePermissions = rolePermissions.length;

  // Calculate coverage percentage
  const coveragePercentage = totalSystemPermissions > 0
    ? Math.min(100, Math.round((totalRolePermissions / totalSystemPermissions) * 100))
    : 0;

  // Calculate category coverage for more detailed display
  const categoryCoverage = PERMISSION_CATEGORIES.map(category => {
    const hasPermission = hasPermissionInCategory(rolePermissions, category);
    return {
      category,
      hasPermission
    };
  });

  // Determine if this is a system role (can't be deleted)
  const isSystemRole = role.name?.toLowerCase() === 'admin' ||
    role.name?.toLowerCase() === 'super admin' ||
    role.isSystem === true ||
    !canDelete;

  // Get appropriate icon color based on coverage
  const getCoverageColor = () => {
    if (coveragePercentage >= 80) return "text-green-500 bg-green-50";
    if (coveragePercentage >= 40) return "text-amber-500 bg-amber-50";
    return "text-red-500 bg-red-50";
  };

  return (
    <Card className={cn(
      "transition-all hover:border-primary/50 hover:shadow-md",
      isSystemRole && "border-primary/30 bg-primary/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-full",
              isSystemRole ? "bg-primary/10" : "bg-muted"
            )}>
              {isSystemRole ? (
                <Shield className="h-4 w-4 text-primary" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <CardTitle>{role.name}</CardTitle>
          </div>
          <Badge className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{role.userCount || 0}</span>
          </Badge>
        </div>
        <CardDescription className="mt-1.5">{role.description || "No description provided"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Permission Coverage</span>
            <Badge variant="outline" className={cn("font-medium", getCoverageColor())}>
              {coveragePercentage}%
            </Badge>
          </div>

          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                coveragePercentage >= 80 ? "bg-green-500" :
                  coveragePercentage >= 40 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {PERMISSION_CATEGORIES.map((category) => {
              const hasPermission = hasPermissionInCategory(role.permissions as string[], category);
              return (
                <div key={category} className={cn(
                  "flex items-center gap-1.5 p-1.5 rounded-md text-xs",
                  hasPermission ? "bg-green-50" : "bg-muted/50"
                )}>
                  {hasPermission ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={cn(
                    "truncate",
                    hasPermission ? "text-green-700" : "text-muted-foreground"
                  )}>
                    {category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        {/* Show edit button if:
            1. User can edit regular roles AND this is not a system role, OR
            2. User can edit system roles AND this is a system role */}
        {((canEdit && !isSystemRole) || (canEditSystemRoles && isSystemRole)) && (
          <Button
            variant="outline"
            className={cn(
              "flex-1 hover:border-primary/30",
              isSystemRole
                ? "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300"
                : "hover:bg-primary/5 hover:text-primary"
            )}
            onClick={() => onEdit(role)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isSystemRole ? "Edit System Role" : "Edit Role"}
          </Button>
        )}

        {/* Only show delete button for non-system roles that can be deleted */}
        {canDelete && !isSystemRole && (
          <Button
            variant="outline"
            className={cn(
              "hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30",
              canEdit ? "flex-none" : "flex-1"
            )}
            onClick={() => onDelete(role)}
          >
            <Trash2 className="h-4 w-4" />
            {!canEdit && <span className="ml-2">Delete Role</span>}
          </Button>
        )}

        {/* System role badge - always show for system roles */}
        {isSystemRole && (
          <div className="text-xs text-amber-600 py-1 px-2 bg-amber-50 border border-amber-200 rounded-md flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            System role
          </div>
        )}

        {/* No permissions message */}
        {!canEdit && !canDelete && !isSystemRole && (
          <div className="text-sm text-muted-foreground py-2">
            You don't have permission to modify this role
          </div>
        )}

        {/* Special message when user can't edit system roles */}
        {isSystemRole && !canEditSystemRoles && canEdit && (
          <div className="text-xs text-muted-foreground py-1 px-2 bg-muted/50 rounded-md">
            Contact administrator to edit system roles
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
