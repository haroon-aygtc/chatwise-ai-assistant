import { ConfigurationManager } from "@/components/admin/ai-configuration/ConfigurationManager";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const AIConfigurationPage = () => {

  return (
    <ProtectedRoute requiredRole="admin">
      <ConfigurationManager />
    </ProtectedRoute>
  );
};

export default AIConfigurationPage;
