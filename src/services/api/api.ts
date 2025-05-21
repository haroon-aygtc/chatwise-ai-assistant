/**
 * API Service
 *
 * A clean, reusable API client built on axios with:
 * - Type safety
 * - CSRF protection for Laravel Sanctum
 * - Automatic error handling
 * - Request/response interceptors
 * - Centralized configuration
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "@/components/ui/use-toast";
import API_CONFIG_IMPORT, { getGlobalHeaders, isPublicApiMode } from "./config";
import tokenService from "../auth/tokenService";
import authService from "../auth/authService";
import { useAuth } from "@/hooks/auth/useAuth";

// Extend AxiosRequestConfig to include our custom properties
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _requestKey?: string;
  }

  interface AxiosError {
    duplicateRequest?: boolean;
  }
}

// Use the imported config
const API_CONFIG = API_CONFIG_IMPORT;

/**
 * Type definitions for better type safety
 * These types provide more specific constraints than 'any'
 */

// Request parameters type (for query strings)
export type ApiParams = Record<string, unknown>;

// Request data type (for request bodies)
export type ApiData =
  | Record<string, unknown>
  | FormData
  | string
  | number
  | boolean
  | null
  | undefined;

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Keep track of in-flight requests to prevent duplicates
const pendingRequests = new Map<string, Promise<any>>();

// Increase the debounce interval for these routes to prevent overload
const RATE_LIMIT_DELAY = 500; // ms
const RATE_LIMIT_BATCH_SIZE = 5; // max concurrent requests

// Create a request key based on method, url and params/data to identify duplicates
const createRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

// HTTP Client class below

/**
 * HTTP Client
 * Wraps axios with custom configuration and interceptors
 */
class HttpClient {
  private instance: AxiosInstance;
  // Extended list of rate-limited routes to prevent authentication issues
  private rateLimitedRoutes = [
    '/ai/models',
    '/ai/routing-rules',
    '/ai/providers',
    '/knowledge-base/resources',
    '/users',
    '/permissions'
  ];

  // Improved rate limiter with batch control
  private requestBatch = {
    count: 0,
    lastReset: Date.now()
  };

