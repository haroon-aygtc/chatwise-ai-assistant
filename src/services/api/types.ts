
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page?: number;
  meta?: any;
}

// Add AxiosRequestConfig parameter interface to fix type errors
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
}
