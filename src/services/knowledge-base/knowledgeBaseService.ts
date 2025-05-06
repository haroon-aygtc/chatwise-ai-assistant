
import ApiService from '../api/base';
import { KnowledgeDocument, DocumentCategory as KnowledgeBaseDocumentCategory } from '@/types/knowledge-base';

/**
 * Service for managing knowledge base documents and categories
 */
export const knowledgeBaseService = {
  /**
   * Get all documents
   */
  getAllDocuments: async (page: number = 1, perPage: number = 20, filters?: any): Promise<{
    data: KnowledgeDocument[];
    total: number;
    current_page: number;
    last_page: number;
  }> => {
    const params = {
      page,
      per_page: perPage,
      ...filters
    };
    return ApiService.get('/knowledge-base/documents', { params });
  },

  /**
   * Get a document by ID
   */
  getDocumentById: async (id: string): Promise<KnowledgeDocument> => {
    return ApiService.get(`/knowledge-base/documents/${id}`);
  },

  /**
   * Create a new document
   */
  createDocument: async (data: Partial<KnowledgeDocument>, file?: File): Promise<KnowledgeDocument> => {
    if (file) {
      const formData = new FormData();
      
      // Add all document data to form
      Object.keys(data).forEach(key => {
        // @ts-ignore
        formData.append(key, data[key]);
      });
      
      // Add file
      formData.append('file', file);
      
      return ApiService.post('/knowledge-base/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
    
    return ApiService.post('/knowledge-base/documents', data);
  },

  /**
   * Update an existing document
   */
  updateDocument: async (id: string, data: Partial<KnowledgeDocument>): Promise<KnowledgeDocument> => {
    return ApiService.put(`/knowledge-base/documents/${id}`, data);
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: string): Promise<void> => {
    return ApiService.delete(`/knowledge-base/documents/${id}`);
  },

  /**
   * Search for documents
   */
  searchDocuments: async (query: string): Promise<KnowledgeDocument[]> => {
    return ApiService.get('/knowledge-base/documents/search', { params: { query } });
  },

  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<KnowledgeBaseDocumentCategory[]> => {
    return ApiService.get('/knowledge-base/categories');
  },

  /**
   * Get a category by ID
   */
  getCategoryById: async (id: string): Promise<KnowledgeBaseDocumentCategory> => {
    return ApiService.get(`/knowledge-base/categories/${id}`);
  },

  /**
   * Create a new category
   */
  createCategory: async (data: Partial<KnowledgeBaseDocumentCategory>): Promise<KnowledgeBaseDocumentCategory> => {
    return ApiService.post('/knowledge-base/categories', data);
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id: string, data: Partial<KnowledgeBaseDocumentCategory>): Promise<KnowledgeBaseDocumentCategory> => {
    return ApiService.put(`/knowledge-base/categories/${id}`, data);
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<void> => {
    return ApiService.delete(`/knowledge-base/categories/${id}`);
  },

  /**
   * Get knowledge base settings
   */
  getSettings: async (): Promise<any> => {
    return ApiService.get('/knowledge-base/settings');
  },

  /**
   * Update knowledge base settings
   */
  updateSettings: async (settings: any): Promise<any> => {
    return ApiService.put('/knowledge-base/settings', settings);
  }
};

export default knowledgeBaseService;
