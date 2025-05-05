/**
 * Base API service with common functionality for making HTTP requests
 */
import {
  API_BASE_URL,
  DEFAULT_HEADERS,
  REQUEST_TIMEOUT,
  ENABLE_CACHING,
  DEFAULT_CACHE_TIME,
  MAX_RETRIES,
  RETRY_DELAY,
  CSRF_ENABLED,
  CSRF_HEADER_NAME,
  TOKEN_AUTO_REFRESH,
  TOKEN_REFRESH_THRESHOLD,
} from "./config";
import { apiCache } from "./cache";
import { getApiUrl, getEndpointDefinition } from "./registry";
import { tokenService } from "../auth/tokenService";

export class ApiError extends Error {
  status: number;
  data: any;
  retryable: boolean;

  constructor(
    message: string,
    status: number,
    data?: any,
    retryable: boolean = true,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.retryable = retryable;
  }
}

type RequestInterceptor = (config: RequestInit) => RequestInit;
type ResponseInterceptor = (response: Response) => Promise<Response>;
type ErrorInterceptor = (error: ApiError) => Promise<any>;

export class BaseApiService {
  protected baseUrl: string;
  protected headers: HeadersInit;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(
    baseUrl: string = API_BASE_URL,
    headers: HeadersInit = DEFAULT_HEADERS,
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  /**
   * Set authorization header with bearer token
   */
  setAuthToken(token: string): void {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
    // Also set it in axios defaults for consistency
    if (typeof window !== "undefined") {
      // Import axios directly instead of using require
      import("axios")
        .then((axiosModule) => {
          const axiosInstance = axiosModule.default;
          if (axiosInstance && axiosInstance.defaults) {
            axiosInstance.defaults.headers.common["Authorization"] =
              `Bearer ${token}`;
          }
        })
        .catch((err) => {
          console.error("Error importing axios:", err);
        });
    }
  }

  /**
   * Add a request interceptor
   * @param interceptor Function that receives and modifies the request config
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   * @param interceptor Function that receives and modifies the response
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor
   * @param interceptor Function that receives and handles errors
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Make a GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    useCache: boolean = true,
  ): Promise<T> {
    // Ensure token is set in headers for each request
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);
    }
    const url = this.buildUrl(endpoint, params);
    const cacheKey = apiCache.generateKey(url, {});

    // Check cache if enabled and method is cacheable
    if (ENABLE_CACHING && useCache) {
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const response = await this.request<T>(
      url,
      {
        method: "GET",
        headers: this.headers,
      },
      cacheKey,
    );

    // Cache the response if caching is enabled
    if (ENABLE_CACHING && useCache) {
      apiCache.set(cacheKey, response, DEFAULT_CACHE_TIME);
    }

    return response;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Ensure CSRF token is initialized for POST requests
    if (CSRF_ENABLED) {
      try {
        await tokenService.initCsrfToken();
      } catch (error) {
        console.warn(
          "Failed to initialize CSRF token before POST request:",
          error,
        );
      }
    }

    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "POST",
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Ensure CSRF token is initialized for PUT requests
    if (CSRF_ENABLED) {
      try {
        await tokenService.initCsrfToken();
      } catch (error) {
        console.warn(
          "Failed to initialize CSRF token before PUT request:",
          error,
        );
      }
    }

    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "PUT",
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    // Ensure CSRF token is initialized for PATCH requests
    if (CSRF_ENABLED) {
      try {
        await tokenService.initCsrfToken();
      } catch (error) {
        console.warn(
          "Failed to initialize CSRF token before PATCH request:",
          error,
        );
      }
    }

    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "PATCH",
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    // Ensure CSRF token is initialized for DELETE requests
    if (CSRF_ENABLED) {
      try {
        await tokenService.initCsrfToken();
      } catch (error) {
        console.warn(
          "Failed to initialize CSRF token before DELETE request:",
          error,
        );
      }
    }

    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: "DELETE",
      headers: this.headers,
    });
  }

  /**
   * Make a request using the API registry
   * @param category The API category (e.g., 'auth', 'users')
   * @param endpoint The endpoint name within the category
   * @param pathParams Optional path parameters (e.g., { id: 123 })
   * @param data Optional request body data
   * @param queryParams Optional query parameters
   */
  async callApi<T>(
    category: string,
    endpoint: string,
    pathParams?: Record<string, string | number>,
    data?: any,
    queryParams?: Record<string, any>,
  ): Promise<T> {
    const endpointDef = getEndpointDefinition(category, endpoint);
    const url = getApiUrl(category, endpoint, pathParams);
    const cacheKey = apiCache.generateKey(url, queryParams);

    // Check cache if enabled and method is GET and endpoint is cacheable
    if (
      ENABLE_CACHING &&
      endpointDef.method === "GET" &&
      endpointDef.cacheable
    ) {
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const options: RequestInit = {
      method: endpointDef.method,
      headers: this.headers,
    };

    if (data && ["POST", "PUT", "PATCH"].includes(endpointDef.method)) {
      options.body = JSON.stringify(data);
    }

    const fullUrl = this.buildUrl(url, queryParams);
    const response = await this.request<T>(fullUrl, options, cacheKey);

    // Cache the response if caching is enabled and method is GET and endpoint is cacheable
    if (
      ENABLE_CACHING &&
      endpointDef.method === "GET" &&
      endpointDef.cacheable
    ) {
      apiCache.set(
        cacheKey,
        response,
        endpointDef.cacheTime || DEFAULT_CACHE_TIME,
      );
    }

    return response;
  }

  /**
   * Cancel a pending request
   * @param requestId The request ID to cancel
   */
  cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => {
      controller.abort();
    });
    this.abortControllers.clear();
  }

