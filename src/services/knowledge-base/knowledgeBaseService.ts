import apiService, { ApiParams } from "../api/api";
import {
  KnowledgeDocument,
  DocumentCategory,
  KnowledgeBaseSettings,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateSettingsRequest,
  ResourceType,
  KnowledgeResource,
  FileResource,
  DirectoryResource,
  WebResource,
  ResourceCollection,
  KnowledgeProfile,
  ContextScope,
  CreateResourceRequest,
  UpdateResourceRequest,
  CreateFileRequest,
  CreateDirectoryRequest,
  CreateWebResourceRequest,
  UpdateFileRequest,
  UpdateDirectoryRequest,
  UpdateWebResourceRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CreateKnowledgeProfileRequest,
  UpdateKnowledgeProfileRequest,
  CreateContextScopeRequest,
  UpdateContextScopeRequest,
  SearchResourcesRequest,
} from "@/types/knowledge-base";
import { PaginatedResponse } from "../api/types";

// Keep track of API endpoint availability to avoid repeated failed calls
const endpointAvailability = {
  resources: true,
  collections: true,
  profiles: true,
  contextScopes: true,
  categories: true,
  documents: true,
  settings: true
};

// Reset endpoint availability after some time
const resetEndpointAvailability = () => {
  Object.keys(endpointAvailability).forEach(key => {
    endpointAvailability[key as keyof typeof endpointAvailability] = true;
  });
};

// Schedule regular reset of endpoint availability status (every 5 minutes)
setInterval(resetEndpointAvailability, 5 * 60 * 1000);

class KnowledgeBaseService {
  /**
   * Resources API
   */

  /**
   * Get all resources with optional filtering and pagination
   */
  static async getAllResources(
    page: number = 1,
    perPage: number = 20,
    filters: ApiParams = {},
  ): Promise<PaginatedResponse<KnowledgeResource>> {
    if (!endpointAvailability.resources) {
      console.warn("Resources endpoint unavailable, returning empty results");
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }

    const params = {
      page,
      per_page: perPage,
      ...filters,
    };

    try {
      return await apiService.get<PaginatedResponse<KnowledgeResource>>(
        "/knowledge-base/resources",
        { params },
      );
    } catch (error) {
      console.error("Error fetching knowledge base resources:", error);
      endpointAvailability.resources = false;
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }
  }

