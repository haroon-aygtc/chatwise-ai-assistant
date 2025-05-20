export type AIProvider =
  | "OpenAI"
  | "Google"
  | "Anthropic"
  | "HuggingFace"
  | "OpenRouter"
  | "Groq"
  | "Mistral"
  | "TogetherAI"
  | "Gemini"
  | "Custom";

export interface BaseModelConfiguration {
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface OpenAIConfiguration extends BaseModelConfiguration {
  model: string;
  organization?: string;
}

export interface GoogleConfiguration extends BaseModelConfiguration {
  model: string;
  safetySettings?: Record<string, unknown>;
}

export interface AnthropicConfiguration extends BaseModelConfiguration {
  model: string;
  topK?: number;
}

export interface HuggingFaceConfiguration extends BaseModelConfiguration {
  model: string;
  task?: string;
  waitForModel?: boolean;
}

export interface OpenRouterConfiguration extends BaseModelConfiguration {
  model: string;
  routeType?: "fallback" | "fastest" | "lowest-cost";
}

export interface GroqConfiguration extends BaseModelConfiguration {
  model: string;
}

export interface MistralConfiguration extends BaseModelConfiguration {
  model: string;
  safePrompt?: boolean;
}

export interface TogetherAIConfiguration extends BaseModelConfiguration {
  model: string;
  repetitionPenalty?: number;
}

export interface GeminiConfiguration extends BaseModelConfiguration {
  model: string;
  topK?: number;
  safetySettings?: Record<string, unknown>;
}

export interface CustomConfiguration extends BaseModelConfiguration {
  model?: string;
  [key: string]: unknown;
}

export type ModelConfiguration =
  | OpenAIConfiguration
  | GoogleConfiguration
  | AnthropicConfiguration
  | HuggingFaceConfiguration
  | OpenRouterConfiguration
  | GroqConfiguration
  | MistralConfiguration
  | TogetherAIConfiguration
  | GeminiConfiguration
  | CustomConfiguration;

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  version: string;
  description?: string;
  apiKey?: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;

  // Model specific fields
  modelId?: string;
  isActive?: boolean;
  isDefault?: boolean;
  capabilities?: {
    chat: boolean;
    completion: boolean;
    embeddings: boolean;
    vision: boolean;
  };
  pricePerToken?: number;
  contextSize?: number;
  configuration: ModelConfiguration;
  context?: Record<string, unknown>;
  baseUrl?: string;

  // Shorthand properties for backward compatibility
  maxTokens?: number;
  temperature?: number;
}

export interface ResponseFormat {
  id: string;
  name: string;
  description?: string;
  format: string;
  template?: string;
  systemInstructions?: string;
  content?: string;
  sources?: string[];
  active: boolean; // Required field - not optional
  createdAt?: string;
  updatedAt?: string;

  // Added properties to match other usages in the codebase
  isDefault?: boolean;
  length?: string;
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
  format: string;
  template?: string;
  systemInstructions?: string;
  content?: string;
  sources?: string[];
  active?: boolean; // Optional in request, we set default in service

  // Added fields to match other usages
  length?: string;
  tone?: string;
  isDefault?: boolean;
  options?: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
}

// Added missing types that are used in other files
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

export interface SystemPrompt {
  id: string;
  content: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  isActive?: boolean;
}

export interface ModelProvider {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
