
import axios, { AxiosResponse, AxiosRequestConfig, AxiosHeaders } from 'axios';
import { tokenService } from '@/services/auth';

// Create a base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = tokenService.getToken();
    
    // If token exists, add to authorization header
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // For mutation requests (POST, PUT, PATCH, DELETE)
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      try {
        // Try to initialize CSRF token before the request
        await tokenService.initCsrfToken();
      } catch (error) {
        console.error('Error initializing CSRF token:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401 Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token 
        // This would call your refresh token endpoint
        // const refreshResponse = await api.post('/auth/refresh');
        // const newToken = refreshResponse.data.token;
        
        // For now, we'll just clear the token and redirect to login
        tokenService.clearToken();
        window.location.href = '/login';
        
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        tokenService.clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to get CSRF token
const getCsrf = async (): Promise<void> => {
  try {
    await tokenService.initCsrfToken();
  } catch (error) {
    console.error('Failed to get CSRF token', error);
    throw error;
  }
};

// Generic request methods
const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.get(url, config).then((response: AxiosResponse) => response.data);
};

const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return api.post(url, data, config).then((response: AxiosResponse) => response.data);
};

const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return api.put(url, data, config).then((response: AxiosResponse) => response.data);
};

const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return api.patch(url, data, config).then((response: AxiosResponse) => response.data);
};

const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.delete(url, config).then((response: AxiosResponse) => response.data);
};

// Create auth headers utility
const createAuthHeaders = (): AxiosHeaders => {
  const token = tokenService.getToken();
  const headers = new AxiosHeaders();
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return headers;
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  getCsrf,
  createAuthHeaders,
  instance: api,
};
