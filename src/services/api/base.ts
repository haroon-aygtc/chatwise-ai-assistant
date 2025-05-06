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
const getData = <T>(response: ApiResponse<T> | T): T => {
  // If response is already the correct type and has no data property, return it as is
  if (!response || typeof response !== 'object' || !('data' in response)) {
    return response as T;
  }
  
  // Otherwise extract the data property
  return (response as ApiResponse<T>).data;
};

// Define the base API service
const ApiService = {
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
