import { useEffect } from "react";
import SettingsPage from "./SettingsPage";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import { useAuth } from "@/hooks/auth/useAuth";

const SettingsPageWrapper = () => {
  const { refreshAuth } = useAuth();
  
  // Ensure auth is refreshed when this page loads
  useEffect(() => {
    // Check if this is a page refresh scenario
    const pageLoadTime = Number(sessionStorage.getItem('page_load_time') || '0');
    const timeSinceLoad = Date.now() - pageLoadTime;
    const isRecentPageLoad = timeSinceLoad < 5000; // 5 seconds
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";
    
    if (isRecentPageLoad && hasActiveSession) {
      console.log("SettingsPage: Detected page refresh, refreshing auth");
      refreshAuth();
    }
  }, [refreshAuth]);
  
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
};

export default SettingsPageWrapper;
