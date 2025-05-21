/**
 * Legacy API Configuration
 *
 * This file is maintained for backward compatibility.
 * New code should use the modular API configuration from @/core/api/config.
 */

import {
  getConfig,
  isPublicApiMode as checkPublicApiMode,
  setPublicApiMode as setPublicMode,
} from "@/core/api/config";
export {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  PERMISSION_ENDPOINTS,
} from "@/core/api/config";

// Re-export the API config for backward compatibility
const API_CONFIG = getConfig();
export default API_CONFIG;

// Re-export the public API mode functions for backward compatibility
export const isPublicApiMode = checkPublicApiMode();
export const setPublicApiMode = setPublicMode;

/**
 * Global Headers Management
 * Centralized management of headers that need to be included in all requests
 */
class HeadersManager {
  private headers: Record<string, string> = {
    "X-App-Version": import.meta.env.VITE_APP_VERSION || "1.0.0",
    "X-App-Platform": "web",
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
