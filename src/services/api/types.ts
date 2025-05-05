
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links?: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface ApiRequestOptions {
  withAuth?: boolean;
  params?: Record<string, any>;
}
