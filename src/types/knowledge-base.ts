/**
 * Knowledge Base Types
 */

// Import PaginationParams from API types
import { PaginationParams } from "../services/api/types";

export type ResourceType = 'DIRECTORY' | 'ARTICLE' | 'FAQ' | 'FILE_UPLOAD';
export type ResourceStatus = 'ACTIVE' | 'INACTIVE' | 'PROCESSING' | 'ERROR';
export type FileType = 'PDF' | 'DOCX' | 'XLSX' | 'TXT' | 'CSV' | 'JSON' | 'HTML' | 'MD' | 'OTHER';

// Re-export PaginationParams for use in knowledge base types
export type { PaginationParams };

export interface KnowledgeResource {
  id: string;
  title: string;
  description: string;
  resourceType: ResourceType;
  collectionId?: string;
  collectionName?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // File specific
  fileType?: string;
  fileSize?: number;
  // Directory specific
  path?: string;
  fileCount?: number;
  lastSyncedAt?: string;
  recursive?: boolean;
  includePatterns?: string[];
  excludePatterns?: string[];
  // Article & FAQ specific
  content?: string;
  categoryId?: string;
  isDraft?: boolean;
  // Additional properties as needed
}

export interface KnowledgeDocument extends KnowledgeResource {
  content: string;
  categoryId: string;
}

export interface FileResource extends KnowledgeResource {
  fileType: FileType;
  fileSize: number;
  filePath: string;
  processingStatus?: 'QUEUED' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  processingError?: string;
  extractedText?: string;
  vectorized: boolean;
}

export interface DirectoryResource extends KnowledgeResource {
  path: string;
  recursive: boolean;
  fileTypes: FileType[] | string[];
  includePatterns: string[];
  excludePatterns: string[];
  lastSyncedAt?: string;
  syncStatus?: 'NEVER_SYNCED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  status?: 'IDLE' | 'PROCESSING' | 'ERROR' | 'COMPLETED';
  syncProgress?: number;
  filesIndexed?: number;
  totalFiles?: number;
}

export interface ArticleResource extends KnowledgeResource {
  content: string;
  authorId: string;
  publishedAt?: string;
  isDraft: boolean;
  version: number;
}

export interface FAQResource extends KnowledgeResource {
  question: string;
  answer: string;
  category: string;
}

export interface WebResource extends KnowledgeResource {
  url: string;
  lastScrapedAt?: string;
  scrapingDepth: number;
  includeSelectorPatterns: string[];
  excludeSelectorPatterns: string[];
  scrapingStatus?: 'NEVER_SCRAPED' | 'SCRAPING' | 'SCRAPED' | 'FAILED';
}

export interface ResourceCollection {
  id: string;
  name: string;
  description: string;
  resourceCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
}

export interface KnowledgeProfile {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isDefault?: boolean;
  collectionIds: string[];
  contextScopes?: string[];
  contextScopeIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseSettings {
  isEnabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'exclusive';
  includeCitations: boolean;
  defaultKnowledgeProfileId?: string;
  vectorDimensions: number;
  vectorDatabase: 'local' | 'pinecone' | 'qdrant' | 'milvus';
  vectorDbApiKey?: string;
  vectorDbUrl?: string;
  vectorDbIndex?: string;
}

export interface ContextScope {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  scopeType: string;
  conditions: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateResourceRequest {
  title: string;
  description: string;
  resourceType: ResourceType;
  collectionId: string;
  tags: string[];
  contextScope?: string[];
  isActive?: boolean;
  [key: string]: unknown;
}

export interface CreateDocumentRequest extends CreateResourceRequest {
  content: string;
  categoryId: string;
  file?: File;
}

export interface CreateFileRequest extends CreateResourceRequest {
  file: File;
}

export interface CreateDirectoryRequest extends CreateResourceRequest {
  path: string;
  recursive: boolean;
  fileTypes: FileType[];
  includePatterns: string[];
  excludePatterns: string[];
}

export interface CreateArticleRequest extends CreateResourceRequest {
  content: string;
  isDraft?: boolean;
}

export interface CreateFAQRequest extends CreateResourceRequest {
  question: string;
  answer: string;
  category: string;
}

export interface CreateWebResourceRequest extends CreateResourceRequest {
  url: string;
  scrapingDepth: number;
  includeSelectorPatterns: string[];
  excludeSelectorPatterns: string[];
}

export interface UpdateResourceRequest {
  id: string;
  title?: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
  contextScope?: string[];
  [key: string]: unknown;
}

export interface UpdateDocumentRequest extends UpdateResourceRequest {
  content?: string;
  categoryId?: string;
}

export interface UpdateFileRequest extends UpdateResourceRequest {
  reprocess?: boolean;
}

export interface UpdateDirectoryRequest extends UpdateResourceRequest {
  path?: string;
  recursive?: boolean;
  fileTypes?: FileType[] | string[];
  includePatterns?: string[];
  excludePatterns?: string[];
  syncNow?: boolean;
}

export interface UpdateArticleRequest extends UpdateResourceRequest {
  content?: string;
  isDraft?: boolean;
}

export interface UpdateFAQRequest extends UpdateResourceRequest {
  question?: string;
  answer?: string;
  category?: string;
}

export interface UpdateWebResourceRequest extends UpdateResourceRequest {
  url?: string;
  scrapingDepth?: number;
  includeSelectorPatterns?: string[];
  excludeSelectorPatterns?: string[];
  scrapeNow?: boolean;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  isActive?: boolean;
  [key: string]: unknown;
}

export interface UpdateCollectionRequest {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
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

export interface CreateKnowledgeProfileRequest {
  name: string;
  description: string;
  collectionIds: string[];
  contextScopes: string[];
  isActive?: boolean;
  [key: string]: unknown;
}

export interface UpdateKnowledgeProfileRequest {
  id: string;
  name?: string;
  description?: string;
  collectionIds?: string[];
  contextScopes?: string[];
  isActive?: boolean;
  [key: string]: unknown;
}

export interface CreateContextScopeRequest {
  name: string;
  description: string;
  filterType: 'TAG' | 'PATH' | 'COLLECTION' | 'CUSTOM';
  filterValues: string[];
  [key: string]: unknown;
}

export interface UpdateContextScopeRequest {
  name: string;
  description?: string;
  isActive: boolean;
  scopeType: string;
  conditions: Record<string, any>;
  [key: string]: unknown;
}

export interface UpdateSettingsRequest {
  isEnabled?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'exclusive';
  includeCitations?: boolean;
  defaultKnowledgeProfileId?: string;
  vectorDimensions?: number;
  vectorDatabase?: 'local' | 'pinecone' | 'qdrant' | 'milvus';
  vectorDbApiKey?: string;
  vectorDbUrl?: string;
  vectorDbIndex?: string;
  [key: string]: unknown;
}

export interface SearchResourcesRequest {
  query: string;
  limit?: number;
  resourceTypes?: ResourceType[];
  collectionIds?: string[];
  contextScopes?: string[];
  tags?: string[];
  isActive?: boolean;
  [key: string]: unknown;
}
