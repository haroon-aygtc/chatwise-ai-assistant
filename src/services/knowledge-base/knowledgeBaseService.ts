
import ApiService from "../api/base";
import { 
  KnowledgeDocument, 
  DocumentCategory, 
  KnowledgeBaseSettings,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  UpdateSettingsRequest
} from "@/types/knowledge-base";

/**
 * Service for managing knowledge base documents and categories
 */
class KnowledgeBaseService {
  private static readonly BASE_URL = "/knowledge-base";

  /**
   * Get all documents
   */
  static async getAllDocuments(): Promise<KnowledgeDocument[]> {
    return ApiService.get<KnowledgeDocument[]>(`${this.BASE_URL}/documents`);
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string): Promise<KnowledgeDocument> {
    return ApiService.get<KnowledgeDocument>(`${this.BASE_URL}/documents/${id}`);
  }

  /**
   * Create new document
   */
  static async createDocument(data: CreateDocumentRequest): Promise<KnowledgeDocument> {
    if (data.file) {
      // Handle file upload with multipart/form-data
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('content', data.content || '');
      formData.append('categoryId', data.categoryId);
      formData.append('tags', JSON.stringify(data.tags || []));
      
      return ApiService.post<KnowledgeDocument>(`${this.BASE_URL}/documents/upload`, formData);
    } else {
      // Handle text-only document creation
      return ApiService.post<KnowledgeDocument>(`${this.BASE_URL}/documents`, data);
    }
  }

  /**
   * Update existing document
   */
  static async updateDocument(id: string, data: UpdateDocumentRequest): Promise<KnowledgeDocument> {
    return ApiService.put<KnowledgeDocument>(`${this.BASE_URL}/documents/${id}`, data);
  }

  /**
   * Delete document
   */
  static async deleteDocument(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_URL}/documents/${id}`);
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<DocumentCategory[]> {
    return ApiService.get<DocumentCategory[]>(`${this.BASE_URL}/categories`);
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<DocumentCategory> {
    return ApiService.get<DocumentCategory>(`${this.BASE_URL}/categories/${id}`);
  }

  /**
   * Create new category
   */
  static async createCategory(data: CreateCategoryRequest): Promise<DocumentCategory> {
    return ApiService.post<DocumentCategory>(`${this.BASE_URL}/categories`, data);
  }

  /**
   * Update existing category
   */
  static async updateCategory(id: string, data: UpdateCategoryRequest): Promise<DocumentCategory> {
    return ApiService.put<DocumentCategory>(`${this.BASE_URL}/categories/${id}`, data);
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    return ApiService.delete(`${this.BASE_URL}/categories/${id}`);
  }

  /**
   * Get knowledge base settings
   */
  static async getSettings(): Promise<KnowledgeBaseSettings> {
    return ApiService.get<KnowledgeBaseSettings>(`${this.BASE_URL}/settings`);
  }

  /**
   * Update knowledge base settings
   */
  static async updateSettings(data: UpdateSettingsRequest): Promise<KnowledgeBaseSettings> {
    return ApiService.put<KnowledgeBaseSettings>(`${this.BASE_URL}/settings`, data);
  }

  /**
   * Search documents
   */
  static async searchDocuments(query: string): Promise<KnowledgeDocument[]> {
    return ApiService.get<KnowledgeDocument[]>(`${this.BASE_URL}/documents/search`, { query });
  }
}

export default KnowledgeBaseService;
