
import ApiService, { ApiParams } from "../api/api";
import { KnowledgeDocument, DocumentCategory, KnowledgeBaseSettings, CreateDocumentRequest, UpdateDocumentRequest, CreateCategoryRequest, UpdateCategoryRequest, UpdateSettingsRequest } from "@/types/knowledge-base";
import { PaginatedResponse } from "../api/types";

class KnowledgeBaseService {
  /**
   * Get all documents with pagination
   */
  static async getAllDocuments(
    page: number = 1,
    perPage: number = 20,
    filters: ApiParams = {}
  ): Promise<PaginatedResponse<KnowledgeDocument>> {
    const params = {
      page,
      per_page: perPage,
      ...filters
    };
    return await ApiService.get<PaginatedResponse<KnowledgeDocument>>("/knowledge-base/documents", { params });
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string): Promise<KnowledgeDocument> {
    return await ApiService.get<KnowledgeDocument>(`/knowledge-base/documents/${id}`);
  }

  /**
   * Create a new document
   */
  static async createDocument(data: CreateDocumentRequest): Promise<KnowledgeDocument> {
    if (data.file) {
      const formData = new FormData();

      // Add document data to form
      Object.keys(data).forEach(key => {
        if (key !== 'file') {
          const value = data[key];
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      // Add file
      formData.append('file', data.file);

      return await ApiService.uploadFile<KnowledgeDocument>("/knowledge-base/documents/upload", formData);
    }

    return await ApiService.post<KnowledgeDocument>("/knowledge-base/documents", data);
  }

  /**
   * Update an existing document
   */
  static async updateDocument(id: string, data: UpdateDocumentRequest): Promise<KnowledgeDocument> {
    return await ApiService.put<KnowledgeDocument>(`/knowledge-base/documents/${id}`, data);
  }

  /**
   * Delete a document
   */
  static async deleteDocument(id: string): Promise<void> {
    await ApiService.delete(`/knowledge-base/documents/${id}`);
  }

  /**
   * Search documents
   */
  static async searchDocuments(query: string): Promise<PaginatedResponse<KnowledgeDocument>> {
    return await ApiService.get<PaginatedResponse<KnowledgeDocument>>("/knowledge-base/documents/search", {
      params: { query }
    });
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<DocumentCategory[]> {
    return await ApiService.get<DocumentCategory[]>("/knowledge-base/categories");
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<DocumentCategory> {
    return await ApiService.get<DocumentCategory>(`/knowledge-base/categories/${id}`);
  }

  /**
   * Create a new category
   */
  static async createCategory(data: CreateCategoryRequest): Promise<DocumentCategory> {
    return await ApiService.post<DocumentCategory>("/knowledge-base/categories", data);
  }

  /**
   * Update an existing category
   */
  static async updateCategory(id: string, data: UpdateCategoryRequest): Promise<DocumentCategory> {
    return await ApiService.put<DocumentCategory>(`/knowledge-base/categories/${id}`, data);
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<void> {
    await ApiService.delete(`/knowledge-base/categories/${id}`);
  }

  /**
   * Get knowledge base settings
   */
  static async getSettings(): Promise<KnowledgeBaseSettings> {
    return await ApiService.get<KnowledgeBaseSettings>("/knowledge-base/settings");
  }

  /**
   * Update knowledge base settings
   */
  static async updateSettings(settings: UpdateSettingsRequest): Promise<KnowledgeBaseSettings> {
    return await ApiService.put<KnowledgeBaseSettings>("/knowledge-base/settings", settings);
  }
}

export default KnowledgeBaseService;
