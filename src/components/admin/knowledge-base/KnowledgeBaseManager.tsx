
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DocumentList } from "./DocumentList";
import { CategoryList } from "./CategoryList";
import { DocumentDetail } from "./DocumentDetail";
import { SettingsPanel } from "./SettingsPanel";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { KnowledgeDocument, DocumentCategory } from "@/types/knowledge-base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, Upload, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadDocumentDialog } from "./UploadDocumentDialog";

export const KnowledgeBaseManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch documents
  const { 
    data: documents = [], 
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['knowledgeBase', 'documents'],
    queryFn: KnowledgeBaseService.getAllDocuments
  });

  // Fetch categories
  const { 
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['knowledgeBase', 'categories'],
    queryFn: KnowledgeBaseService.getAllCategories
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: KnowledgeBaseService.createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      toast.success("Document added successfully");
      setIsUploadDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to add document: ${error.message || "Unknown error"}`);
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      setSelectedDocumentId(null);
      toast.success("Document deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete document: ${error.message || "Unknown error"}`);
    }
  });

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle document refresh
  const handleRefresh = () => {
    refetchDocuments();
    toast.info("Refreshing knowledge base...");
  };

  // Handle document upload
  const handleUploadDocument = (documentData: any) => {
    addDocumentMutation.mutate(documentData);
  };

  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocumentMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
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
            onClick={handleRefresh}
            disabled={isLoadingDocuments}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoadingDocuments ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoadingDocuments ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isDocumentsError ? (
            <div className="text-center py-8">
              <p className="text-destructive">Error loading documents</p>
              <Button variant="outline" onClick={handleRefresh} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <DocumentList 
                  documents={filteredDocuments}
                  selectedDocumentId={selectedDocumentId}
                  onSelectDocument={setSelectedDocumentId}
                  isLoading={isLoadingDocuments}
                />
              </div>
              <div className="md:col-span-7">
                {selectedDocumentId ? (
                  <DocumentDetail 
                    documentId={selectedDocumentId}
                    categories={categories}
                    onDelete={handleDeleteDocument}
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 pt-4">
          <CategoryList categories={categories} isLoading={isLoadingCategories} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      <UploadDocumentDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUploadDocument}
        categories={categories}
        isUploading={addDocumentMutation.isPending}
      />
    </div>
  );
};

export default KnowledgeBaseManager;
