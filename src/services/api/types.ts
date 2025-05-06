
import { AxiosRequestConfig } from "axios";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page?: number;
  meta?: any;
}

// API request parameters that get converted to URL query parameters
export interface ApiRequestParams {
  page?: number;
  per_page?: number;
  role?: string;
  status?: string;
  search?: string;
  action_type?: string;
  from_date?: string;
  to_date?: string;
  user_id?: string;
  // Add any other common query parameters here
  [key: string]: any; // Allow for additional parameters
}

// Define the interface for single item responses
export interface SingleResponse<T> {
  data: T;
  message?: string;
}

// Define the interface for action responses (e.g. create, update, delete)
export interface ActionResponse<T> {
  data?: T;
  message: string;
}
