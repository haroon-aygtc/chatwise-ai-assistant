
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import TokenService from '@/modules/auth/services/tokenService';

// Create a custom Axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token to request headers if it exists
    const token = TokenService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add CSRF token for non-GET requests if using Laravel
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken && config.method !== 'get') {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    
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
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      TokenService.clearToken();
      window.location.href = '/login';
    }
    
    // Handle 419 CSRF token mismatch (Laravel)
    if (error.response && error.response.status === 419) {
      // Refresh the page to get a new CSRF token
      window.location.reload();
    }
    
    return Promise.reject(error);
  }
);

// Generic API service functions
const ApiService = {
  /**
   * Make a GET request
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a POST request
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a PUT request
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a DELETE request
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Make a PATCH request
   */
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse = await api.patch(url, data, config);
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
