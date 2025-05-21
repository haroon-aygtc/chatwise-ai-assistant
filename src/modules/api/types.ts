/**
 * API Types
 *
 * Common types for API requests and responses
 */

export type { ApiParams } from "@/core/api";

/**
 * Paginated response from the API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page?: number;
  from?: number;
  to?: number;
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

/**
 * API request parameters
 */
export interface ApiRequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  filter?: Record<string, any>;
  include?: string[];
  [key: string]: any;
}
