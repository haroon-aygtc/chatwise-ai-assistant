export interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  isActive: boolean;
  isDefault: boolean;
  capabilities: {
    chat: boolean;
    completion: boolean;
    embeddings: boolean;
    vision: boolean;
  };
  pricePerToken: number;
  contextSize: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  version?: string; // Added version property
  configuration: Record<string, unknown>;
  context?: Record<string, unknown>;
  apiKey?: string;
  baseUrl?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  condition: string;
  targetModel: string;
  priority: number;
  isActive: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  slug: string;
  description?: string;
  apiEndpoint?: string;
  apiKeyRequired: boolean;
  apiKeyName: string;
  baseUrlRequired: boolean;
  baseUrlName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  slug: string;
  description?: string;
  apiKeyName: string;
  apiKeyRequired: boolean;
  baseUrlRequired: boolean;
  baseUrlName?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  category: string;
  description?: string;
  is_active: boolean;
  trigger_conditions: string[];
  parent_id?: string;
  child_ids?: string[];
}

export interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  format: string;
  is_default: boolean;
  structure: string;
  variables: string[];
  markdown_support: boolean;
  is_active: boolean;
}

export interface AIConfigurationSection {
  id: string;
  name: string;
  key: string;
  description?: string;
  path: string;
  isImplemented: boolean;
  icon?: React.ReactNode;
}

export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  is_default: boolean;
  variables: string[];
  category: string;
  model_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BrandVoice {
  id: string;
  name: string;
  description: string;
  tone: string[];
  positioning: string;
  brandName: string;
  signature: string;
  examples: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentCount: number;
}

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

export interface CreateResponseFormatRequest {
  name: string;
  description?: string;
  format: string;
  length: string;
  tone: string;
  isDefault?: boolean;
  options: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
}
