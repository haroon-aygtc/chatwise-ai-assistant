
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { ApiRequestParams } from './types';

class Api {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: API_CONFIG.WITH_CREDENTIALS,
    });

    // Request interceptor for adding auth token
    this.instance.interceptors.request.use(
      (config) => {
        // Add CSRF token for Laravel Sanctum
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (token) {
          config.headers = {
            ...config.headers,
            'X-CSRF-TOKEN': token.getAttribute('content'),
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Generic GET method
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Generic POST method
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Generic PUT method
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Generic DELETE method
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // File upload method
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    try {
      const uploadConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        }
      };
      const response: AxiosResponse<T> = await this.instance.post(url, formData, uploadConfig);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Get the axios instance
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

const apiService = new Api();
export default apiService;
export { Api };
export type ApiParams = ApiRequestParams;
