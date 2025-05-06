
import ApiService from "../api/base";
import { PromptTemplate } from "@/types/ai-configuration";
import { PaginatedResponse } from "../api/types";

export interface CreatePromptTemplateRequest {
  name: string;
  description: string;
  template: string;
  variables: any[];
  category?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface UpdatePromptTemplateRequest {
  name?: string;
  description?: string;
  template?: string;
  variables?: any[];
  category?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface PromptTemplateFilters {
  search?: string;
  category?: string;
  is_active?: boolean;
}

class PromptTemplateService {
  /**
   * Get all prompt templates with filtering
   */
  static async getTemplates(
    filters: PromptTemplateFilters = {},
    page: number = 1,
    perPage: number = 20
  ): Promise<PaginatedResponse<PromptTemplate>> {
    const params = {
      page,
      per_page: perPage,
      ...filters
    };
    return await ApiService.get<PaginatedResponse<PromptTemplate>>("/prompt-templates", { params });
  }

  /**
   * Get a template by ID
   */
  static async getTemplate(id: string): Promise<PromptTemplate> {
    return await ApiService.get<PromptTemplate>(`/prompt-templates/${id}`);
  }

  /**
   * Create a new prompt template
   */
  static async createTemplate(data: CreatePromptTemplateRequest): Promise<PromptTemplate> {
    return await ApiService.post<PromptTemplate>("/prompt-templates", data);
  }

  /**
   * Update an existing prompt template
   */
  static async updateTemplate(id: string, data: UpdatePromptTemplateRequest): Promise<PromptTemplate> {
    return await ApiService.put<PromptTemplate>(`/prompt-templates/${id}`, data);
  }

  /**
   * Delete a prompt template
   */
  static async deleteTemplate(id: string): Promise<void> {
    await ApiService.delete(`/prompt-templates/${id}`);
  }

  /**
   * Get all template categories
   */
  static async getCategories(): Promise<string[]> {
    return await ApiService.get<string[]>("/prompt-templates/categories/list");
  }

  /**
   * Increment usage count for a template
   */
  static async incrementUsage(id: string): Promise<void> {
    await ApiService.post(`/prompt-templates/${id}/increment-usage`, {});
  }

  /**
   * Get the default template
   */
  static async getDefaultTemplate(): Promise<PromptTemplate | null> {
    const templates = await ApiService.get<PaginatedResponse<PromptTemplate>>("/prompt-templates", {
      params: { is_default: true, per_page: 1 }
    });
    return templates.data.length > 0 ? templates.data[0] : null;
  }
}

export default PromptTemplateService;
