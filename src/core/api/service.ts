/**
 * API Service
 *
 * Core API service with typed methods for making HTTP requests
 */
import { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import tokenService from "../auth/tokenService";

/**
 * Type for query parameters
 */
export type ApiParams = Record<string, string | number | boolean | undefined>;

/**
 * Core API Service
 */
class ApiService {
  /**
   * Make a GET request
   */
  async get<T>(
    url: string,
    params?: ApiParams,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const requestConfig = { ...config, params };
    const response = await apiClient.get<T>(url, requestConfig);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload a file
   */
  async uploadFile<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await apiClient.post<T>(url, formData, uploadConfig);
    return response.data;
  }

  /**
   * Fetch CSRF token
   */
  async fetchCsrfToken(): Promise<string | null> {
    try {
      await tokenService.initCsrfToken();
      return tokenService.getCsrfToken();
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Export the class for extending
export default ApiService;
