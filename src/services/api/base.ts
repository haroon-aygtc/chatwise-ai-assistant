
// Base API constants and shared functionality
import axios, { AxiosRequestConfig } from 'axios';

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Common HTTP methods
export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Default request timeout
export const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Create a base API instance
export const baseApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Default API service
const ApiService = {
  baseApi,
  API_BASE_URL,
  DEFAULT_TIMEOUT,
  HttpMethod,
};

export default ApiService;
