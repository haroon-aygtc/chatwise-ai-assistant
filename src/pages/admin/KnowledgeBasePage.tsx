
import { KnowledgeBaseManager } from "@/components/admin/knowledge-base/KnowledgeBaseManager";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

export default function KnowledgeBasePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <KnowledgeBaseManager />
    </ProtectedRoute>
  );
}
