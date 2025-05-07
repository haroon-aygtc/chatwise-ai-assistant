/**
 * API Configuration
 *
 * This file contains all API-related configuration including:
 * - Base URL
 * - Endpoint definitions
 * - Global headers management
 * - Environment-specific settings
 */

// Environment variables with fallbacks
const API_CONFIG_OBJECT = Object.freeze({
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  WITH_CREDENTIALS: true,
  RETRY_ATTEMPTS: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  DEBUG: import.meta.env.DEV || false,
});

// Export as both default and named export for maximum compatibility
export default API_CONFIG_OBJECT;
export { API_CONFIG_OBJECT as API_CONFIG };

/**
 * API Endpoints
 * Organized by domain/feature for better maintainability
 */

// Auth endpoints
export const AUTH_ENDPOINTS = Object.freeze({
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  CURRENT_USER: '/user',
  CHECK_AUTH: '/check-auth',
  RESET_PASSWORD_REQUEST: '/password/reset-request',
  RESET_PASSWORD: '/password/reset',
  VERIFY_EMAIL: '/verify-email',
});

// User endpoints
export const USER_ENDPOINTS = Object.freeze({
  USERS: '/users',
  USER_ROLES: (id: string) => `/users/${id}/roles`,
  USER_STATUS: (id: string) => `/users/${id}/status`,
  USER_PERMISSIONS: (id: string) => `/users/${id}/permissions`,
  ASSIGN_ROLES: (id: string) => `/users/${id}/assign-roles`,
});

// Permissions endpoints
export const PERMISSION_ENDPOINTS = Object.freeze({
  PERMISSIONS: '/permissions',
  PERMISSION_CATEGORIES: '/permissions/categories',
});

/**
 * Global Headers Management
 * Centralized management of headers that need to be included in all requests
 */
class HeadersManager {
  private headers: Record<string, string> = {};

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
export const addGlobalHeader = (key: string, value: string): void => headersManager.add(key, value);
export const removeGlobalHeader = (key: string): void => headersManager.remove(key);
export const getGlobalHeaders = (): Record<string, string> => headersManager.getAll();
