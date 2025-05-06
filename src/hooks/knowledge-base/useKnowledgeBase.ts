import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { KnowledgeDocument, DocumentCategory } from '@/types/knowledge-base';

export function useKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch documents
  const { 
    data: documents = { data: [], total: 0, current_page: 1, last_page: 1 }, 
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['knowledgeBase', 'documents'],
    queryFn: async ({ pageParam = 1, queryKey }) => {
      const filters = queryKey[2] || {};
      return KnowledgeBaseService.getAllDocuments(Number(pageParam), 20, filters);
    },
  });

  // Fetch categories
  const { 
    data: categories = [] as DocumentCategory[],
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
  const filteredDocuments = documents.data.filter(doc => 
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

  return {
    documents: documents.data,
    categories,
    filteredDocuments,
    searchQuery,
    setSearchQuery,
    selectedDocumentId,
    setSelectedDocumentId,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isLoadingDocuments,
    isLoadingCategories,
    isDocumentsError,
    addDocumentMutation,
    handleRefresh,
    handleUploadDocument,
    handleDeleteDocument
  };
}
