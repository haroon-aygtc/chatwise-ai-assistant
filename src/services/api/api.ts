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
  private rateLimitedRoutes = ['/ai/models', '/ai/routing-rules']; // Routes that should be rate limited

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

            // Store this request in the pending map
            config._requestKey = requestKey;

            // Create a promise that will be resolved with the actual response
            // This is important - we're storing the actual request promise
            const requestPromise = this.instance(config);
            pendingRequests.set(requestKey, requestPromise);
          }
        }

        // Add auth token if available
        const token = tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
            await tokenService.initCsrfToken();
            // Retry the original request
            return this.instance(error.config as AxiosRequestConfig);
          } catch (csrfError) {
            console.error("CSRF token refresh failed:", csrfError);
          }
        }

        // Handle authentication errors (status 401)
        if (response?.status === 401) {
          // Clear token on auth errors
          tokenService.removeToken();
          console.log("Authentication error detected, token cleared");

          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes("/login")) {
            // Store the current URL to redirect back after login
            sessionStorage.setItem(
              "redirectAfterLogin",
              window.location.pathname,
            );

            // Use history API instead of direct location change to avoid full page reload
            // This prevents the "page refresh returns to login" issue
            if (window.history && window.history.pushState) {
              window.history.pushState({}, '', '/login?session=expired');
              // Dispatch a custom event to notify the app about the route change
              window.dispatchEvent(new CustomEvent('app:auth:expired'));
            } else {
              // Fallback for older browsers
              window.location.href = "/login?session=expired";
            }
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
   */
  public async fetchCsrfToken(): Promise<void> {
    // Skip in public mode
    if (isPublicApiMode) return;
    try {
      await tokenService.initCsrfToken();
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      // Don't throw the error to prevent blocking API calls
      // The response interceptor will handle 419 errors and retry
    }
  }

  /**
   * Make a GET request
   */
  public async get<T = unknown>(url: string, params?: ApiParams): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
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
  httpClient.get(url, params);

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

export const getCsrfToken = () => httpClient.fetchCsrfToken();
