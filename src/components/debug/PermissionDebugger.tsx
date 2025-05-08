import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PermissionDebugger = () => {
  const { user, hasPermission } = useAuth();

  // Check for specific permissions
  const hasAdminPanelAccess = hasPermission('access admin panel');
  const hasAdminPanelAccessUnderscore = hasPermission('access_admin_panel');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Permission Debugger</CardTitle>
        <CardDescription>
          Debug user permissions and role information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">User Information</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>ID:</strong> {user?.id}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Roles</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.roles && Array.isArray(user.roles) && user.roles.map((role, index) => (
              <Badge key={index} variant="outline">
                {typeof role === 'object' && role.name ? role.name : String(role)}
              </Badge>
            ))}
            {(!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) && (
              <p className="text-muted-foreground">No roles assigned</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Permissions</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.permissions && Array.isArray(user.permissions) && user.permissions.map((permission, index) => (
              <Badge key={index} variant="outline">
                {typeof permission === 'object' ? JSON.stringify(permission) : String(permission)}
              </Badge>
            ))}
            {(!user?.permissions || !Array.isArray(user.permissions) || user.permissions.length === 0) && (
              <p className="text-muted-foreground">No permissions assigned</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Critical Permissions Check</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={hasAdminPanelAccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                {hasAdminPanelAccess ? "✓" : "✗"}
              </Badge>
              <span>access admin panel</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={hasAdminPanelAccessUnderscore ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}>
                {hasAdminPanelAccessUnderscore ? "✓" : "✗"}
              </Badge>
              <span>access_admin_panel</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionDebugger;
