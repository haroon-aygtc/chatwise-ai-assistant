import UserManagement from "../../components/admin/user-management/UserManagement";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

const UserManagementPage = () => {

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
