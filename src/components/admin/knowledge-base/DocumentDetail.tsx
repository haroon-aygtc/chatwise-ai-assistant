
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Eye, Download, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { DocumentCategory, KnowledgeDocument } from "@/types/knowledge-base";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { formatDistanceToNow } from "date-fns";

interface DocumentDetailProps {
  documentId: string;
  categories: DocumentCategory[];
  onDelete: (id: string) => void;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({
  documentId,
  categories,
  onDelete
}) => {
  // Fetch document details
  const { data: document, isLoading } = useQuery({
    queryKey: ['knowledgeBase', 'document', documentId],
    queryFn: () => KnowledgeBaseService.getDocumentById(documentId),
    enabled: !!documentId
  });

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!document) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Document not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{document.title}</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="text-destructive"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {document.fileType && (
              <Badge variant="outline">
                {document.fileType.toUpperCase()}
              </Badge>
            )}
            {document.categoryId && (
              <Badge>
                {getCategoryName(document.categoryId)}
              </Badge>
            )}
            {document.fileSize > 0 && (
              <Badge variant="outline">
                {formatFileSize(document.fileSize)}
              </Badge>
            )}
            {document.tags && document.tags.map((tag, idx) => (
              <Badge variant="secondary" key={idx}>
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">{document.description}</p>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Content Preview</h4>
            <div className="border rounded-md p-3 bg-muted/30 max-h-64 overflow-auto">
              <p className="text-sm whitespace-pre-wrap">
                {document.content.substring(0, 500)}
                {document.content.length > 500 && '...'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground pt-4">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                Uploaded {formatDistanceToNow(new Date(document.uploadedAt), { addSuffix: true })}
              </span>
            </div>
            <div>
              <span>
                Last updated {formatDistanceToNow(new Date(document.lastUpdated), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
