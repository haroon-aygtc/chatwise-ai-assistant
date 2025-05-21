import { ReactNode, useEffect, useState, useRef } from "react";
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
    refreshAuth,
    user,
  } = useAuth();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [isPageRefresh, setIsPageRefresh] = useState(false);
  const [useCache, setUseCache] = useState(false);

  // Detect if this is a page refresh
  useEffect(() => {
    // Check if this is a page refresh scenario
    const pageLoadTime = Number(
      sessionStorage.getItem("page_load_time") || "0",
    );
    const timeSinceLoad = Date.now() - pageLoadTime;
    const isRecentPageLoad = timeSinceLoad < 5000; // 5 seconds
    const hasActiveSession =
      sessionStorage.getItem("has_active_session") === "true";

    // Set page refresh flag if we're in a refresh scenario with an active session
    const isRefreshScenario = isRecentPageLoad && hasActiveSession;
    setIsPageRefresh(isRefreshScenario);

    if (isRefreshScenario && DEBUG) {
      console.log("ProtectedRoute: Detected page refresh scenario");
    }

    // Check if we have cached user data
    const cachedUser = localStorage.getItem("cached_user_data");
    if (cachedUser && isRefreshScenario) {
      setUseCache(true);
    }
  }, []);

  // Refresh auth if needed
  useEffect(() => {
    // Check if we need to refresh auth
    const needsRefresh =
      // If authenticated but missing user data
      (isAuthenticated && !user) ||
      // If authenticated but missing permissions
      (isAuthenticated &&
        user?.permissions?.length === 0 &&
        (requiredPermission || requiredRole)) ||
      // If in page refresh scenario and not authenticated
      (isPageRefresh &&
        !isAuthenticated &&
        tokenService.getToken() &&
        refreshAttempts < 3);

    if (needsRefresh && !isRefreshing) {
      if (DEBUG)
        console.log(
          "ProtectedRoute: Auth data incomplete or page refresh, refreshing",
        );
      setIsRefreshing(true);

      // Increment refresh attempts
      setRefreshAttempts((prev) => prev + 1);

      refreshAuth().finally(() => {
        setIsRefreshing(false);
      });
    } else if (DEBUG && !isRefreshing) {
      console.log("ProtectedRoute: No need to refresh auth data");
    }
  }, [
    isAuthenticated,
    user,
    requiredRole,
    requiredPermission,
    refreshAuth,
    isPageRefresh,
    refreshAttempts,
    isRefreshing,
  ]);

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
  if (isLoading || isRefreshing) {
    if (DEBUG)
      console.log("ProtectedRoute: Still loading auth state or refreshing");
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Special handling for page refresh scenarios
  if (isPageRefresh && !isAuthenticated && refreshAttempts < 3) {
    if (DEBUG)
      console.log(
        "ProtectedRoute: In page refresh scenario, showing loading state",
      );
    // During page refresh, show loading instead of redirecting immediately
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Check if we should prevent redirect during page refresh
    const preventRedirect =
      sessionStorage.getItem("prevent_auth_redirect") === "true";
    const pageLoadTime = Number(
      sessionStorage.getItem("page_load_time") || "0",
    );
    const timeSinceLoad = Date.now() - pageLoadTime;
    const isRecentPageLoad = timeSinceLoad < 5000; // 5 seconds
    const hasActiveSession =
      sessionStorage.getItem("has_active_session") === "true";

    if ((preventRedirect || isRecentPageLoad) && hasActiveSession) {
      if (DEBUG)
        console.log("ProtectedRoute: Preventing redirect during page refresh");
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (DEBUG)
      console.log(
        `ProtectedRoute: Not authenticated, redirecting to ${redirectTo}`,
      );

    // Store the current URL to redirect back after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);

    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements - be more lenient during page refresh
  if (requiredRole && !hasRole(requiredRole)) {
    if (isPageRefresh && refreshAttempts < 3) {
      if (DEBUG)
        console.log(
          `ProtectedRoute: Missing required role(s) during page refresh, showing loading`,
        );
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (DEBUG)
      console.log(
        `ProtectedRoute: Missing required role(s): ${JSON.stringify(requiredRole)}`,
      );
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check permission requirements - be more lenient during page refresh
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (isPageRefresh && refreshAttempts < 3) {
      if (DEBUG)
        console.log(
          `ProtectedRoute: Missing required permission(s) during page refresh, showing loading`,
        );
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (DEBUG)
      console.log(
        `ProtectedRoute: Missing required permission(s): ${JSON.stringify(requiredPermission)}`,
      );
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // All checks passed, render the protected route
  if (DEBUG) console.log("ProtectedRoute: Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
