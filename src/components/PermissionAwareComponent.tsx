import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * PermissionAwareComponent - A component that conditionally renders children based on user permissions
 * 
 * Usage examples:
 * 
 * 1. Show content only if user has specific permission:
 * <PermissionAwareComponent requiredPermission="edit_users">
 *   <EditUserButton />
 * </PermissionAwareComponent>
 * 
 * 2. Show content if user has any of multiple permissions:
 * <PermissionAwareComponent requiredPermission={["view_users", "manage_users"]}>
 *   <UserList />
 * </PermissionAwareComponent>
 * 
 * 3. Show content based on role:
 * <PermissionAwareComponent requiredRole="admin">
 *   <AdminPanel />
 * </PermissionAwareComponent>
 * 
 * 4. Show fallback content when permission check fails:
 * <PermissionAwareComponent 
 *   requiredPermission="delete_users"
 *   fallback={<p>You don't have permission to delete users</p>}
 * >
 *   <DeleteUserButton />
 * </PermissionAwareComponent>
 */

interface PermissionAwareComponentProps {
    children: ReactNode;
    requiredPermission?: string | string[];
    requiredRole?: string | string[];
    fallback?: ReactNode;
    showNothing?: boolean; // If true, renders null instead of fallback when permissions fail
}

export const PermissionAwareComponent = ({
    children,
    requiredPermission,
    requiredRole,
    fallback = null,
    showNothing = false,
}: PermissionAwareComponentProps) => {
    const { hasPermission, hasRole } = useAuth();

    // No permission or role requirements - always render
    if (!requiredPermission && !requiredRole) {
        return <>{children}</>;
    }

    // Check permissions
    let hasAccess = true;

    if (requiredPermission) {
        hasAccess = hasPermission(requiredPermission);
    }

    if (hasAccess && requiredRole) {
        hasAccess = hasRole(requiredRole);
    }

    // Render based on permissions
    if (hasAccess) {
        return <>{children}</>;
    }

    // Return fallback or nothing
    return showNothing ? null : <>{fallback}</>;
};

// HOC version for class components
export const withPermissionCheck = (
    WrappedComponent: React.ComponentType<any>,
    options: Omit<PermissionAwareComponentProps, 'children'>
) => {
    return (props: any) => (
        <PermissionAwareComponent {...options}>
            <WrappedComponent {...props} />
        </PermissionAwareComponent>
    );
};

export default PermissionAwareComponent; 