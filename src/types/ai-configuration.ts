/**
 * Types for AI configuration
 */

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  description?: string;
  isActive: boolean;
  apiKey?: string;
  configuration: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    [key: string]: any;
  };
}

export interface RoutingRule {
  id: string;
  name: string;
  description?: string;
  modelId: string;
  conditions: RuleCondition[];
  priority: number;
}

export interface RuleCondition {
  field: string;
  operator: "equals" | "contains" | "startsWith" | "endsWith" | "regex";
  value: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  template: string;
  variables: PromptVariable[];
  category?: string;
  isActive: boolean;
}

export interface PromptVariable {
  name: string;
  description?: string;
  defaultValue?: string;
  required: boolean;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  description?: string;
  type: "document" | "website" | "api" | "database";
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
  lastUpdated?: string;
  isActive: boolean;
}

export interface ResponseFormat {
  id: string;
  name: string;
  format: "conversational" | "structured" | "bullet-points" | "step-by-step";
  length: "concise" | "medium" | "detailed";
  tone: "professional" | "friendly" | "casual" | "technical";
  options: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
}

export interface BrandingConfig {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  voiceStyle: "formal" | "casual" | "friendly" | "technical" | "enthusiastic";
  brandPersonality: string[];
  keyPhrases: string[];
  avoidPhrases: string[];
  positioning: "start" | "end" | "inline";
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  category?: string;
  context?: string[];
  isActive: boolean;
  priority?: number;
}
