
import ApiService from "../api/base";
import { ResponseFormat } from "@/types/ai-configuration";
import { PaginatedResponse } from "../api/types";

export interface CreateResponseFormatRequest {
  name: string;
  description?: string;
  format: string;
  length: string;
  tone: string;
  is_default?: boolean;
  options: {
    useHeadings: boolean;
    useBulletPoints: boolean;
    includeLinks: boolean;
    formatCodeBlocks: boolean;
  };
}

export interface UpdateResponseFormatRequest {
  name?: string;
  description?: string;
  format?: string;
  length?: string;
  tone?: string;
  is_default?: boolean;
  options?: {
    useHeadings?: boolean;
    useBulletPoints?: boolean;
    includeLinks?: boolean;
    formatCodeBlocks?: boolean;
  };
}

class ResponseFormatService {
  /**
   * Get all response formats
   */
  static async getFormats(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<ResponseFormat>> {
    return await ApiService.get<PaginatedResponse<ResponseFormat>>("/response-formats", {
      params: { page, per_page: perPage }
    });
  }

  /**
   * Get a format by ID
   */
  static async getFormat(id: string): Promise<ResponseFormat> {
    return await ApiService.get<ResponseFormat>(`/response-formats/${id}`);
  }

  /**
   * Create a new response format
   */
  static async createFormat(data: CreateResponseFormatRequest): Promise<ResponseFormat> {
    return await ApiService.post<ResponseFormat>("/response-formats", data);
  }

  /**
   * Update an existing response format
   */
  static async updateFormat(id: string, data: UpdateResponseFormatRequest): Promise<ResponseFormat> {
    return await ApiService.put<ResponseFormat>(`/response-formats/${id}`, data);
  }

  /**
   * Delete a response format
   */
  static async deleteFormat(id: string): Promise<void> {
    await ApiService.delete(`/response-formats/${id}`);
  }

  /**
   * Get the default response format
   */
  static async getDefaultFormat(): Promise<ResponseFormat> {
    return await ApiService.get<ResponseFormat>("/response-formats/default");
  }

  /**
   * Set a response format as default
   */
  static async setDefaultFormat(id: string): Promise<ResponseFormat> {
    return await ApiService.post<ResponseFormat>(`/response-formats/${id}/set-default`, {});
  }
}

export default ResponseFormatService;
