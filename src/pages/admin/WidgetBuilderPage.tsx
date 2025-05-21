import WidgetBuilder from "@/components/admin/WidgetBuilder";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const WidgetBuilderPage = () => {

  return (
    <ProtectedRoute requiredRole="admin">
      <WidgetBuilder />
    </ProtectedRoute>
  );
};

export default WidgetBuilderPage;