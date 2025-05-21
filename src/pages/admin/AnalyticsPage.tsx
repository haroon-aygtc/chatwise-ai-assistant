
import Analytics from '../../components/admin/Analytics';
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const AnalyticsPage = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <Analytics />
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
