
import {
  Permission,
  PermissionCategory,
  Role,
  NewRole,
  EditedRole,
  DateRange,
} from "./domain";

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
  configuration: Record<string, unknown>;
  context?: Record<string, unknown>;
  apiKey?: string;
  baseUrl?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  modelId: string;
  conditions: RuleCondition[];
  priority: number;
  isActive?: boolean;
  description?: string;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: PromptVariable[];
  content?: string;
  isDefault?: boolean;
  category?: string;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface PromptVariable {
  name: string;
  description?: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface PromptTemplateCategory {
  id: string;
  name: string;
  description?: string;
  templates?: PromptTemplate[];
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  category: string;
  description?: string;
  order?: number;
  is_active?: boolean;
  trigger_conditions?: string[];
  createdAt?: string;
  updatedAt?: string;
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

export interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  format: string;
  length: string;
  tone: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  options: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
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

/**
 * System Prompt
 * Represents the system-wide prompt template used as a base for all AI interactions
 */
export interface SystemPrompt {
  id: string;
  content: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
}



