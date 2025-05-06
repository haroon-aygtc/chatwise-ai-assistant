
/**
 * Types for AI Configuration System
 */

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey?: string;
  baseUrl?: string;
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
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  template: string;
  variables: string[];
  category: string;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplateCategory {
  id: string;
  name: string;
  description?: string;
  templates?: PromptTemplate[];
}

export interface RoutingRule {
  id: string;
  name: string;
  description?: string;
  condition: {
    field: string;
    operator: string;
    value: string | number | boolean;
  }[];
  modelId: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  content: string;
  systemInstructions?: string;
  parameters?: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  length?: string;
  format?: string;
  tone?: string;
  options?: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
}

export interface CreateResponseFormatRequest {
  name: string;
  description?: string;
  content: string;
  systemInstructions?: string;
  parameters?: Record<string, any>;
  isDefault?: boolean;
}

export interface KnowledgeBaseSource {
  id: string;
  name: string;
  type: 'document' | 'webpage' | 'database' | 'api';
  configuration: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemPrompt {
  id: string;
  content: string;
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
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  models?: AIModel[];
}

export interface ModelCapability {
  id: string;
  name: string;
  description: string;
  models?: AIModel[];
}
