
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiRequestParams } from "./types";
import { API_BASE_URL, getGlobalHeaders } from "./config";

// Define the base API response type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  token?: string;
  user?: any;
}

// Create an axios instance with default configs
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Use the configured base URL from environment
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Essential for cross-domain cookie handling
});

// Add request interceptor to handle auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem("auth_token");
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add any global headers
    const globalHeaders = getGlobalHeaders();
    for (const [key, value] of Object.entries(globalHeaders)) {
      config.headers[key] = value;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem("auth_token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?session=expired";
        }
      }
      
      // Handle CSRF token mismatches (419 errors)
      else if (error.response.status === 419) {
        try {
          await axios.get(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
            withCredentials: true
          });
          // Retry the original request
          return apiClient(error.config);
        } catch (refreshError) {
          console.error("Failed to refresh CSRF token", refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper method to extract just data from response
const extractData = <T>(response: AxiosResponse<ApiResponse<T> | T>): T => {
  // Check if response has data.data structure (ApiResponse format)
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as ApiResponse<T>).data;
  }
  
  // Otherwise return data directly
  return response.data as T;
};

// Define the base API service
const ApiService = {
  // Expose axios instance for special cases
  getAxiosInstance: () => apiClient,

  // GET request
  async get<T>(url: string, params?: ApiRequestParams | AxiosRequestConfig): Promise<T> {
    // Handle both ApiRequestParams and AxiosRequestConfig
    const config: AxiosRequestConfig = !params ? {} : 
      (params && 'headers' in params) ? params as AxiosRequestConfig : { params };
    
    const response = await apiClient.get<ApiResponse<T> | T>(url, config);
    return extractData(response);
  },

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<ApiResponse<T> | T>(url, data, config);
    return extractData(response);
  },

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<ApiResponse<T> | T>(url, data, config);
    return extractData(response);
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<ApiResponse<T> | T>(url, config);
    return extractData(response);
  },

  // Form data POST request (for file uploads)
  async uploadFile<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<ApiResponse<T> | T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return extractData(response);
  },
};

export default ApiService;
