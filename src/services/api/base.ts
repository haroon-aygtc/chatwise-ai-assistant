
import { tokenService } from '../auth/tokenService';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiOptions {
  headers?: Record<string, string>;
  withAuth?: boolean;
  withCredentials?: boolean;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: Record<string, string[]>;
}

class ApiService {
  /**
   * Make a GET request
   */
  static async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: ApiOptions
  ): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }
    
    const response = await this.request<T>(url.toString(), {
      method: 'GET',
      ...options
    });
    
    return response;
  }

  /**
   * Make a POST request
   */
  static async post<T = any>(
    endpoint: string,
    data: Record<string, any>,
    options?: ApiOptions
  ): Promise<T> {
    const response = await this.request<T>(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
    
    return response;
  }

  /**
   * Make a PUT request
   */
  static async put<T = any>(
    endpoint: string,
    data: Record<string, any>,
    options?: ApiOptions
  ): Promise<T> {
    const response = await this.request<T>(`${API_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
    
    return response;
  }

  /**
   * Make a DELETE request
   */
  static async delete<T = any>(
    endpoint: string,
    options?: ApiOptions
  ): Promise<T> {
    const response = await this.request<T>(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      ...options
    });
    
    return response;
  }

  /**
   * Generic request method
   */
  static async request<T>(
    url: string,
    options: ApiOptions & { method: string; body?: string }
  ): Promise<T> {
    const { headers = {}, withAuth = true, withCredentials = true, method, body } = options;

    // Initialize CSRF token if needed for non-GET requests
    if (method !== 'GET') {
      await tokenService.initCsrfToken();
    }
    
    // Default headers for JSON API
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add X-CSRF-TOKEN header for non-GET requests
    if (method !== 'GET') {
      const csrfToken = tokenService.getCsrfToken();
      if (csrfToken) {
        defaultHeaders['X-CSRF-TOKEN'] = csrfToken;
      }
    }
    
    // Add Authorization header if requested
    if (withAuth) {
      const token = tokenService.getToken();
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Merge default headers with provided headers
    const requestHeaders = { ...defaultHeaders, ...headers };
    
    // Build the fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: withCredentials ? 'include' : 'same-origin',
    };
    
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      fetchOptions.body = body;
    }
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // Check for server errors
      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('Content-Type') || '';
        
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          
          // Format error for better handling
          throw {
            status: response.status,
            message: errorData.message || 'An error occurred',
            errors: errorData.errors,
            data: errorData
          };
        } else {
          // Non-JSON error response
          const text = await response.text();
          throw {
            status: response.status,
            message: text || `HTTP Error ${response.status}`,
          };
        }
      }
      
      // Handle no content responses
      if (response.status === 204) {
        return {} as T;
      }
      
      // Parse JSON response
      const data = await response.json();
      
      // Check API response format
      if ('data' in data) {
        // Return the data property if it exists
        return data.data as T;
      }
      
      // Return the entire response if no data property
      return data as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }
}

export default ApiService;