  /**
   * Get resource by ID and type
   */
  static async getResourceById(id: string, type?: ResourceType): Promise<KnowledgeResource | null> {
    let endpoint = `/knowledge-base/resources/${id}`;
    if (type) {
      endpoint += `?type=${type}`;
    }

    try {
      return await apiService.get<KnowledgeResource>(endpoint);
    } catch (error) {
      console.error(`Error fetching resource with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Get resources by type
   */
  static async getResourcesByType(
    type: ResourceType,
    page: number = 1,
    perPage: number = 20,
    filters: ApiParams = {},
  ): Promise<PaginatedResponse<KnowledgeResource>> {
    if (!endpointAvailability.resources) {
      console.warn("Resources endpoint unavailable, returning empty results");
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }

    const params = {
      page,
      per_page: perPage,
      type,
      ...filters,
    };

    try {
      return await apiService.get<PaginatedResponse<KnowledgeResource>>(
        "/knowledge-base/resources",
        { params },
      );
    } catch (error) {
      console.error(`Error fetching resources of type ${type}:`, error);
      endpointAvailability.resources = false;
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }
  }

  /**
   * Create a generic resource
   */
  static async createResource(data: CreateResourceRequest): Promise<KnowledgeResource> {
    try {
      return await apiService.post<KnowledgeResource>(
        "/knowledge-base/resources",
        data,
      );
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error;
    }
  }

  /**
   * Update a generic resource
   */
  static async updateResource(
    id: string,
    data: UpdateResourceRequest,
  ): Promise<KnowledgeResource> {
    try {
      return await apiService.put<KnowledgeResource>(
        `/knowledge-base/resources/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating resource with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a resource
   */
  static async deleteResource(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/resources/${id}`);
    } catch (error) {
      console.error(`Error deleting resource with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search resources
   */
  static async searchResources(
    searchRequest: SearchResourcesRequest,
  ): Promise<PaginatedResponse<KnowledgeResource>> {
    if (!endpointAvailability.resources) {
      console.warn("Resources endpoint unavailable, returning empty results");
      return {
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1
      };
    }

    try {
      return await apiService.post<PaginatedResponse<KnowledgeResource>>(
        "/knowledge-base/resources/search",
        searchRequest,
      );
    } catch (error) {
      console.error(`Error searching resources:`, error);
      return {
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1
      };
    }
  }

  /**
   * Document-specific API methods
   */
  static async getAllDocuments(
    page: number = 1,
    perPage: number = 20,
    filters: ApiParams = {},
  ): Promise<PaginatedResponse<KnowledgeDocument>> {
    if (!endpointAvailability.documents) {
      console.warn("Documents endpoint unavailable, returning empty results");
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }

    const params = {
      page,
      per_page: perPage,
      type: 'ARTICLE',
      ...filters,
    };

    try {
      return await apiService.get<PaginatedResponse<KnowledgeDocument>>(
        "/knowledge-base/documents",
        { params },
      );
    } catch (error) {
      console.error("Error fetching knowledge base documents:", error);
      endpointAvailability.documents = false;
      return {
        data: [],
        total: 0,
        current_page: page,
        last_page: 1
      };
    }
  }

  static async getDocumentById(id: string): Promise<KnowledgeDocument | null> {
    try {
      return await apiService.get<KnowledgeDocument>(
        `/knowledge-base/documents/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      return null;
    }
  }

  static async createDocument(
    data: CreateDocumentRequest,
  ): Promise<KnowledgeDocument> {
    try {
      if (data.file) {
        const formData = new FormData();

        // Add document data to form
        Object.keys(data).forEach((key) => {
          if (key !== "file") {
            const value = data[key];
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          }
        });

        // Add file
        formData.append("file", data.file);

        return await apiService.uploadFile<KnowledgeDocument>(
          "/knowledge-base/documents/upload",
          formData,
        );
      }

      return await apiService.post<KnowledgeDocument>(
        "/knowledge-base/documents",
        data,
      );
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  static async updateDocument(
    id: string,
    data: UpdateDocumentRequest,
  ): Promise<KnowledgeDocument> {
    try {
      return await apiService.put<KnowledgeDocument>(
        `/knowledge-base/documents/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteDocument(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/documents/${id}`);
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * File resource methods
   */
  static async uploadFile(data: CreateFileRequest): Promise<FileResource> {
    try {
      const formData = new FormData();

      // Add file resource data to form
      Object.keys(data).forEach((key) => {
        if (key !== "file") {
          const value = data[key];
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      // Add file
      formData.append("file", data.file);

      return await apiService.uploadFile<FileResource>(
        "/knowledge-base/resources/files/upload",
        formData,
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  static async updateFileResource(
    id: string,
    data: UpdateFileRequest,
  ): Promise<FileResource> {
    try {
      return await apiService.put<FileResource>(
        `/knowledge-base/resources/files/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating file resource with ID ${id}:`, error);
      throw error;
    }
  }

  static async reprocessFile(id: string): Promise<FileResource> {
    try {
      return await apiService.post<FileResource>(
        `/knowledge-base/resources/files/${id}/reprocess`,
        {}
      );
    } catch (error) {
      console.error(`Error reprocessing file with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Directory resource methods
   */
  static async createDirectory(data: CreateDirectoryRequest): Promise<DirectoryResource> {
    try {
      return await apiService.post<DirectoryResource>(
        "/knowledge-base/resources/directories",
        data,
      );
    } catch (error) {
      console.error("Error creating directory resource:", error);
      throw error;
    }
  }

  static async updateDirectory(
    id: string,
    data: UpdateDirectoryRequest,
  ): Promise<DirectoryResource> {
    try {
      return await apiService.put<DirectoryResource>(
        `/knowledge-base/resources/directories/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating directory resource with ID ${id}:`, error);
      throw error;
    }
  }

  static async syncDirectory(id: string): Promise<DirectoryResource> {
    try {
      return await apiService.post<DirectoryResource>(
        `/knowledge-base/resources/directories/${id}/sync`,
        {}
      );
    } catch (error) {
      console.error(`Error syncing directory with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Web resource methods
   */
  static async createWebResource(data: CreateWebResourceRequest): Promise<WebResource> {
    try {
      return await apiService.post<WebResource>(
        "/knowledge-base/resources/web",
        data,
      );
    } catch (error) {
      console.error("Error creating web resource:", error);
      throw error;
    }
  }

  static async updateWebResource(
    id: string,
    data: UpdateWebResourceRequest,
  ): Promise<WebResource> {
    try {
      return await apiService.put<WebResource>(
        `/knowledge-base/resources/web/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating web resource with ID ${id}:`, error);
      throw error;
    }
  }

  static async scrapeWebResource(id: string): Promise<WebResource> {
    try {
      return await apiService.post<WebResource>(
        `/knowledge-base/resources/web/${id}/scrape`,
        {}
      );
    } catch (error) {
      console.error(`Error scraping web resource with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Collection methods
   */
  static async getAllCollections(): Promise<ResourceCollection[]> {
    if (!endpointAvailability.collections) {
      console.warn("Collections endpoint unavailable, returning empty results");
      return [];
    }

    try {
      return await apiService.get<ResourceCollection[]>(
        "/knowledge-base/collections",
      );
    } catch (error) {
      console.error("Error fetching knowledge base collections:", error);
      endpointAvailability.collections = false;
      return [];
    }
  }

  static async getCollectionById(id: string): Promise<ResourceCollection | null> {
    try {
      return await apiService.get<ResourceCollection>(
        `/knowledge-base/collections/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching collection with ID ${id}:`, error);
      return null;
    }
  }

  static async createCollection(
    data: CreateCollectionRequest,
  ): Promise<ResourceCollection> {
    try {
      return await apiService.post<ResourceCollection>(
        "/knowledge-base/collections",
        data,
      );
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  }

  static async updateCollection(
    id: string,
    data: UpdateCollectionRequest,
  ): Promise<ResourceCollection> {
    try {
      return await apiService.put<ResourceCollection>(
        `/knowledge-base/collections/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating collection with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteCollection(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/collections/${id}`);
    } catch (error) {
      console.error(`Error deleting collection with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Knowledge Profile methods
   */
  static async getAllProfiles(): Promise<KnowledgeProfile[]> {
    if (!endpointAvailability.profiles) {
      console.warn("Profiles endpoint unavailable, returning empty results");
      return [];
    }

    try {
      // Try to get profiles from the API
      return await apiService.get<KnowledgeProfile[]>(
        "/knowledge-base/profiles",
      );
    } catch (error) {
      console.error("Error fetching knowledge profiles:", error);
      endpointAvailability.profiles = false;
      // Return empty array when API fails
      return [];
    }
  }

  static async getProfileById(id: string): Promise<KnowledgeProfile | null> {
    try {
      return await apiService.get<KnowledgeProfile>(
        `/knowledge-base/profiles/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching profile with ID ${id}:`, error);
      return null;
    }
  }

  static async createProfile(
    data: CreateKnowledgeProfileRequest,
  ): Promise<KnowledgeProfile> {
    try {
      return await apiService.post<KnowledgeProfile>(
        "/knowledge-base/profiles",
        data,
      );
    } catch (error) {
      console.error("Error creating knowledge profile:", error);
      throw error;
    }
  }

  static async updateProfile(
    id: string,
    data: UpdateKnowledgeProfileRequest,
  ): Promise<KnowledgeProfile> {
    try {
      return await apiService.put<KnowledgeProfile>(
        `/knowledge-base/profiles/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating knowledge profile with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteProfile(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/profiles/${id}`);
    } catch (error) {
      console.error(`Error deleting knowledge profile with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Context Scope methods
   */
  static async getAllContextScopes(): Promise<ContextScope[]> {
    if (!endpointAvailability.contextScopes) {
      console.warn("Context scopes endpoint unavailable, returning empty results");
      return [];
    }

    try {
      // Try to get context scopes from the API
      return await apiService.get<ContextScope[]>(
        "/knowledge-base/context-scopes",
      );
    } catch (error) {
      console.error("Error fetching context scopes:", error);
      endpointAvailability.contextScopes = false;
      // Return empty array when API fails
      return [];
    }
  }

  static async getContextScopeById(id: string): Promise<ContextScope | null> {
    try {
      return await apiService.get<ContextScope>(
        `/knowledge-base/context-scopes/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching context scope with ID ${id}:`, error);
      return null;
    }
  }

  static async createContextScope(
    data: CreateContextScopeRequest,
  ): Promise<ContextScope> {
    try {
      return await apiService.post<ContextScope>(
        "/knowledge-base/context-scopes",
        data,
      );
    } catch (error) {
      console.error("Error creating context scope:", error);
      throw error;
    }
  }

  static async updateContextScope(
    id: string,
    data: UpdateContextScopeRequest,
  ): Promise<ContextScope> {
    try {
      return await apiService.put<ContextScope>(
        `/knowledge-base/context-scopes/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating context scope with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteContextScope(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/context-scopes/${id}`);
    } catch (error) {
      console.error(`Error deleting context scope with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Category methods - kept for backward compatibility
   */
  static async getAllCategories(): Promise<DocumentCategory[]> {
    if (!endpointAvailability.categories) {
      console.warn("Categories endpoint unavailable, returning empty results");
      return [];
    }

    try {
      return await apiService.get<DocumentCategory[]>(
        "/knowledge-base/categories",
      );
    } catch (error) {
      console.error("Error fetching knowledge base categories:", error);
      endpointAvailability.categories = false;
      return [];
    }
  }

  static async getCategoryById(id: string): Promise<DocumentCategory | null> {
    try {
      return await apiService.get<DocumentCategory>(
        `/knowledge-base/categories/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  static async createCategory(
    data: CreateCategoryRequest,
  ): Promise<DocumentCategory> {
    try {
      return await apiService.post<DocumentCategory>(
        "/knowledge-base/categories",
        data,
      );
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<DocumentCategory> {
    try {
      return await apiService.put<DocumentCategory>(
        `/knowledge-base/categories/${id}`,
        data,
      );
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Settings methods
   */
  static async getSettings(): Promise<KnowledgeBaseSettings> {
    if (!endpointAvailability.settings) {
      console.warn("Settings endpoint unavailable, returning default settings");
      return {
        isEnabled: true,
        priority: "medium",
        includeCitations: true,
        vectorDimensions: 1536,
        vectorDatabase: "local",
      };
    }

    try {
      return await apiService.get<KnowledgeBaseSettings>(
        "/knowledge-base/settings",
      );
    } catch (error) {
      console.error("Error fetching knowledge base settings:", error);
      endpointAvailability.settings = false;
      // Return default settings
      return {
        isEnabled: true,
        priority: "medium",
        includeCitations: true,
        vectorDimensions: 1536,
        vectorDatabase: "local",
      };
    }
  }

  static async updateSettings(
    settings: UpdateSettingsRequest,
  ): Promise<KnowledgeBaseSettings> {
    try {
      return await apiService.put<KnowledgeBaseSettings>(
        "/knowledge-base/settings",
        settings,
      );
    } catch (error) {
      console.error("Error updating knowledge base settings:", error);
      throw error;
    }
  }

  /**
   * Search methods
   */
  static async searchDocuments(
    query: string,
  ): Promise<PaginatedResponse<KnowledgeDocument>> {
    try {
      return await apiService.get<PaginatedResponse<KnowledgeDocument>>(
        "/knowledge-base/documents/search",
        {
          params: { query },
        },
      );
    } catch (error) {
      console.error(`Error searching documents with query "${query}":`, error);
      return {
        data: [],
        total: 0,
        current_page: 1,
        last_page: 1
      };
    }
  }

  /**
   * Vector search methods - already implemented above
   */
}

export default KnowledgeBaseService;
