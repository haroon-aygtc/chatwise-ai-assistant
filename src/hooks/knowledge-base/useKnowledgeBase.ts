import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import KnowledgeBaseService from "../../services/knowledge-base/knowledgeBaseService";
import type {
  DocumentCategory,
  CreateDocumentRequest,
  KnowledgeResource,
  ResourceCollection,
  KnowledgeProfile,
  ContextScope,
  CreateResourceRequest,
  UpdateResourceRequest,
  ResourceType
} from "../../types/knowledge-base";
import { PaginatedResponse, PaginationParams } from "../../services/api/types";

export interface ResourcesQueryParams extends PaginationParams {
  resourceType?: ResourceType;
  collectionId?: string;
  isActive?: boolean;
  search?: string;
  tags?: string[];
}

export function useKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [resourcesQueryParams, setResourcesQueryParams] = useState<ResourcesQueryParams>({
    page: 1,
    perPage: 20
  });
  const queryClient = useQueryClient();

  // Fetch all resources with pagination and filtering
  const {
    data: resources = { data: [], total: 0, current_page: 1, last_page: 1 },
    isLoading: isLoadingResources,
    isError: isResourcesError,
    refetch: refetchResources,
  } = useQuery({
    queryKey: ["knowledgeBase", "resources", resourcesQueryParams, searchQuery],
    queryFn: async () => {
      try {
        const filters = {
          ...resourcesQueryParams,
          search: searchQuery || undefined
        };
        return await KnowledgeBaseService.getAllResources(
          filters.page,
          filters.perPage,
          filters
        );
      } catch (error) {
        console.error("Error fetching resources:", error);
        // Return empty data structure on error
        return { data: [], total: 0, current_page: 1, last_page: 1 };
      }
    },
    retry: false, // Disable retries completely
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    onError: (error) => {
      console.error("Error in resources query:", error);
      // Show error toast only once
      toast.error("Failed to fetch knowledge base resources");
    }
  });

  // Fetch collections
  const {
    data: collections = [] as ResourceCollection[],
    isLoading: isLoadingCollections,
    isError: isCollectionsError,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ["knowledgeBase", "collections"],
    queryFn: async () => {
      try {
        return await KnowledgeBaseService.getAllCollections();
      } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching collections:", error);
      toast.error("Failed to fetch knowledge base collections");
    }
  });

  // Fetch profiles
  const {
    data: profiles = [] as KnowledgeProfile[],
    isLoading: isLoadingProfiles,
    isError: isProfilesError,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["knowledgeBase", "profiles"],
    queryFn: async () => {
      try {
        return await KnowledgeBaseService.getAllProfiles();
      } catch (error) {
        console.error("Error fetching knowledge profiles:", error);
        return [];
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching knowledge profiles:", error);
      toast.error("Failed to fetch knowledge base profiles");
    }
  });

  // Fetch context scopes
  const {
    data: contextScopes = [] as ContextScope[],
    isLoading: isLoadingContextScopes,
    isError: isContextScopesError,
    refetch: refetchContextScopes,
  } = useQuery({
    queryKey: ["knowledgeBase", "contextScopes"],
    queryFn: async () => {
      try {
        return await KnowledgeBaseService.getAllContextScopes();
      } catch (error) {
        console.error("Error fetching context scopes:", error);
        return [];
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching context scopes:", error);
      toast.error("Failed to fetch knowledge base context scopes");
    }
  });

  // Fetch categories (for backward compatibility)
  const {
    data: categories = [] as DocumentCategory[],
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["knowledgeBase", "categories"],
    queryFn: async () => {
      try {
        return await KnowledgeBaseService.getAllCategories();
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    onError: (error) => {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch knowledge base categories");
    }
  });

  // Add resource mutation
  const addResourceMutation = useMutation({
    mutationFn: (data: CreateResourceRequest) => {
      switch (data.resourceType) {
        case "ARTICLE":
          return KnowledgeBaseService.createResource(data);
        case "FAQ":
          return KnowledgeBaseService.createResource(data);
        case "FILE_UPLOAD":
          return KnowledgeBaseService.uploadFile(data as any);
        case "DIRECTORY":
          return KnowledgeBaseService.createDirectory(data as any);
        default:
          return KnowledgeBaseService.createResource(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "resources"],
      });
      toast.success("Resource added successfully");
      setIsUploadDialogOpen(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add resource: ${errorMessage}`);
    },
  });

  // Update resource mutation
  const updateResourceMutation = useMutation({
    mutationFn: (data: UpdateResourceRequest) => {
      return KnowledgeBaseService.updateResource(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "resources"],
      });
      toast.success("Resource updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update resource: ${errorMessage}`);
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "resources"],
      });
      setSelectedResourceId(null);
      toast.success("Resource deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete resource: ${errorMessage}`);
    },
  });

  // Collection mutations
  const addCollectionMutation = useMutation({
    mutationFn: KnowledgeBaseService.createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "collections"],
      });
      toast.success("Collection added successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add collection: ${errorMessage}`);
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: (data: { id: string, [key: string]: any }) =>
      KnowledgeBaseService.updateCollection(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "collections"],
      });
      toast.success("Collection updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update collection: ${errorMessage}`);
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: KnowledgeBaseService.deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "collections"],
      });
      toast.success("Collection deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete collection: ${errorMessage}`);
    },
  });

  // Profile mutations
  const addProfileMutation = useMutation({
    mutationFn: KnowledgeBaseService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "profiles"],
      });
      toast.success("Knowledge profile added successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add knowledge profile: ${errorMessage}`);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { id: string, [key: string]: any }) =>
      KnowledgeBaseService.updateProfile(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "profiles"],
      });
      toast.success("Knowledge profile updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update knowledge profile: ${errorMessage}`);
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: KnowledgeBaseService.deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "profiles"],
      });
      toast.success("Knowledge profile deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete knowledge profile: ${errorMessage}`);
    },
  });

  // Context scope mutations
  const addContextScopeMutation = useMutation({
    mutationFn: KnowledgeBaseService.createContextScope,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "contextScopes"],
      });
      toast.success("Context scope added successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to add context scope: ${errorMessage}`);
    },
  });

  const updateContextScopeMutation = useMutation({
    mutationFn: (data: { id: string, [key: string]: any }) =>
      KnowledgeBaseService.updateContextScope(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "contextScopes"],
      });
      toast.success("Context scope updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update context scope: ${errorMessage}`);
    },
  });

  const deleteContextScopeMutation = useMutation({
    mutationFn: KnowledgeBaseService.deleteContextScope,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "contextScopes"],
      });
      toast.success("Context scope deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete context scope: ${errorMessage}`);
    },
  });

  // Filter resources based on search query
  const filteredResources: KnowledgeResource[] = resources &&
    (resources as PaginatedResponse<KnowledgeResource>).data &&
    Array.isArray((resources as PaginatedResponse<KnowledgeResource>).data)
    ? (resources as PaginatedResponse<KnowledgeResource>).data.filter(
      (resource) => {
        if (!resource) return false;

        const titleMatch = resource.title &&
          typeof resource.title === 'string' &&
          resource.title.toLowerCase().includes(searchQuery.toLowerCase());

        const descriptionMatch = resource.description &&
          typeof resource.description === 'string' &&
          resource.description.toLowerCase().includes(searchQuery.toLowerCase());

        const tagsMatch = resource.tags &&
          Array.isArray(resource.tags) &&
          resource.tags.some(tag =>
            typeof tag === 'string' &&
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        return titleMatch || descriptionMatch || tagsMatch;
      }
    )
    : [];

  // Handle resource refresh
  const handleRefresh = useCallback(() => {
    refetchResources();
    refetchCollections();
    refetchProfiles();
    refetchContextScopes();
    refetchCategories();
    toast.success("Knowledge base data refreshed");
  }, [refetchResources, refetchCollections, refetchProfiles, refetchContextScopes, refetchCategories]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setResourcesQueryParams(prev => ({
      ...prev,
      page
    }));
  }, []);

  // Handle resource type filter
  const handleResourceTypeFilter = useCallback((resourceType?: ResourceType) => {
    setResourcesQueryParams(prev => ({
      ...prev,
      resourceType,
      page: 1 // Reset to first page when changing filters
    }));
  }, []);

  // Handle collection filter
  const handleCollectionFilter = useCallback((collectionId?: string) => {
    setResourcesQueryParams(prev => ({
      ...prev,
      collectionId,
      page: 1 // Reset to first page when changing filters
    }));
  }, []);

  // Handle resource operations
  const handleAddResource = useCallback(
    (resourceData: CreateResourceRequest) => {
      addResourceMutation.mutate(resourceData);
    },
    [addResourceMutation],
  );

  const handleUpdateResource = useCallback(
    (id: string, resourceData: Omit<UpdateResourceRequest, "id">) => {
      updateResourceMutation.mutate({ id, ...resourceData });
    },
    [updateResourceMutation],
  );

  const handleDeleteResource = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this resource?")) {
        deleteResourceMutation.mutate(id);
      }
    },
    [deleteResourceMutation],
  );

  // Directory-specific operations
  const syncDirectoryMutation = useMutation({
    mutationFn: (id: string) => KnowledgeBaseService.syncDirectory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["knowledgeBase", "resources"],
      });
      toast.success("Directory sync started");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to sync directory: ${errorMessage}`);
    },
  });

  const handleSyncDirectory = useCallback(
    (id: string) => {
      syncDirectoryMutation.mutate(id);
    },
    [syncDirectoryMutation],
  );

  // Handle collection operations
  const handleAddCollection = useCallback(
    (collectionData: any) => {
      addCollectionMutation.mutate(collectionData);
    },
    [addCollectionMutation],
  );

  const handleUpdateCollection = useCallback(
    (id: string, collectionData: any) => {
      updateCollectionMutation.mutate({ id, ...collectionData });
    },
    [updateCollectionMutation],
  );

  const handleDeleteCollection = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this collection?")) {
        deleteCollectionMutation.mutate(id);
      }
    },
    [deleteCollectionMutation],
  );

  // Handle profile operations
  const handleAddProfile = useCallback(
    (profileData: any) => {
      addProfileMutation.mutate(profileData);
    },
    [addProfileMutation],
  );

  const handleUpdateProfile = useCallback(
    (id: string, profileData: any) => {
      updateProfileMutation.mutate({ id, ...profileData });
    },
    [updateProfileMutation],
  );

  const handleDeleteProfile = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this knowledge profile?")) {
        deleteProfileMutation.mutate(id);
      }
    },
    [deleteProfileMutation],
  );

  // Handle context scope operations
  const handleAddContextScope = useCallback(
    (scopeData: any) => {
      addContextScopeMutation.mutate(scopeData);
    },
    [addContextScopeMutation],
  );

  const handleUpdateContextScope = useCallback(
    (id: string, scopeData: any) => {
      updateContextScopeMutation.mutate({ id, ...scopeData });
    },
    [updateContextScopeMutation],
  );

  const handleDeleteContextScope = useCallback(
    (id: string) => {
      if (window.confirm("Are you sure you want to delete this context scope?")) {
        deleteContextScopeMutation.mutate(id);
      }
    },
    [deleteContextScopeMutation],
  );

  // Search resources with vector search
  const searchResourcesWithVector = useCallback(
    async (query: string, options?: { limit?: number, collectionIds?: string[], contextScopes?: string[] }) => {
      try {
        const searchRequest = {
          query,
          limit: options?.limit || 5,
          collectionIds: options?.collectionIds,
          contextScopes: options?.contextScopes
        };

        const results = await KnowledgeBaseService.searchResources(searchRequest);
        return results;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Search failed: ${errorMessage}`);
        return { data: [], total: 0, current_page: 1, last_page: 1 };
      }
    },
    []
  );

  return {
    // Resources
    resources,
    filteredResources,
    isLoadingResources,
    isResourcesError,
    resourcesQueryParams,
    selectedResourceId,
    setSelectedResourceId,
    handleAddResource,
    handleUpdateResource,
    handleDeleteResource,
    handlePageChange,
    handleResourceTypeFilter,
    handleCollectionFilter,

    // Directory-specific operations
    handleSyncDirectory,

    // Collections
    collections,
    isLoadingCollections,
    isCollectionsError,
    handleAddCollection,
    handleUpdateCollection,
    handleDeleteCollection,

    // Profiles
    profiles,
    isLoadingProfiles,
    isProfilesError,
    handleAddProfile,
    handleUpdateProfile,
    handleDeleteProfile,

    // Context Scopes
    contextScopes,
    isLoadingContextScopes,
    isContextScopesError,
    handleAddContextScope,
    handleUpdateContextScope,
    handleDeleteContextScope,

    // Categories (for backward compatibility)
    categories,
    isLoadingCategories,

    // Search
    searchQuery,
    setSearchQuery,
    searchResourcesWithVector,

    // UI state
    isUploadDialogOpen,
    setIsUploadDialogOpen,

    // Utility functions
    handleRefresh,
  };
}
