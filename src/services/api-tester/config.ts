/**
 * API configuration
 */

// Base URL for API requests
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000"; 

// Default request timeout in milliseconds
export const API_TIMEOUT = 30000;
export const REQUEST_TIMEOUT = API_TIMEOUT;

// Maximum number of retries for failed requests
export const API_MAX_RETRIES = 3;
export const MAX_RETRIES = API_MAX_RETRIES;

// Retry delay in milliseconds
export const RETRY_DELAY = 1000;

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// CSRF configuration
export const CSRF_ENABLED =
  import.meta.env.VITE_CSRF_ENABLED === "true" || false;
export const CSRF_HEADER_NAME = "X-XSRF-TOKEN";

// Caching configuration
export const ENABLE_CACHING =
  import.meta.env.VITE_ENABLE_API_CACHE === "true" || false;
export const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Token refresh configuration
export const TOKEN_AUTO_REFRESH = true;
export const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds
