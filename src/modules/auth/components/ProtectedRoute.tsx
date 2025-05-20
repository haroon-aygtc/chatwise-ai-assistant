import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string | string[];
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission, refreshAuth, user } = useAuth();
  const location = useLocation();

  // Only refresh auth if we're authenticated but missing the user data or if token needs refresh
  useEffect(() => {
    // Only refresh if authenticated but missing crucial data (like permissions)
    const needsRefresh = isAuthenticated && (
      !user ||
      (user.permissions && user.permissions.length === 0 && (requiredPermission || requiredRole))
    );

    if (needsRefresh) {
      if (DEBUG) console.log("ProtectedRoute: Auth data incomplete, refreshing");
      refreshAuth();
    } else if (DEBUG) {
      console.log("ProtectedRoute: No need to refresh auth data");
    }
  }, [isAuthenticated, user, requiredRole, requiredPermission, refreshAuth]);

  // Add debug logging to help diagnose issues
  useEffect(() => {
    if (DEBUG) {
      const hasRequiredRole = requiredRole
        ? hasRole(requiredRole) ? 'Yes' : 'No'
        : 'Not Required';

      const hasRequiredPermission = requiredPermission
        ? hasPermission(requiredPermission) ? 'Yes' : 'No'
        : 'Not Required';

      console.log("ProtectedRoute Debug:", {
        isAuthenticated,
        userId: user?.id,
        permissionsCount: user?.permissions?.length || 0,
        requiredRole,
        requiredPermission,
        hasRequiredRole,
        hasRequiredPermission,
        path: location.pathname
      });
    }
  }, [isAuthenticated, user, requiredRole, requiredPermission, hasRole, hasPermission, location.pathname]);

  if (isLoading) {
    if (DEBUG) console.log("ProtectedRoute: Still loading auth state");
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    if (DEBUG) console.log(`ProtectedRoute: Not authenticated, redirecting to ${redirectTo}`);

    // Store the current URL to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);

    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (DEBUG) console.log(`ProtectedRoute: Missing required role(s): ${JSON.stringify(requiredRole)}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (DEBUG) console.log(`ProtectedRoute: Missing required permission(s): ${JSON.stringify(requiredPermission)}`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // All checks passed, render the protected route
  if (DEBUG) console.log("ProtectedRoute: Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
