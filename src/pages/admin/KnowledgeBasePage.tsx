import { KnowledgeBaseManager } from "@/components/admin/knowledge-base/KnowledgeBaseManager";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";

export default function KnowledgeBasePage() {
  return (
    <ProtectedRoute requiredPermissions={["manage_knowledge_base"]}>
      <KnowledgeBaseManager />
    </ProtectedRoute>
  );
}
