
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
  description?: string;
  configuration: Record<string, any>;
  context?: Record<string, any>;
}

export interface RoutingRule {
  id: string;
  name: string;
  modelId: string;
  conditions: RuleCondition[];
  priority: number;
  isActive?: boolean;
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
}

export interface PromptVariable {
  name: string;
  description?: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  category: string;
  description?: string;
  order?: number;
  triggerConditions?: string[];
  isActive?: boolean;
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
  parentId?: string;
  documentCount?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface PermissionCategory {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  categoryId?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  userCount?: number;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewRole {
  name: string;
  description?: string;
  permissions: string[];
}

export interface EditedRole {
  name?: string;
  description?: string;
  permissions?: string[];
}