  constructor() {
    // Create axios instance with default config
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      withCredentials: !isPublicApiMode, // Skip credentials in public mode
      withXSRFToken: !isPublicApiMode, // Disable XSRF in public mode
      xsrfCookieName: "XSRF-TOKEN", // Laravel's default CSRF cookie name
      xsrfHeaderName: "X-XSRF-TOKEN", // Laravel's default CSRF header name
    });

    // Set up interceptors
    this.setupInterceptors();

    // Initialize CSRF token if not in public mode
    if (!isPublicApiMode) {
      // Use setTimeout to ensure this happens after the constructor
      setTimeout(() => {
        tokenService.initCsrfToken().then(token => {
          if (API_CONFIG.DEBUG) {
            if (token) {
              console.log(`API Client initialized with CSRF token: ${token.substring(0, 10)}...`);
            } else {
              console.warn("API Client initialized but no CSRF token obtained");
            }
          }
        }).catch(error => {
          console.warn("Failed to initialize CSRF token:", error);
        });
      }, 0);
    }
  }

  /**
   * Configure request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Check if this route should be rate limited
        if (config.method === 'get' && config.url) {
          const shouldRateLimit = this.rateLimitedRoutes.some(route =>
            config.url?.includes(route)
          );

          if (shouldRateLimit) {
            // Create a unique key for this request
            const requestKey = createRequestKey(config);

            // Check if an identical request is already in flight
            if (pendingRequests.has(requestKey)) {
              // Instead of rejecting, return the existing promise to reuse the result
              console.log(`Reusing in-flight request for: ${config.url}`);
              return pendingRequests.get(requestKey);
            }

            // Apply batch limiting for rate-limited routes
            const now = Date.now();
            // Reset batch counter if more than 2 seconds have passed
            if (now - this.requestBatch.lastReset > 2000) {
              this.requestBatch.count = 0;
              this.requestBatch.lastReset = now;
            }

            // If we've exceeded our batch size, delay this request
            if (this.requestBatch.count >= RATE_LIMIT_BATCH_SIZE) {
              const delay = RATE_LIMIT_DELAY + Math.random() * 500; // Add jitter
              console.log(`Rate limiting request to ${config.url}, delaying ${delay}ms`);
              await new Promise(resolve => setTimeout(resolve, delay));
              // Reset counter after delay
              this.requestBatch.count = 0;
              this.requestBatch.lastReset = Date.now();
            }

            // Increment batch counter
            this.requestBatch.count++;

            // Store this request in the pending map
            config._requestKey = requestKey;

            // Create a promise that will be resolved with the actual response
            // This is important - we're storing the actual request promise
            const requestPromise = this.instance(config);
            pendingRequests.set(requestKey, requestPromise);
          }
        }

        // Add CSRF token if available
        const csrfToken = tokenService.getCsrfToken();
        if (csrfToken) {
          config.headers["X-CSRF-TOKEN"] = csrfToken;
        }

        // Add global headers
        const globalHeaders = getGlobalHeaders();
        Object.keys(globalHeaders).forEach((key) => {
          config.headers[key] = globalHeaders[key];
        });

        // Explicitly add CSRF token if available and not in public mode
        if (!isPublicApiMode) {
          const csrfToken = tokenService.getCsrfToken();
          if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
          }
        }

        // Log request in debug mode
        if (API_CONFIG.DEBUG) {
          console.log(
            `🚀 Request: ${config.method?.toUpperCase()} ${config.url}`,
            {
              params: config.params,
              data: config.data,
              headers: config.headers,
            },
          );
        }

        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Remove from pending requests map if this was a tracked request
        // We do this after a short delay to allow other in-flight requests to use the cached result
        if (response.config._requestKey) {
          setTimeout(() => {
            pendingRequests.delete(response.config._requestKey);
          }, 100); // Short delay to allow other components to reuse the response
        }

        // Log response in debug mode
        if (API_CONFIG.DEBUG) {
          console.log(
            `✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
            {
              status: response.status,
              data: response.data,
            },
          );
        }

        return response;
      },
      async (error: AxiosError) => {
        // Remove from pending requests map if this was a tracked request
        if (error.config?._requestKey) {
          pendingRequests.delete(error.config._requestKey);
        }

        const response = error.response;
        const url = error.config?.url || '';

        // Handle knowledge base specific errors to prevent infinite loops
        if (response?.status === 500 && url.includes('/knowledge-base')) {
          console.error(`Knowledge base API error for ${url}:`, error);
          console.warn(`Using fallback data for ${url}`);

          // For resources listing endpoints, return empty data
          if (url.includes('/resources')) {
            return Promise.resolve({
              data: {
                data: [],
                total: 0,
                current_page: 1,
                last_page: 1
              }
            });
          }

          // For document listing endpoints, return empty data
          if (url.includes('/documents')) {
            return Promise.resolve({
              data: {
                data: [],
                total: 0,
                current_page: 1,
                last_page: 1
              }
            });
          }

          // For collections endpoints, return empty array
          if (url.includes('/collections')) {
            return Promise.resolve({ data: [] });
          }

          // For category endpoints, return empty array
          if (url.includes('/categories')) {
            return Promise.resolve({ data: [] });
          }

          // For profiles endpoints, return empty array
          if (url.includes('/profiles')) {
            return Promise.resolve({ data: [] });
          }

          // For context-scopes endpoints, return empty array
          if (url.includes('/context-scopes')) {
            return Promise.resolve({ data: [] });
          }

          // For settings endpoint, return default settings
          if (url.includes('/settings')) {
            return Promise.resolve({
              data: {
                isEnabled: true,
                priority: 'medium',
                includeCitations: true,
                vectorDimensions: 1536,
                vectorDatabase: "local"
              }
            });
          }

          // For any other knowledge base endpoint, return empty data
          return Promise.resolve({ data: [] });
        }

        // Handle 500 errors more gracefully for certain endpoints
        if (response?.status === 500) {
          const url = error.config?.url || '';

          if (this.rateLimitedRoutes.some(route => url.includes(route))) {
            console.log(`Server error for rate-limited route (${url}). Handling gracefully.`);
            // For AI models and routing rules, return empty arrays instead of failing
            if (url.includes('/ai/models')) {
              return Promise.resolve({ data: { data: [] } });
            } else if (url.includes('/ai/routing-rules')) {
              return Promise.resolve({ data: { data: [] } });
            }
          }
        }

        // Handle HTML responses (usually server errors)
        if (
          response?.data &&
          typeof response.data === "string" &&
          response.data.includes("<!DOCTYPE")
        ) {
          toast({
            title: "Server Error",
            description: "Invalid HTML response from server. Contact support.",
            variant: "destructive",
          });
          return Promise.reject(new Error("Invalid HTML response received"));
        }

        // Extract error message
        const responseData = response?.data as ApiErrorResponse | undefined;
        const message =
          responseData?.message ||
          responseData?.error ||
          "An unexpected error occurred";

        // Handle CSRF token expiry (status 419) - skip in public mode
        if (!isPublicApiMode && response?.status === 419) {
          console.log("CSRF token expired, refreshing...");
          try {
            // Force refresh the CSRF token
            const newToken = await tokenService.initCsrfToken(true);

            if (!newToken) {
              console.error("Failed to obtain new CSRF token");
              return Promise.reject(new Error("Failed to refresh CSRF token"));
            }

            console.log("New CSRF token obtained, retrying request");

            // Clone the original request config
            const originalRequest = error.config as AxiosRequestConfig;

            // Ensure headers exist
            if (!originalRequest.headers) {
              originalRequest.headers = {};
            }

            // Add the new CSRF token to the request headers
            originalRequest.headers["X-CSRF-TOKEN"] = newToken;
            originalRequest.headers["X-XSRF-TOKEN"] = newToken;

            // Retry the original request with the new token
            return this.instance(originalRequest);
          } catch (csrfError) {
            console.error("CSRF token refresh failed:", csrfError);
          }
        }
        // Handle authentication errors (status 401)
        if (response?.status === 401) {
          // Improved page reload detection
          const isPageReload = document.readyState !== 'complete';
          const pageLoadTime = Number(sessionStorage.getItem('page_load_time') || '0');
          const timeSinceLoad = Date.now() - pageLoadTime;
          const isRecentPageLoad = timeSinceLoad < 5000; // Increased from 3000ms to 5000ms
          const isRefreshScenario = isPageReload || isRecentPageLoad;

          // Check for explicit redirect prevention flag
          const hasPreventRedirectFlag = sessionStorage.getItem('prevent_auth_redirect') === 'true';

          // Check if we have an active session marker
          const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

          // Determine if we should prevent redirect - more lenient conditions
          const preventRedirect =
            hasPreventRedirectFlag ||
            isRefreshScenario ||
            (hasActiveSession && timeSinceLoad < 10000); // Increased from 5000ms to 10000ms

          // Log the authentication error with context
          console.log(`Authentication error detected. Redirect prevention: ${preventRedirect ? 'Yes' : 'No'}`, {
            isPageReload,
            timeSinceLoad,
            hasPreventRedirectFlag,
            hasActiveSession,
            path: window.location.pathname
          });

          // During page refresh, don't immediately clear the session to prevent flashing
          if (!preventRedirect) {
            tokenService.clearSession();
            console.log("Session cleared due to authentication error");
          } else {
            console.log("Session preserved during page refresh despite 401 error");

            // For API calls during page refresh with active session, retry with more attempts
            if (hasActiveSession && isRefreshScenario) {
              const originalRequest = error.config as any;

              // Allow up to 3 retry attempts (increased from 1)
              const maxRetries = 3;
              const retryCount = originalRequest._retryCount || 0;

              if (retryCount < maxRetries) {
                // Increment retry counter
                originalRequest._retryCount = retryCount + 1;

                // Exponential backoff for retries
                const delay = Math.pow(2, retryCount) * 500; // 500ms, 1000ms, 2000ms

                console.log(`Retry attempt ${retryCount + 1}/${maxRetries} after ${delay}ms`);

                // Wait before retrying with exponential backoff
                return new Promise(resolve => {
                  setTimeout(() => {
                    console.log(`Retrying request after 401 (attempt ${retryCount + 1})`);

                    // Try to refresh the token before retrying
                    tokenService.initCsrfToken()
                      .catch(e => console.warn("Failed to refresh CSRF token before retry:", e))
                      .finally(() => {
                        // Add fresh CSRF token if available
                        const csrfToken = tokenService.getCsrfToken();
                        if (csrfToken) {
                          originalRequest.headers["X-CSRF-TOKEN"] = csrfToken;
                        }
                        resolve(this.instance(originalRequest));
                      });
                  }, delay);
                });
              }
            }
          }

          // Only redirect if we're not already on the login page and not in a prevent redirect scenario
          if (!window.location.pathname.includes("/login") && !preventRedirect) {
            // Store the current URL to redirect back after login
            sessionStorage.setItem(
              "redirectAfterLogin",
              window.location.pathname,
            );

            // Dispatch event first to allow auth context to update
            window.dispatchEvent(new CustomEvent('auth:expired'));

            // Short delay before redirect to allow event handlers to run
            setTimeout(() => {
              // Use React Router's navigate if available through custom event
              const customEvent = new CustomEvent('app:navigate', {
                detail: { to: '/login?session=expired' }
              });

              const wasHandled = window.dispatchEvent(customEvent);

              // If event wasn't handled, fall back to history API
              if (!wasHandled) {
                // Use history API instead of direct location change to avoid full page reload
                if (window.history && window.history.pushState) {
                  window.history.pushState({}, '', '/login?session=expired');
                  // Dispatch a custom event to notify the app about the route change
                  window.dispatchEvent(new CustomEvent('app:auth:expired'));
                } else {
                  // Fallback for older browsers
                  window.location.href = "/login?session=expired";
                }
              }
            }, 100);
          }
        }

        // Handle authentication errors (401 Unauthorized, 419 CSRF token mismatch)
        if (response?.status === 401 || response?.status === 419) {
          // Clear session
          if (tokenService.hasActiveSession()) {
            tokenService.clearSession();

            // Dispatch auth expired event
            window.dispatchEvent(new CustomEvent('auth:expired'));
          }
        }

        // Show toast for all errors except validation errors (status 422)
        // and rate limiting errors (status 429)
        if (response?.status !== 422 && response?.status !== 429) {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }

        // Log error in debug mode
        if (API_CONFIG.DEBUG) {
          console.error(
            `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
              status: response?.status,
              data: response?.data,
            },
          );
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Get the underlying axios instance
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Fetch CSRF token
   * @param force Force fetching a new token even if one exists
   * @returns The CSRF token or null if it couldn't be fetched
   */
  public async fetchCsrfToken(force: boolean = false): Promise<string | null> {
    // Skip in public mode
    if (isPublicApiMode) return null;

    try {
      const token = await tokenService.initCsrfToken(force);

      if (API_CONFIG.DEBUG) {
        if (token) {
          console.log(`CSRF token fetched: ${token.substring(0, 10)}...`);
        } else {
          console.warn("No CSRF token obtained");
        }
      }

      return token;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      // Don't throw the error to prevent blocking API calls
      // The response interceptor will handle 419 errors and retry
      return null;
    }
  }

  /**
   * Make a GET request
   */
  public async get<T = unknown>(url: string, options?: { params?: ApiParams }): Promise<T> {
    const response = await this.instance.get<T>(url, options);
    return response.data;
  }

  /**
   * Make a POST request
   */
  public async post<T = unknown>(url: string, data?: ApiData): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  public async put<T = unknown>(url: string, data?: ApiData): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  public async patch<T = unknown>(url: string, data?: ApiData): Promise<T> {
    const response = await this.instance.patch<T>(url, data);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = unknown>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }

  /**
   * Upload a file
   */
  public async uploadFile<T = unknown>(
    url: string,
    formData: FormData,
  ): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

// Create a singleton instance
const httpClient = new HttpClient();

// Export an instance for direct use
export default httpClient;

// Export various methods for convenience
export const get = <T = unknown>(url: string, params?: ApiParams): Promise<T> =>
  httpClient.get(url, { params });

export const post = <T = unknown>(
  url: string,
  data?: ApiData,
): Promise<T> => httpClient.post(url, data);

export const put = <T = unknown>(
  url: string,
  data?: ApiData,
): Promise<T> => httpClient.put(url, data);

export const patch = <T = unknown>(
  url: string,
  data?: ApiData,
): Promise<T> => httpClient.patch(url, data);

export const del = <T = unknown>(url: string): Promise<T> =>
  httpClient.delete(url);

export const upload = <T = unknown>(
  url: string,
  formData: FormData,
): Promise<T> => httpClient.uploadFile(url, formData);

export const getCsrfToken = (force: boolean = false) => httpClient.fetchCsrfToken(force);
