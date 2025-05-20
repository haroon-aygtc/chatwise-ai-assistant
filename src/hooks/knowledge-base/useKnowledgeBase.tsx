import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import KnowledgeBaseService from "../../services/knowledge-base/knowledgeBaseService";
import {
  KnowledgeDocument,
  DocumentCategory,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateSettingsRequest,
  KnowledgeResource,
  ResourceCollection,
  KnowledgeProfile,
  ContextScope,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CreateKnowledgeProfileRequest,
  UpdateKnowledgeProfileRequest,
  CreateContextScopeRequest,
  UpdateContextScopeRequest,
  ResourceType,
  CreateResourceRequest,
  UpdateResourceRequest,
  CreateFileRequest,
  CreateDirectoryRequest,
  CreateArticleRequest,
  CreateFAQRequest,
  CreateWebResourceRequest,
  FileResource,
  DirectoryResource,
  ArticleResource,
  FAQResource,
  WebResource,
  SearchResourcesRequest
} from '../../types/knowledge-base';
import { PaginatedResponse } from "../../services/api/types";

export function useKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [activeResourceType, setActiveResourceType] = useState<ResourceType>("ARTICLE");
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

  // Fetch resources with retry configuration
  const {
    data: resources = { data: [], total: 0, current_page: 1, last_page: 1 } as PaginatedResponse<KnowledgeResource>,
    isLoading: isLoadingResources,
    isError: isResourcesError,
    refetch: refetchResources
  } = useQuery({
    queryKey: ['knowledgeBase', 'resources', activeResourceType],
    queryFn: async () => KnowledgeBaseService.getResourcesByType(activeResourceType),
    retry: false, // Disable retries since we handle the error in the service
    staleTime: 30000, // Data remains fresh for 30 seconds
  });

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

  // Fetch collections
  const {
    data: collections = [] as ResourceCollection[],
    isLoading: isLoadingCollections,
    isError: isCollectionsError,
    refetch: refetchCollections
  } = useQuery({
    queryKey: ['knowledgeBase', 'collections'],
    queryFn: KnowledgeBaseService.getAllCollections,
    retry: false,
    staleTime: 60000,
  });

  // Fetch profiles
  const {
    data: profiles = [] as KnowledgeProfile[],
    isLoading: isLoadingProfiles,
    isError: isProfilesError,
    refetch: refetchProfiles
  } = useQuery({
    queryKey: ['knowledgeBase', 'profiles'],
    queryFn: KnowledgeBaseService.getAllProfiles,
    retry: false,
    staleTime: 60000,
  });

  // Fetch context scopes
  const {
    data: contextScopes = [] as ContextScope[],
    isLoading: isLoadingContextScopes,
    isError: isContextScopesError,
    refetch: refetchContextScopes
  } = useQuery({
    queryKey: ['knowledgeBase', 'contextScopes'],
    queryFn: KnowledgeBaseService.getAllContextScopes,
    retry: false,
    staleTime: 60000,
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

  // Fetch single resource with retry configuration
  const {
    data: selectedResource,
    isLoading: isLoadingSelectedResource
  } = useQuery({
    queryKey: ['knowledgeBase', 'resource', selectedResourceId, selectedResourceType],
    queryFn: () => selectedResourceId && selectedResourceType
      ? KnowledgeBaseService.getResourceById(selectedResourceId, selectedResourceType)
      : null,
    enabled: !!(selectedResourceId && selectedResourceType),
    retry: false, // Disable retries
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

  // Generic resource mutations
  const addResourceMutation = useMutation({
    mutationFn: KnowledgeBaseService.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      toast.success("Resource added successfully");
      setIsAddResourceDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add resource: ${error.message || "Unknown error"}`);
    }
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateResourceRequest }) =>
      KnowledgeBaseService.updateResource(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resource', data.id] });
      toast.success("Resource updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update resource: ${error.message || "Unknown error"}`);
    }
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      setSelectedResourceId(null);
      setSelectedResourceType(null);
      toast.success("Resource deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete resource: ${error.message || "Unknown error"}`);
    }
  });

  // File resource mutations
  const uploadFileMutation = useMutation({
    mutationFn: KnowledgeBaseService.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      toast.success("File uploaded successfully");
      setIsUploadDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload file: ${error.message || "Unknown error"}`);
    }
  });

  // Directory resource mutations
  const createDirectoryMutation = useMutation({
    mutationFn: KnowledgeBaseService.createDirectory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      toast.success("Directory added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add directory: ${error.message || "Unknown error"}`);
    }
  });

  const syncDirectoryMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.syncDirectory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      toast.success("Directory synced successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to sync directory: ${error.message || "Unknown error"}`);
    }
  });

  // Web resource mutations
  const scrapeWebResourceMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.scrapeWebResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'resources'] });
      toast.success("Web resource scraped successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to scrape web resource: ${error.message || "Unknown error"}`);
    }
  });

  // Collection mutations
  const addCollectionMutation = useMutation({
    mutationFn: KnowledgeBaseService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'collections'] });
      toast.success("Collection added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add collection: ${error.message || "Unknown error"}`);
    }
  });

  const updateCollectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateCollectionRequest }) =>
      KnowledgeBaseService.updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'collections'] });
      toast.success("Collection updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update collection: ${error.message || "Unknown error"}`);
    }
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'collections'] });
      toast.success("Collection deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete collection: ${error.message || "Unknown error"}`);
    }
  });

  // Knowledge Profile mutations
  const addProfileMutation = useMutation({
    mutationFn: KnowledgeBaseService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'profiles'] });
      toast.success("Knowledge profile added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add knowledge profile: ${error.message || "Unknown error"}`);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateKnowledgeProfileRequest }) =>
      KnowledgeBaseService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'profiles'] });
      toast.success("Knowledge profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update knowledge profile: ${error.message || "Unknown error"}`);
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'profiles'] });
      toast.success("Knowledge profile deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete knowledge profile: ${error.message || "Unknown error"}`);
    }
  });

  // Context Scope mutations
  const addContextScopeMutation = useMutation({
    mutationFn: KnowledgeBaseService.createContextScope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'contextScopes'] });
      toast.success("Context scope added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add context scope: ${error.message || "Unknown error"}`);
    }
  });

  const updateContextScopeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateContextScopeRequest }) =>
      KnowledgeBaseService.updateContextScope(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'contextScopes'] });
      toast.success("Context scope updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update context scope: ${error.message || "Unknown error"}`);
    }
  });

  const deleteContextScopeMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteContextScope(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'contextScopes'] });
      toast.success("Context scope deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete context scope: ${error.message || "Unknown error"}`);
    }
  });

  // Legacy Document mutations - maintained for backward compatibility
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

  // Category mutations - maintained for backward compatibility
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

  // Search mutations
  const searchResourcesMutation = useMutation({
    mutationFn: KnowledgeBaseService.searchResources,
    onSuccess: () => {
      toast.success("Search completed");
    },
    onError: (error: Error) => {
      toast.error(`Search failed: ${error.message || "Unknown error"}`);
    }
  });

  // Filter resources based on search query
  const filteredResources = searchQuery && resources.data
    ? resources.data.filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : resources.data || [];

  // Filter documents based on search query - maintained for backward compatibility
  const filteredDocuments = searchQuery && documents.data
    ? documents.data.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    : documents.data || [];

  // Handle resource refresh
  const handleRefresh = () => {
    refetchResources();
    refetchDocuments();
    refetchCollections();
    refetchProfiles();
    refetchContextScopes();
    toast.info("Refreshing knowledge base...");
  };

  // Resource handlers
  const handleAddResource = (resourceData: CreateResourceRequest) => {
    addResourceMutation.mutate(resourceData);
  };

  const handleUpdateResource = (id: string, resourceData: UpdateResourceRequest) => {
    updateResourceMutation.mutate({ id, data: resourceData });
  };

  const handleDeleteResource = (id: string) => {
    deleteResourceMutation.mutate(id);
  };

  // File handlers
  const handleUploadFile = (fileData: CreateFileRequest) => {
    uploadFileMutation.mutate(fileData);
  };

  // Download file handler
  const handleDownloadFile = (id: string) => {
    // Implementation for downloading files
    console.log(`Downloading file with ID: ${id}`);
    // Add actual implementation here
  };

  // Directory handlers
  const handleCreateDirectory = (directoryData: CreateDirectoryRequest) => {
    createDirectoryMutation.mutate(directoryData);
  };

  const handleSyncDirectory = (id: string) => {
    syncDirectoryMutation.mutate(id);
  };

  // Web resource handlers
  const handleScrapeWebResource = (id: string) => {
    scrapeWebResourceMutation.mutate(id);
  };

  // Collection handlers
  const handleCreateCollection = (collectionData: CreateCollectionRequest) => {
    addCollectionMutation.mutate(collectionData);
  };

  const handleUpdateCollection = (id: string, collectionData: UpdateCollectionRequest) => {
    updateCollectionMutation.mutate({ id, data: collectionData });
  };

  const handleDeleteCollection = (id: string) => {
    deleteCollectionMutation.mutate(id);
  };

  // Knowledge Profile handlers
  const handleCreateProfile = (profileData: CreateKnowledgeProfileRequest) => {
    addProfileMutation.mutate(profileData);
  };

  const handleUpdateProfile = (id: string, profileData: UpdateKnowledgeProfileRequest) => {
    updateProfileMutation.mutate({ id, data: profileData });
  };

  const handleDeleteProfile = (id: string) => {
    deleteProfileMutation.mutate(id);
  };

  // Context Scope handlers
  const handleCreateContextScope = (scopeData: CreateContextScopeRequest) => {
    addContextScopeMutation.mutate(scopeData);
  };

  const handleUpdateContextScope = (id: string, scopeData: UpdateContextScopeRequest) => {
    updateContextScopeMutation.mutate({ id, data: scopeData });
  };

  const handleDeleteContextScope = (id: string) => {
    deleteContextScopeMutation.mutate(id);
  };

  // Legacy document handlers - maintained for backward compatibility
  const handleUploadDocument = (documentData: CreateDocumentRequest) => {
    addDocumentMutation.mutate(documentData);
  };

  const handleUpdateDocument = (id: string, documentData: UpdateDocumentRequest) => {
    updateDocumentMutation.mutate({ id, data: documentData });
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocumentMutation.mutate(id);
  };

  // Legacy category handlers - maintained for backward compatibility
  const handleCreateCategory = (categoryData: CreateCategoryRequest) => {
    addCategoryMutation.mutate(categoryData);
  };

  const handleUpdateCategory = (id: string, categoryData: UpdateCategoryRequest) => {
    updateCategoryMutation.mutate({ id, data: categoryData });
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id);
  };

  // Handle settings update
  const handleUpdateSettings = (settingsData: UpdateSettingsRequest) => {
    updateSettingsMutation.mutate(settingsData);
  };

  // Search handlers
  const handleSearchResources = (searchData: SearchResourcesRequest) => {
    searchResourcesMutation.mutate(searchData);
  };

  return {
    // Resources
    resources,
    filteredResources,
    selectedResource,
    selectedResourceId,
    setSelectedResourceId,
    selectedResourceType,
    setSelectedResourceType,
    activeResourceType,
    setActiveResourceType,
    isAddResourceDialogOpen,
    setIsAddResourceDialogOpen,
    isLoadingResources,
    isResourcesError,
    isLoadingSelectedResource,

    // Collections
    collections,
    isLoadingCollections,
    isCollectionsError,

    // Profiles
    profiles,
    isLoadingProfiles,
    isProfilesError,

    // Context Scopes
    contextScopes,
    isLoadingContextScopes,
    isContextScopesError,

    // Settings
    settings,
    isLoadingSettings,

    // Legacy documents - maintained for backward compatibility
    documents: documents.data,
    filteredDocuments,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isLoadingDocuments,
    isDocumentsError,

    // Legacy categories - maintained for backward compatibility
    categories,
    isLoadingCategories,

    // Search
    searchQuery,
    setSearchQuery,

    // Resource mutations
    addResourceMutation,
    updateResourceMutation,
    deleteResourceMutation,

    // File mutations
    uploadFileMutation,

    // Directory mutations
    createDirectoryMutation,
    syncDirectoryMutation,

    // Web resource mutations
    scrapeWebResourceMutation,

    // Collection mutations
    addCollectionMutation,
    updateCollectionMutation,
    deleteCollectionMutation,

    // Profile mutations
    addProfileMutation,
    updateProfileMutation,
    deleteProfileMutation,

    // Context Scope mutations
    addContextScopeMutation,
    updateContextScopeMutation,
    deleteContextScopeMutation,

    // Legacy document mutations
    addDocumentMutation,
    updateDocumentMutation,
    deleteDocumentMutation,

    // Legacy category mutations
    addCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,

    // Settings mutation
    updateSettingsMutation,

    // Search mutation
    searchResourcesMutation,

    // Handler methods
    handleRefresh,
    handleAddResource,
    handleUpdateResource,
    handleDeleteResource,
    handleUploadFile,
    handleDownloadFile,
    handleCreateDirectory,
    handleSyncDirectory,
    handleScrapeWebResource,
    handleCreateCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleCreateProfile,
    handleUpdateProfile,
    handleDeleteProfile,
    handleCreateContextScope,
    handleUpdateContextScope,
    handleDeleteContextScope,
    handleUploadDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleUpdateSettings,
    handleSearchResources,

    // Refetch methods
    refetchResources,
    refetchCollections,
    refetchProfiles,
    refetchContextScopes
  };
}
