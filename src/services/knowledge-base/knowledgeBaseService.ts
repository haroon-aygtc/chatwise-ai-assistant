
import ApiService from "../api/base";
import { KnowledgeDocument, DocumentCategory } from "@/types";
import { PaginatedResponse } from "@/services/api/types";

interface ApiListResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}

interface ApiItemResponse<T> {
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
    return await ApiService.get<PaginatedResponse<KnowledgeDocument>>(
      "/knowledge-base/documents",
      { params }
    );
  },

  /**
   * Get a document by ID
   */
  getDocumentById: async (id: string): Promise<KnowledgeDocument> => {
    return await ApiService.get<KnowledgeDocument>(
      `/knowledge-base/documents/${id}`
    );
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

      return await ApiService.post<KnowledgeDocument>(
        "/knowledge-base/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    return await ApiService.post<KnowledgeDocument>(
      "/knowledge-base/documents",
      data
    );
  },

  /**
   * Update an existing document
   */
  updateDocument: async (
    id: string,
    data: Partial<KnowledgeDocument>
  ): Promise<KnowledgeDocument> => {
    return await ApiService.put<KnowledgeDocument>(
      `/knowledge-base/documents/${id}`,
      data
    );
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
  searchDocuments: async (
    query: string
  ): Promise<PaginatedResponse<KnowledgeDocument>> => {
    return await ApiService.get<PaginatedResponse<KnowledgeDocument>>(
      "/knowledge-base/documents/search",
      {
        params: { query },
      }
    );
  },

  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<DocumentCategory[]> => {
    return await ApiService.get<DocumentCategory[]>(
      "/knowledge-base/categories"
    );
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string): Promise<DocumentCategory> => {
    return await ApiService.get<DocumentCategory>(
      `/knowledge-base/categories/${id}`
    );
  },

  /**
   * Create a new category
   */
  createCategory: async (
    data: Partial<DocumentCategory>
  ): Promise<DocumentCategory> => {
    return await ApiService.post<DocumentCategory>(
      "/knowledge-base/categories",
      data
    );
  },

  /**
   * Update an existing category
   */
  updateCategory: async (
    id: string,
    data: Partial<DocumentCategory>
  ): Promise<DocumentCategory> => {
    return await ApiService.put<DocumentCategory>(
      `/knowledge-base/categories/${id}`,
      data
    );
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
    return await ApiService.get<any>("/knowledge-base/settings");
  },

  /**
   * Update knowledge base settings
   */
  updateSettings: async (settings: any): Promise<any> => {
    return await ApiService.put<any>("/knowledge-base/settings", settings);
  },
};

export default knowledgeBaseService;
