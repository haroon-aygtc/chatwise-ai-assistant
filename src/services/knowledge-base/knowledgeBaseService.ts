
import ApiService from "../api/base";
import {
  KnowledgeDocument,
  DocumentCategory as KnowledgeBaseDocumentCategory,
} from "@/types/knowledge-base";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}

interface ApiResponse<T> {
  data: T;
}

/**
 * Service for managing knowledge base documents and categories
 */
export const knowledgeBaseService = {
  /**
   * Get all documents
   */
  getAllDocuments: async (
    page: number = 1,
    perPage: number = 20,
    filters?: any
  ): Promise<PaginatedResponse<KnowledgeDocument>> => {
    const params = {
      page,
      per_page: perPage,
      ...filters,
    };
    const response = await ApiService.get<PaginatedResponse<KnowledgeDocument>>(
      "/knowledge-base/documents",
      { params }
    );
    return response;
  },

  /**
   * Get a document by ID
   */
  getDocumentById: async (id: string): Promise<KnowledgeDocument> => {
    const response = await ApiService.get<ApiResponse<KnowledgeDocument>>(
      `/knowledge-base/documents/${id}`
    );
    return response.data;
  },

  /**
   * Create a new document
   */
  createDocument: async (
    data: Partial<KnowledgeDocument>,
    file?: File
  ): Promise<KnowledgeDocument> => {
    if (file) {
      const formData = new FormData();

      // Add all document data to form
      Object.keys(data).forEach((key) => {
        // @ts-ignore
        formData.append(key, data[key]);
      });

      // Add file
      formData.append("file", file);

      const response = await ApiService.post<ApiResponse<KnowledgeDocument>>(
        "/knowledge-base/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    }

    const response = await ApiService.post<ApiResponse<KnowledgeDocument>>(
      "/knowledge-base/documents",
      data
    );
    return response.data;
  },

  /**
   * Update an existing document
   */
  updateDocument: async (
    id: string,
    data: Partial<KnowledgeDocument>
  ): Promise<KnowledgeDocument> => {
    const response = await ApiService.put<ApiResponse<KnowledgeDocument>>(
      `/knowledge-base/documents/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: string): Promise<void> => {
    await ApiService.delete(`/knowledge-base/documents/${id}`);
  },

  /**
   * Search for documents
   */
  searchDocuments: async (query: string): Promise<KnowledgeDocument[]> => {
    const response = await ApiService.get<ApiResponse<KnowledgeDocument[]>>(
      "/knowledge-base/documents/search",
      {
        params: { query },
      }
    );
    return response.data;
  },

  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<KnowledgeBaseDocumentCategory[]> => {
    const response = await ApiService.get<
      ApiResponse<KnowledgeBaseDocumentCategory[]>
    >("/knowledge-base/categories");
    return response.data;
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (
    id: string
  ): Promise<KnowledgeBaseDocumentCategory> => {
    const response = await ApiService.get<
      ApiResponse<KnowledgeBaseDocumentCategory>
    >(`/knowledge-base/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  createCategory: async (
    data: Partial<KnowledgeBaseDocumentCategory>
  ): Promise<KnowledgeBaseDocumentCategory> => {
    const response = await ApiService.post<
      ApiResponse<KnowledgeBaseDocumentCategory>
    >("/knowledge-base/categories", data);
    return response.data;
  },

  /**
   * Update an existing category
   */
  updateCategory: async (
    id: string,
    data: Partial<KnowledgeBaseDocumentCategory>
  ): Promise<KnowledgeBaseDocumentCategory> => {
    const response = await ApiService.put<
      ApiResponse<KnowledgeBaseDocumentCategory>
    >(`/knowledge-base/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<void> => {
    await ApiService.delete(`/knowledge-base/categories/${id}`);
  },

  /**
   * Get knowledge base settings
   */
  getSettings: async (): Promise<any> => {
    const response = await ApiService.get<ApiResponse<any>>(
      "/knowledge-base/settings"
    );
    return response.data;
  },

  /**
   * Update knowledge base settings
   */
  updateSettings: async (settings: any): Promise<any> => {
    const response = await ApiService.put<ApiResponse<any>>(
      "/knowledge-base/settings",
      settings
    );
    return response.data;
  },
};

export default knowledgeBaseService;
