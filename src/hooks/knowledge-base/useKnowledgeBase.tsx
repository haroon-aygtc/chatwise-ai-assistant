
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { KnowledgeDocument, DocumentCategory, CreateDocumentRequest, UpdateDocumentRequest, CreateCategoryRequest, UpdateCategoryRequest, UpdateSettingsRequest } from '@/types/knowledge-base';

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
    queryFn: async () => KnowledgeBaseService.getAllDocuments(),
  });

  // Fetch categories
  const { 
    data: categories = [] as DocumentCategory[],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['knowledgeBase', 'categories'],
    queryFn: KnowledgeBaseService.getAllCategories
  });

  // Fetch single document
  const { data: selectedDocument } = useQuery({
    queryKey: ['knowledgeBase', 'document', selectedDocumentId],
    queryFn: () => selectedDocumentId ? KnowledgeBaseService.getDocumentById(selectedDocumentId) : null,
    enabled: !!selectedDocumentId,
  });

  // Fetch knowledge base settings
  const { 
    data: settings,
    isLoading: isLoadingSettings 
  } = useQuery({
    queryKey: ['knowledgeBase', 'settings'],
    queryFn: KnowledgeBaseService.getSettings
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

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateDocumentRequest }) => 
      KnowledgeBaseService.updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'document', selectedDocumentId] });
      toast.success("Document updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update document: ${error.message || "Unknown error"}`);
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: KnowledgeBaseService.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      setSelectedDocumentId(null);
      toast.success("Document deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete document: ${error.message || "Unknown error"}`);
    }
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: KnowledgeBaseService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      toast.success("Category added successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to add category: ${error.message || "Unknown error"}`);
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateCategoryRequest }) => 
      KnowledgeBaseService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update category: ${error.message || "Unknown error"}`);
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: KnowledgeBaseService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message || "Unknown error"}`);
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: KnowledgeBaseService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'settings'] });
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message || "Unknown error"}`);
    }
  });

  // Filter documents based on search query
  const filteredDocuments = searchQuery 
    ? documents.data.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : documents.data;

  // Handle document refresh
  const handleRefresh = () => {
    refetchDocuments();
    toast.info("Refreshing knowledge base...");
  };

  // Handle document upload
  const handleUploadDocument = (documentData: CreateDocumentRequest) => {
    addDocumentMutation.mutate(documentData);
  };

  // Handle document update
  const handleUpdateDocument = (id: string, documentData: UpdateDocumentRequest) => {
    updateDocumentMutation.mutate({ id, data: documentData });
  };

  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    deleteDocumentMutation.mutate(id);
  };

  // Handle category creation
  const handleCreateCategory = (categoryData: CreateCategoryRequest) => {
    addCategoryMutation.mutate(categoryData);
  };

  // Handle category update
  const handleUpdateCategory = (id: string, categoryData: UpdateCategoryRequest) => {
    updateCategoryMutation.mutate({ id, data: categoryData });
  };

  // Handle category deletion
  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  // Handle settings update
  const handleUpdateSettings = (settingsData: UpdateSettingsRequest) => {
    updateSettingsMutation.mutate(settingsData);
  };

  return {
    documents: documents.data,
    filteredDocuments,
    categories,
    selectedDocument,
    settings,
    searchQuery,
    setSearchQuery,
    selectedDocumentId,
    setSelectedDocumentId,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isLoadingDocuments,
    isLoadingCategories,
    isLoadingSettings,
    isDocumentsError,
    addDocumentMutation,
    updateDocumentMutation,
    deleteDocumentMutation,
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    updateSettingsMutation,
    handleRefresh,
    handleUploadDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleUpdateSettings
  };
}
