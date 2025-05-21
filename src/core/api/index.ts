/**
 * API Module
 *
 * Central export point for all API-related functionality
 */

// Core API client and service
export { apiClient, createClient } from "./client";
export { apiService } from "./service";
export type { ApiParams } from "./service";

// Configuration
export {
  getConfig,
  getBackendUrl,
  isPublicApiMode,
  setPublicApiMode,
} from "./config";
export {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  PERMISSION_ENDPOINTS,
  AI_ENDPOINTS,
  KB_ENDPOINTS,
  WIDGET_ENDPOINTS,
} from "./config";

// Error handling
export { ApiError, formatValidationErrors, getErrorMessage } from "./errors";

// Types
export type { ApiConfig } from "./config";
