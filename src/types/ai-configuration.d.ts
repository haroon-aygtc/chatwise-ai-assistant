
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version?: string; // Make version optional
  apiKey?: string;
  isActive: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  configuration: {
    temperature: number;
    maxTokens: number;
    [key: string]: any;
  };
}

export interface ModelProvider {
  id: string;
  name: string;
  slug: string;
  apiEndpoint?: string;
  apiKeyRequired: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  description?: string;
  modelId: string;
  conditions: RuleCondition[];
  priority: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

export interface PromptTemplateVariable {
  name: string;
  description?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  template: string;
  category: string;
  variables: PromptTemplateVariable[];
  isActive: boolean;
  isDefault?: boolean;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromptTemplateCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface SystemPrompt {
  id: string;
  content: string;
  updatedAt?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description?: string;
  documentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
