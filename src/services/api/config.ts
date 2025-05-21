/**
 * API Configuration
 *
 * This file contains all API-related configuration including:
 * - Base URL
 * - Endpoint definitions
 * - Global headers management
 * - Environment-specific settings
 */

export interface ApiConfig {
  BASE_URL: string;
  TIMEOUT: number;
  DEBUG: boolean;
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
    const protocol = import.meta.env.VITE_BACKEND_PROTOCOL || 'http';
    const host = import.meta.env.VITE_BACKEND_HOST;
    const port = import.meta.env.VITE_BACKEND_PORT ? `:${import.meta.env.VITE_BACKEND_PORT}` : '';
    const path = import.meta.env.VITE_BACKEND_PATH || 'api';

    return `${protocol}://${host}${port}/${path}`;
  }

  // Default: Use relative path (same origin as frontend)
  return '/api';
}

// Default configuration
const API_CONFIG: ApiConfig = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  DEBUG: import.meta.env.DEV || false,
};

// Check if we're in public API mode (no auth)
export const isPublicApiMode = import.meta.env.VITE_PUBLIC_API_MODE === 'true';

export default API_CONFIG;

/**
 * API Endpoints
 * Organized by domain/feature for better maintainability
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

/**
 * Global Headers Management
 * Centralized management of headers that need to be included in all requests
 */
class HeadersManager {
  private headers: Record<string, string> = {
    'X-App-Version': import.meta.env.VITE_APP_VERSION || '1.0.0',
    'X-App-Platform': 'web',
  };

  /**
   * Add a global header
   * @param key Header name
   * @param value Header value
   */
  public add(key: string, value: string): void {
    this.headers[key] = value;
  }

  /**
   * Remove a global header
   * @param key Header name to remove
   */
  public remove(key: string): void {
    delete this.headers[key];
  }

  /**
   * Get all global headers
   * @returns Copy of all headers
   */
  public getAll(): Record<string, string> {
    return { ...this.headers };
  }

  /**
   * Clear all global headers
   */
  public clear(): void {
    this.headers = {};
  }
}

// Create and export a singleton instance
export const headersManager = new HeadersManager();

// Export convenience methods for backward compatibility
export const addGlobalHeader = (key: string, value: string): void =>
  headersManager.add(key, value);
export const removeGlobalHeader = (key: string): void =>
  headersManager.remove(key);
export const getGlobalHeaders = (): Record<string, string> =>
  headersManager.getAll();

// Function to update public API mode
export const setPublicApiMode = (value: boolean): void => {
  localStorage.setItem("publicApiMode", value.toString());
  // Force reload to apply changes
  window.location.reload();
};
