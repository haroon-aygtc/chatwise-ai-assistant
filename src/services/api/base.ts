import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Define the base API response type
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  token?: string;
  user?: any;
}

// Create an axios instance with default configs
const apiClient = axios.create({
  baseURL: "/api", // This will be prefixed to all requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // For cookie-based authentication
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
    
    return config;
  },
  (error) => {
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
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // Form data POST request (for file uploads)
  async uploadFile<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default ApiService;
