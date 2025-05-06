
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
  apiKey: string;
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
  category: string;
  variables: string[];
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
