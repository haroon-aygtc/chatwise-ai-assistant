import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import tokenService from "@/services/auth/tokenService";

// Debug flag
const DEBUG = process.env.NODE_ENV === "development";

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
  const {
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    user,
  } = useAuth();
  const location = useLocation();

  // Listen for auth expired events
  useEffect(() => {
    const handleAuthExpired = () => {
      // Force navigation to login page
      window.location.href = "/login?session=expired";
    };

    window.addEventListener("auth:expired", handleAuthExpired as EventListener);

    return () => {
      window.removeEventListener(
        "auth:expired",
        handleAuthExpired as EventListener,
      );
    };
  }, []);

  // Check if we should show loading state
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
    // Check if we should prevent redirect during page load
    const preventRedirect = sessionStorage.getItem("prevent_auth_redirect") === "true";
    const hasActiveSession = tokenService.hasActiveSession();

    if (preventRedirect && hasActiveSession) {
      if (DEBUG) console.log("ProtectedRoute: Preventing redirect during page load");
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (DEBUG) console.log(`ProtectedRoute: Not authenticated, redirecting to ${redirectTo}`);

    // Store the current URL to redirect back after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);

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
