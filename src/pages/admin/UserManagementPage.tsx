import { useEffect } from "react";
import UserManagement from "../../components/admin/user-management/UserManagement";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import { useAuth } from "@/hooks/auth/useAuth";

const UserManagementPage = () => {
  const { refreshAuth } = useAuth();

  // Ensure auth is refreshed when this page loads
  useEffect(() => {
    // Check if this is a page refresh scenario
    const pageLoadTime = Number(sessionStorage.getItem('page_load_time') || '0');
    const timeSinceLoad = Date.now() - pageLoadTime;
    const isRecentPageLoad = timeSinceLoad < 5000; // 5 seconds
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

    if (isRecentPageLoad && hasActiveSession) {
      console.log("UserManagementPage: Detected page refresh, refreshing auth");
      refreshAuth();
    }
  }, [refreshAuth]);

  return (
    <ProtectedRoute
      requiredRole="admin"
      requiredPermission={["view_users", "view_roles", "manage_users"]}
    >
      <UserManagement />
    </ProtectedRoute>
  );
};

export default UserManagementPage;
