
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { KnowledgeDocument } from "@/types/knowledge-base";
import { formatDistanceToNow } from "date-fns";

interface DocumentListProps {
  documents: KnowledgeDocument[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  isLoading: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
  isLoading
}) => {
  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper function to get icon for file type
  const getFileIcon = (fileType: string) => {
    return <FileText className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No documents found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <Card
          key={document.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedDocumentId === document.id ? "border-primary" : ""
          }`}
          onClick={() => onSelectDocument(document.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getFileIcon(document.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate mb-1">{document.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {document.description || "No description available"}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {document.fileType && (
                    <Badge variant="outline" className="text-xs">
                      {document.fileType.toUpperCase()}
                    </Badge>
                  )}
                  {document.fileSize > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {formatFileSize(document.fileSize)}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(document.lastUpdated), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