  /**
   * Build URL with query parameters
   */
  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
    // If the endpoint is a full URL, use it directly
    if (endpoint.startsWith("http")) {
      const url = new URL(endpoint);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      return url.toString();
    }

    // Otherwise, combine with the base URL
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Make a request with timeout, retries, and error handling
   */
  private async request<T>(
    url: string,
    options: RequestInit,
    requestId: string = Math.random().toString(36).substring(2, 9),
    retryCount: number = 0,
  ): Promise<T> {
    // Check if the request requires authentication by examining the URL
    const isAuthEndpoint =
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/password/") ||
      url.includes("/sanctum/csrf-cookie");
    const requiresAuth = !isAuthEndpoint;

    // Check if we're in development context
    const isDevelopment = import.meta.env.DEV;

    // Public endpoints that don't require authentication even if they're not auth endpoints
    const isPublicEndpoint =
      url.includes("/api/public/") ||
      url.includes("/api/docs") ||
      url.includes("/health");

    // Validate token for authenticated endpoints
    if (requiresAuth && !isPublicEndpoint) {
      // Get the token
      let token = tokenService.getToken();

      // If no token exists for an authenticated endpoint, throw an error
      // unless we're in development mode
      if (!token && !isDevelopment) {
        console.error(
          `Authentication required for request to ${url} but no token found`,
        );
        throw new ApiError("Authentication required", 401, null, false);
      } else if (!token && isDevelopment) {
        console.warn(
          `Development mode: Proceeding without authentication for ${url}`,
        );
      }

      // Check if token is about to expire (skip if no token in development mode)
      if (
        token &&
        TOKEN_AUTO_REFRESH &&
        tokenService.isTokenExpired(TOKEN_REFRESH_THRESHOLD)
      ) {
        try {
          console.log(
            `Token is about to expire for request to ${url}, attempting refresh`,
          );

          // Import authService dynamically to avoid circular dependency
          const { authService } = await import("../auth/authService");

          // Try to refresh the token
          const refreshed = await authService.checkAndRefreshToken();
          if (!refreshed) {
            console.warn("Token refresh failed, proceeding with current token");
          } else {
            console.log("Using refreshed token for request");
            // Get the new token after refresh
            token = tokenService.getToken() || token;
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
        }
      }

      // Check if token is expired (after refresh attempt)
      if (token && tokenService.isTokenExpired()) {
        console.warn(`Token expired or will expire soon for request to ${url}`);
        // Clear the invalid token
        tokenService.clearToken();

        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          console.log("Token expired, redirecting to login page");
          window.location.href = "/login";
        }

        throw new ApiError("Authentication token expired", 401, null, false);
      }

      // Set the auth token in headers if available
      if (token) {
        this.setAuthToken(token);
      } else if (isDevelopment) {
        // In development, use a mock token for storyboards
        this.setAuthToken("dev-mock-token-for-storyboards");
      }
    }

    // Add CSRF token to headers for non-GET requests if enabled
    if (CSRF_ENABLED && options.method !== "GET") {
      const csrfToken = tokenService.getCsrfToken();
      if (csrfToken) {
        options.headers = {
          ...options.headers,
          [CSRF_HEADER_NAME]: csrfToken,
        };
      } else {
        console.warn(
          `No CSRF token available for ${options.method} request to ${url}`,
        );
      }
    }
    // Always include credentials in cross-origin requests
    options.credentials = "include";
    try {
      // Apply request interceptors
      let modifiedOptions = { ...options };
      for (const interceptor of this.requestInterceptors) {
        modifiedOptions = interceptor(modifiedOptions);
      }

      // Create abort controller for this request
      const controller = new AbortController();
      this.abortControllers.set(requestId, controller);
      const { signal } = controller;

      // Set timeout
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      // Make the request with better error handling
      let response;
      try {
        response = await fetch(url, { ...modifiedOptions, signal });
        clearTimeout(timeout);
        this.abortControllers.delete(requestId);
      } catch (fetchError) {
        clearTimeout(timeout);
        this.abortControllers.delete(requestId);

        // Handle network errors (like CORS, no internet, etc.)
        if (
          fetchError instanceof TypeError &&
          fetchError.message.includes("fetch")
        ) {
          console.error(
            `Network error when fetching ${url}:`,
            fetchError.message,
          );

          // In development, provide mock data instead of failing
          if (isDevelopment) {
            console.warn(`Development mode: Returning mock data for ${url}`);
            return {} as T;
          }

          throw new ApiError(
            `Network error: ${fetchError.message}`,
            0, // No HTTP status for network errors
            null,
            true,
          );
        }

        throw fetchError;
      }

      // Apply response interceptors
      let modifiedResponse = response;
      for (const interceptor of this.responseInterceptors) {
        modifiedResponse = await interceptor(modifiedResponse);
      }

      // Parse response data
      let data: any;
      const contentType = modifiedResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await modifiedResponse.json();
        } catch (jsonError) {
          // If JSON parsing fails, get the raw text to help with debugging
          const rawText = await modifiedResponse.clone().text();
          console.error(
            "JSON parsing failed. Raw response:",
            rawText.substring(0, 500) + (rawText.length > 500 ? "..." : ""),
          );

          // Throw a more descriptive error
          throw new ApiError(
            `Failed to parse JSON response: ${
              jsonError instanceof Error
                ? jsonError.message
                : "Unknown parsing error"
            }`,
            modifiedResponse.status,
            {
              rawResponse:
                rawText.substring(0, 1000) +
                (rawText.length > 1000 ? "..." : ""),
            },
            false,
          );
        }
      } else {
        data = await modifiedResponse.text();
      }

