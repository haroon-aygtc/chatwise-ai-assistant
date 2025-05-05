
import { Button } from "@/components/ui/button";
import { RefreshCw, Upload } from "lucide-react";

interface KnowledgeBaseHeaderProps {
  onRefresh: () => void;
  onOpenUploadDialog: () => void;
  isLoading: boolean;
}

export const KnowledgeBaseHeader = ({
  onRefresh,
  onOpenUploadDialog,
  isLoading
}: KnowledgeBaseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Manage documents that power your AI's knowledge
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button onClick={onOpenUploadDialog}>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
    </div>
  );
};
