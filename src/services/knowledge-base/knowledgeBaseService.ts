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
} from "@/types/knowledge-base";
import { PaginatedResponse } from "../api/types";

class KnowledgeBaseService {
  /**
   * Get all documents with pagination
   */
  static async getAllDocuments(
    page: number = 1,
    perPage: number = 20,
    filters: ApiParams = {},
  ): Promise<PaginatedResponse<KnowledgeDocument>> {
    const params = {
      page,
      per_page: perPage,
      ...filters,
    };
    try {
      return await apiService.get<PaginatedResponse<KnowledgeDocument>>(
        "/knowledge-base/documents",
        { params },
      );
    } catch (error) {
      console.error("Error fetching knowledge base documents:", error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string): Promise<KnowledgeDocument> {
    try {
      return await apiService.get<KnowledgeDocument>(
        `/knowledge-base/documents/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new document
   */
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

  /**
   * Update an existing document
   */
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

  /**
   * Delete a document
   */
  static async deleteDocument(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/documents/${id}`);
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search documents
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
      throw error;
    }
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<DocumentCategory[]> {
    try {
      return await apiService.get<DocumentCategory[]>(
        "/knowledge-base/categories",
      );
    } catch (error) {
      console.error("Error fetching knowledge base categories:", error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<DocumentCategory> {
    try {
      return await apiService.get<DocumentCategory>(
        `/knowledge-base/categories/${id}`,
      );
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new category
   */
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

  /**
   * Update an existing category
   */
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

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiService.delete(`/knowledge-base/categories/${id}`);
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get knowledge base settings
   */
  static async getSettings(): Promise<KnowledgeBaseSettings> {
    try {
      return await apiService.get<KnowledgeBaseSettings>(
        "/knowledge-base/settings",
      );
    } catch (error) {
      console.error("Error fetching knowledge base settings:", error);
      throw error;
    }
  }

  /**
   * Update knowledge base settings
   */
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
}

export default KnowledgeBaseService;
