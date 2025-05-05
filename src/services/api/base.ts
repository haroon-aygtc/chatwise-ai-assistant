
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenService } from '../auth/tokenService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
}

interface RequestOptions {
  withAuth?: boolean;
}

class ApiService {
  private static instance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  /**
   * Initialize API service
   */
  static init(config: ApiConfig = {}) {
    this.instance = axios.create({
      baseURL: config.baseURL || API_URL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials !== undefined ? config.withCredentials : true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle common errors
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response) {
          // Handle unauthorized errors (401)
          if (error.response.status === 401) {
            tokenService.clearToken();
            // Redirect to login page or dispatch logout action
            window.location.href = '/login';
          }
          
          // Return the error data from the API
          return Promise.reject(error.response.data);
        }
        
        // Network errors or other issues
        return Promise.reject({
          message: error.message || 'Network error occurred',
        });
      }
    );
  }

  /**
   * GET request
   */
  static async get<T>(endpoint: string, params: Record<string, any> = {}, options: RequestOptions = { withAuth: true }): Promise<T> {
    const config: AxiosRequestConfig = {
      params,
    };
    
    return this.instance.get<any, T>(endpoint, config);
  }

  /**
   * GET request that returns a Blob (for file downloads)
   */
  static async getBlob(endpoint: string, params: Record<string, any> = {}, options: RequestOptions = { withAuth: true }): Promise<Blob> {
    const config: AxiosRequestConfig = {
      params,
      responseType: 'blob',
    };
    
    const response = await this.instance.get(endpoint, config);
    return response as unknown as Blob;
  }

  /**
   * POST request
   */
  static async post<T>(endpoint: string, data: any, options: RequestOptions = { withAuth: true }): Promise<T> {
    return this.instance.post<any, T>(endpoint, data);
  }

  /**
   * PUT request
   */
  static async put<T>(endpoint: string, data: any, options: RequestOptions = { withAuth: true }): Promise<T> {
    return this.instance.put<any, T>(endpoint, data);
  }

  /**
   * PATCH request
   */
  static async patch<T>(endpoint: string, data: any, options: RequestOptions = { withAuth: true }): Promise<T> {
    return this.instance.patch<any, T>(endpoint, data);
  }

  /**
   * DELETE request
   */
  static async delete<T>(endpoint: string, options: RequestOptions = { withAuth: true }): Promise<T> {
    return this.instance.delete<any, T>(endpoint);
  }
}

export default ApiService;
