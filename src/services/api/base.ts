
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import tokenService from "@/modules/auth/services/tokenService";
import { API_BASE_URL } from "./config";

// Generic API response type
export type ApiResponse<T> = {
  data: T;
  message?: string;
  token?: string;
  user?: any;
};

// Generic API error type
export type ApiError = {
  message: string;
};

// Create a custom Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token to request headers if it exists
    const token = tokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Add CSRF token for non-GET requests if using Laravel
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken && config.method !== "get") {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }

    // Log request URL for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("API Error:", error);
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      tokenService.clearToken();
      window.location.href = "/login";
    }

    // Handle 419 CSRF token mismatch (Laravel)
    if (error.response && error.response.status === 419) {
      // Refresh the page to get a new CSRF token
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

// Helper to convert parameters to axios config
const paramsToConfig = (params: any): AxiosRequestConfig => {
  if (!params) return {};

  // If params already has an AxiosRequestConfig shape, return it
  if (params.headers || params.params || params.data) {
    return params;
  }

  // Otherwise, convert to params config
  return { params };
};

// Clean URL helper function to ensure proper formatting
const cleanUrl = (url: string): string => {
  // Remove /api prefix if it exists since it's already in baseURL
  return url.startsWith("/api") ? url.substring(4) : url;
};

// Generic API service functions
const ApiService = {
  /**
   * Make a GET request
   */
  get: async <T>(endpoint: string, params?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get(cleanUrl(endpoint), paramsToConfig(params));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a POST request
   */
  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post(cleanUrl(url), data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a PUT request
   */
  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put(cleanUrl(url), data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a DELETE request
   */
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete(cleanUrl(url), config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a PATCH request
   */
  patch: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse = await api.patch(cleanUrl(url), data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get the underlying Axios instance
   */
  getAxiosInstance: () => api,
};

export default ApiService;
