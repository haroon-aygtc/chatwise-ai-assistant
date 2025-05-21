import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { toast } from "sonner";
import tokenService from "../auth/tokenService";
import API_CONFIG from "./config";
import { ApiError } from "./errors";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response, config } = error;

    // Handle specific error cases
    if (response) {
      // Handle 401 Unauthorized errors
      if (response.status === 401) {
        // Redirect to login page or refresh token logic
        window.location.href = "/auth/login";
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

      // Log knowledge base errors but don't use fallback data anymore since backend is implemented
      if (
        response?.status === 500 &&
        config?.url?.includes("/knowledge-base")
      ) {
        console.error(`Knowledge base API error for ${config.url}:`, error);
        // Let the error propagate to the component for proper handling
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

const apiService = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async fetchCsrfToken(): Promise<string | null> {
    try {
      await tokenService.initCsrfToken();
      return tokenService.getCsrfToken();
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    }
  },
};

export default apiService;
