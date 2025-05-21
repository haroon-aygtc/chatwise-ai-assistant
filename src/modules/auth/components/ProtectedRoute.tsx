/**
 * Protected Route Component
 *
 * Ensures that routes are only accessible to authenticated users
 * Redirects to login page if user is not authenticated
 */
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  redirectTo?: string;
}

/**
 * Protected Route Component
 *
 * @param children - The components to render if authenticated
 * @param requiredPermissions - Optional array of permissions required to access the route
 * @param redirectTo - Optional redirect path (defaults to /login)
 */
const ProtectedRoute = ({
  children,
  requiredPermissions = [],
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const location = useLocation();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );

    if (!hasRequiredPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
