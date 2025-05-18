
import React from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { RefreshCcw, Upload } from "lucide-react";

interface KnowledgeBaseHeaderProps {
  onRefresh: () => void;
  onOpenUploadDialog: () => void;
  isLoading: boolean;
}

export const KnowledgeBaseHeader: React.FC<KnowledgeBaseHeaderProps> = ({
  onRefresh,
  onOpenUploadDialog,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between">
      <Heading title="Knowledge Base" description="Manage documents that power your AI's knowledge" />
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button onClick={onOpenUploadDialog}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};
