
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

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
  const { isAuthenticated, isLoading, hasRole, hasPermission, refreshAuth } = useAuth();
  const location = useLocation();

  // When this component mounts, refresh the auth state to ensure we have the latest data
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // If still loading auth state, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    const currentPath = location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentPath);

    return <Navigate to={redirectTo} replace />;
  }

  // Special case for admin users trying to access admin panel
  if (requiredPermission === 'access admin panel' && hasRole('admin')) {
    // Always allow admin users to access admin panel, no need to check role
    return <>{children}</>;
  }
  // Otherwise, check role and permission requirements
  else {
    // Check role requirement if specified
    if (requiredRole && !hasRole(requiredRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Check permission requirement if specified
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default ProtectedRoute;
