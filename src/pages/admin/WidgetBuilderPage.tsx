import WidgetBuilder from "@/components/admin/WidgetBuilder";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const WidgetBuilderPage = () => {
  return (
    <ProtectedRoute requiredPermissions={["manage_widgets"]}>
      <WidgetBuilder />
    </ProtectedRoute>
  );
};

export default WidgetBuilderPage;
