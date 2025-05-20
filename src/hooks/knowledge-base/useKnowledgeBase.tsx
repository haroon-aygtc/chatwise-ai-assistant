import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import KnowledgeBaseService from "../../services/knowledge-base/knowledgeBaseService";
import { KnowledgeDocument, DocumentCategory, CreateDocumentRequest, UpdateDocumentRequest, CreateCategoryRequest, UpdateCategoryRequest, UpdateSettingsRequest } from '../../types/knowledge-base';
import { PaginatedResponse } from "../../services/api/types";

export function useKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [hasShownError, setHasShownError] = useState(false);

  // Error handler for API failures
  useEffect(() => {
    return () => {
      setHasShownError(false);
    };
  }, []);

  const handleApiError = (error: Error) => {
    console.error("API Error:", error);
    if (!hasShownError) {
      toast.error("Unable to connect to knowledge base. Please try again later.");
      setHasShownError(true);
    }
  };

  // Fetch documents with retry configuration
  const {
    data: documents = { data: [], total: 0, current_page: 1, last_page: 1 } as PaginatedResponse<KnowledgeDocument>,
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['knowledgeBase', 'documents'],
    queryFn: async () => KnowledgeBaseService.getAllDocuments(),
    retry: false, // Disable retries since we handle the error in the service
    staleTime: 30000, // Data remains fresh for 30 seconds
  });

  // Fetch categories with retry configuration
  const {
    data: categories = [] as DocumentCategory[],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['knowledgeBase', 'categories'],
    queryFn: KnowledgeBaseService.getAllCategories,
    retry: false, // Disable retries
    staleTime: 60000, // Categories change less frequently
  });

  // Fetch single document with retry configuration
  const { data: selectedDocument } = useQuery({
    queryKey: ['knowledgeBase', 'document', selectedDocumentId],
    queryFn: () => selectedDocumentId ? KnowledgeBaseService.getDocumentById(selectedDocumentId) : null,
    enabled: !!selectedDocumentId,
    retry: false, // Disable retries
  });

  // Fetch knowledge base settings with retry configuration
  const {
    data: settings,
    isLoading: isLoadingSettings
  } = useQuery({
    queryKey: ['knowledgeBase', 'settings'],
    queryFn: KnowledgeBaseService.getSettings,
    retry: false, // Disable retries
    staleTime: 300000, // Settings change very infrequently
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: KnowledgeBaseService.createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'documents'] });
      toast.success("Document added successfully");
      setIsUploadDialogOpen(false);
    },
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(`Failed to update document: ${error.message || "Unknown error"}`);
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
    onError: (error: Error) => {
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
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(`Failed to update category: ${error.message || "Unknown error"}`);
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'categories'] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
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
  const filteredDocuments = searchQuery && documents.data
    ? documents.data.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    : documents.data || [];

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
