/**
 * Core API Client
 *
 * This file provides the base HTTP client with interceptors for authentication,
 * error handling, and request/response processing.
 */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "sonner";
import { ApiError } from "./errors";
import { getConfig } from "./config";
import tokenService from "../auth/tokenService";

/**
 * Create and configure the Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const config = getConfig();

  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    },
    withCredentials: true,
  });

  // Request interceptor
  client.interceptors.request.use(
    async (config) => {
      // Add CSRF token to requests
      const token = tokenService.getCsrfToken();
      if (token) {
        config.headers["X-CSRF-TOKEN"] = token;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { response, config } = error;

      // Handle specific error cases
      if (response) {
        // Handle 401 Unauthorized errors
        if (response.status === 401) {
          // Dispatch auth expired event for global handling
          window.dispatchEvent(new CustomEvent("auth:expired"));
          return Promise.reject(error);
        }

        // Handle 403 Forbidden errors
        if (response.status === 403) {
          toast.error("You do not have permission to perform this action");
          return Promise.reject(error);
        }

        // Handle 419 CSRF token mismatch
        if (response.status === 419) {
          toast.error("Your session has expired. Please refresh the page.");
          return Promise.reject(error);
        }
      }

      // Handle network errors
      if (!response) {
        toast.error("Network error. Please check your connection.");
        return Promise.reject(error);
      }

      // Handle all other errors
      return Promise.reject(
        new ApiError(error.message, error.response?.status || 500),
      );
    },
  );

  return client;
};

// Export a singleton instance
export const apiClient = createApiClient();

// Export a factory function for testing or specialized instances
export const createClient = createApiClient;
