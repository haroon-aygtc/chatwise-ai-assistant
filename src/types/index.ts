/**
 * Core Domain Types
 *
 * Contains the main entity types used across the application.
 * API-specific types (requests/responses) are in @/services/api/types
 */

// Export all types from domain.ts (our source of truth)
export * from "./domain";

// Selectively re-export from other files to avoid duplication
// These files should not define their own versions of types already in domain.ts

// Export AI configuration specific types that don't duplicate domain.ts
export type {
  AIModel,
  RoutingRule,
  RuleCondition,
  PromptTemplate,
  PromptVariable,
  FollowUpSuggestion,
  BrandVoice,
  DocumentCategory,
  KnowledgeDocument,
  ResponseFormat,
} from "./ai-configuration";

// Re-export knowledge base types
export * from './knowledge-base';

// Export analytics types
export type {
  WidgetAnalytics,
  WidgetInteractions,
  MessageMetrics,
  WidgetPerformance,
  WidgetUsage,
  SatisfactionMetrics,
  WidgetTrends,
  TimeSeriesData,
  AnalyticsOverview,
  ChatMetrics,
  UsageMetrics,
  PerformanceMetrics,
  UserFeedback,
  CustomizationOptions,
  AnalyticsDateRange
} from './analytics';

// We don't need to re-export anything from user.ts as the User interface
// is already defined in domain.ts and there are no other unique types.
