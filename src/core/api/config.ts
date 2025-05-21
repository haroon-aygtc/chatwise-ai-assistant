/**
 * API Configuration
 *
 * Centralized configuration for API settings, endpoints, and environment-specific options
 */

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  debug: boolean;
  headers: Record<string, string>;
}

/**
 * Get the API base URL based on environment
 */
function getApiBaseUrl(): string {
  // If full API URL is defined, use that directly
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // If separate components are defined, construct the URL
  if (import.meta.env.VITE_BACKEND_HOST) {
    const protocol = import.meta.env.VITE_BACKEND_PROTOCOL || "http";
    const host = import.meta.env.VITE_BACKEND_HOST;
    const port = import.meta.env.VITE_BACKEND_PORT
      ? `:${import.meta.env.VITE_BACKEND_PORT}`
      : "";
    const path = import.meta.env.VITE_BACKEND_PATH || "api";

    return `${protocol}://${host}${port}/${path}`;
  }

  // Default: Use relative path (same origin as frontend)
  return "/api";
}

/**
 * Get the backend URL without the /api suffix
 * Used for CSRF token endpoint and other non-API endpoints
 */
export function getBackendUrl(): string {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace(/\/api\/?$/, "");
}

/**
 * Get the API configuration
 */
export function getConfig(): ApiConfig {
  return {
    baseUrl: getApiBaseUrl(),
    timeout: 30000, // 30 seconds
    debug: import.meta.env.DEV || false,
    headers: {
      "X-App-Version": import.meta.env.VITE_APP_VERSION || "1.0.0",
      "X-App-Platform": "web",
    },
  };
}

/**
 * Check if we're in public API mode (no auth)
 */
export const isPublicApiMode = (): boolean => {
  return (
    import.meta.env.VITE_PUBLIC_API_MODE === "true" ||
    localStorage.getItem("publicApiMode") === "true"
  );
};

/**
 * Set public API mode
 */
export const setPublicApiMode = (value: boolean): void => {
  localStorage.setItem("publicApiMode", value.toString());
  // Force reload to apply changes
  window.location.reload();
};

/**
 * API Endpoints organized by domain
 */

// Auth endpoints
export const AUTH_ENDPOINTS = Object.freeze({
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  CURRENT_USER: "/user",
  CHECK_AUTH: "/check-auth",
  RESET_PASSWORD_REQUEST: "/password/reset-request",
  RESET_PASSWORD: "/password/reset",
  VERIFY_EMAIL: "/verify-email",
});

// User endpoints
export const USER_ENDPOINTS = Object.freeze({
  USERS: "/users",
  USER_ROLES: (id: string) => `/users/${id}/roles`,
  USER_STATUS: (id: string) => `/users/${id}/status`,
  USER_PERMISSIONS: (id: string) => `/users/${id}/permissions`,
  ASSIGN_ROLES: (id: string) => `/users/${id}/assign-roles`,
});

// Permissions endpoints
export const PERMISSION_ENDPOINTS = Object.freeze({
  PERMISSIONS: "/permissions",
  PERMISSION_CATEGORIES: "/permissions/categories",
});

// AI Configuration endpoints
export const AI_ENDPOINTS = Object.freeze({
  MODELS: "/ai/models",
  PROVIDERS: "/ai/providers",
  ROUTING_RULES: "/ai/routing-rules",
  PROMPT_TEMPLATES: "/ai/prompt-templates",
  RESPONSE_FORMATS: "/ai/response-formats",
  FOLLOW_UP: "/ai/follow-up",
  SYSTEM_PROMPTS: "/ai/system-prompts",
});

// Knowledge Base endpoints
export const KB_ENDPOINTS = Object.freeze({
  RESOURCES: "/knowledge-base/resources",
  DOCUMENTS: "/knowledge-base/documents",
  CATEGORIES: "/knowledge-base/categories",
  COLLECTIONS: "/knowledge-base/collections",
  PROFILES: "/knowledge-base/profiles",
  CONTEXT_SCOPES: "/knowledge-base/context-scopes",
  SETTINGS: "/knowledge-base/settings",
});

// Widget endpoints
export const WIDGET_ENDPOINTS = Object.freeze({
  WIDGETS: "/widgets",
  WIDGET_SETTINGS: (widgetId: string) => `/widgets/${widgetId}/settings`,
  WIDGET_CODE: (widgetId: string, format: string) =>
    `/widgets/${widgetId}/code?format=${format}`,
  WIDGET_ANALYTICS: (widgetId: string) => `/widgets/${widgetId}/analytics`,
});
