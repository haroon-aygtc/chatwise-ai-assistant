
import { KnowledgeDocument } from "@/types/knowledge-base";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DocumentListProps {
  documents: KnowledgeDocument[];
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  isLoading: boolean;
}

export const DocumentList = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
  isLoading,
}: DocumentListProps) => {
  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Get appropriate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "indexed":
        return <Badge variant="default">Indexed</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[600px]">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 h-full text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">No documents found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first document to get started
              </p>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Document
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedDocumentId === doc.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-md">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {doc.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getStatusBadge(doc.status)}
                        <Badge variant="outline" className="text-xs">
                          {doc.fileType.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(doc.fileSize)}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          Updated {formatDate(doc.lastUpdated || doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
