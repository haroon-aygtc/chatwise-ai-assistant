
/**
 * Knowledge Base Types
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  uploadedAt: string;
  lastUpdated: string;
  status: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
}

export interface KnowledgeBaseSettings {
  isEnabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'exclusive';
  includeCitations: boolean;
}

// Request/Response Types
export interface CreateDocumentRequest {
  title: string;
  description: string;
  content: string;
  categoryId: string;
  tags: string[];
  file?: File;
  [key: string]: unknown;
}

export interface UpdateDocumentRequest {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  categoryId?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  [key: string]: unknown;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface UpdateSettingsRequest {
  isEnabled?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'exclusive';
  includeCitations?: boolean;
  [key: string]: unknown;
}
