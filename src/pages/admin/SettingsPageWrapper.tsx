import SettingsPage from "./SettingsPage";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const SettingsPageWrapper = () => {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
};

export default SettingsPageWrapper;
