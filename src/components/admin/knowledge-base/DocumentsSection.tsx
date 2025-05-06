
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentList } from "./DocumentList";
import { DocumentDetail } from "./DocumentDetail";
import { DocumentCategory as KnowledgeBaseDocumentCategory, KnowledgeDocument } from "@/types/knowledge-base";

interface DocumentsSectionProps {
  documents: KnowledgeDocument[];
  categories: KnowledgeBaseDocumentCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
}

export const DocumentsSection = ({
  documents,
  categories,
  searchQuery,
  onSearchChange,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  isLoading,
  isError,
  onRefresh
}: DocumentsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading documents</p>
          <Button variant="outline" onClick={onRefresh} className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-5">
            <DocumentList 
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={onSelectDocument}
              isLoading={isLoading}
            />
          </div>
          <div className="md:col-span-7">
            {selectedDocumentId ? (
              <DocumentDetail 
                documentId={selectedDocumentId}
                categories={categories}
                onDelete={onDeleteDocument}
              />
            ) : (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Select a document to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