      // Handle error responses
      if (!modifiedResponse.ok) {
        // Check for CSRF token mismatch (419 in Laravel)
        if (modifiedResponse.status === 419) {
          console.warn(
            "CSRF token mismatch detected, attempting to refresh token",
          );
          // Try to refresh the CSRF token
          await tokenService.initCsrfToken();

          // If we haven't exceeded retry count, retry the request with the new token
          if (retryCount < MAX_RETRIES) {
            console.log("Retrying request with fresh CSRF token");
            return this.request<T>(url, options, requestId, retryCount + 1);
          }
        }

        const apiError = new ApiError(
          data.message || `API error: ${modifiedResponse.status}`,
          modifiedResponse.status,
          data,
          modifiedResponse.status >= 500 || modifiedResponse.status === 429, // Server errors and rate limiting are retryable
        );

        // Try to handle the error with interceptors
        for (const interceptor of this.errorInterceptors) {
          try {
            const result = await interceptor(apiError);
            if (result) return result as T;
          } catch (e) {
            // If the interceptor rethrows, continue with the error
          }
        }

        // If the error is retryable and we haven't exceeded max retries, retry the request
        if (apiError.retryable && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.request<T>(url, options, requestId, retryCount + 1);
        }

        throw apiError;
      }

      return data as T;
    } catch (error) {
      this.abortControllers.delete(requestId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408, null, true);
      }

      // If the error is a network error and we haven't exceeded max retries, retry the request
      if (
        error instanceof TypeError &&
        error.message.includes("fetch") &&
        retryCount < MAX_RETRIES
      ) {
        console.log(
          `Retrying request to ${url} after network error (attempt ${retryCount + 1}/${MAX_RETRIES})`,
        );
        const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(url, options, requestId, retryCount + 1);
      }

      // In development mode, return mock data instead of failing
      if (isDevelopment) {
        console.warn(
          `Development mode: Returning mock data for ${url} after error:`,
          error,
        );
        return {} as T;
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        500,
        null,
        true,
      );
    }
  }
}

// Create and export a singleton instance of the BaseApiService
export const apiService = new BaseApiService();

// Add a global error interceptor to handle authentication errors
// This ensures all services using BaseApiService will handle auth errors consistently
apiService.addErrorInterceptor(async (error) => {
  // Handle 401 Unauthorized errors
  if (error.status === 401) {
    console.warn(
      "Authentication error detected in global handler:",
      error.message,
    );

    // Check if we're in a storyboard or development context
    const isStoryboard =
      window.location.pathname.includes("/tempobook/") ||
      window.location.pathname.includes("/storyboards/");

    // Don't redirect if we're in a storyboard
    if (isStoryboard) {
      console.log("In storyboard context, not redirecting to login");
      throw error;
    }

    // Add debouncing to prevent multiple redirects
    const lastRedirectTime = parseInt(
      sessionStorage.getItem("last_auth_redirect") || "0",
    );
    const currentTime = Date.now();

    // Only redirect if it's been more than 3 seconds since the last redirect
    if (currentTime - lastRedirectTime > 3000) {
      // Clear the token
      tokenService.clearToken();

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        console.log("Redirecting to login page due to authentication error");

        // Store the current path to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== "/" && currentPath !== "/login") {
          sessionStorage.setItem("auth_redirect", currentPath);
        }

        // Record this redirect time
        sessionStorage.setItem("last_auth_redirect", currentTime.toString());

        // Use a small delay to allow console logs to be seen
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    } else {
      console.log("Skipping redirect due to debouncing");
    }
  }

  // Always rethrow the error to let the calling code handle it
  throw error;
});
