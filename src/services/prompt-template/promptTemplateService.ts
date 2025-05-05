
import ApiService from "../api/base";
import { PromptTemplate, PromptVariable } from "@/types/ai-configuration";

export interface PromptTemplateFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  perPage?: number;
}

export interface PromptTemplateResponse {
  data: PromptTemplate[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PromptTemplateCreateData {
  name: string;
  description?: string;
  template: string;
  variables?: PromptVariable[];
  category?: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface PromptTemplateUpdateData {
  name?: string;
  description?: string;
  template?: string;
  variables?: PromptVariable[];
  category?: string;
  is_default?: boolean;
  is_active?: boolean;
}

class PromptTemplateService {
  /**
   * Get all prompt templates with optional filtering
   */
  async getAllTemplates(filters: PromptTemplateFilters = {}): Promise<PromptTemplateResponse> {
    const response = await ApiService.get<PromptTemplateResponse>('/prompt-templates', filters);
    
    // Transform the backend data to match frontend types
    return {
      ...response,
      data: response.data.map(template => this.transformTemplateFromApi(template)),
    };
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<PromptTemplate> {
    const response = await ApiService.get<{ data: PromptTemplate }>(`/prompt-templates/${id}`);
    return this.transformTemplateFromApi(response.data);
  }

  /**
   * Create a new prompt template
   */
  async createTemplate(data: PromptTemplateCreateData): Promise<PromptTemplate> {
    const response = await ApiService.post<{ data: PromptTemplate }>('/prompt-templates', this.transformTemplateToApi(data));
    return this.transformTemplateFromApi(response.data);
  }

  /**
   * Update an existing prompt template
   */
  async updateTemplate(id: string, data: PromptTemplateUpdateData): Promise<PromptTemplate> {
    const response = await ApiService.put<{ data: PromptTemplate }>(`/prompt-templates/${id}`, this.transformTemplateToApi(data));
    return this.transformTemplateFromApi(response.data);
  }

  /**
   * Delete a prompt template
   */
  async deleteTemplate(id: string): Promise<void> {
    await ApiService.delete(`/prompt-templates/${id}`);
  }

  /**
   * Get all template categories
   */
  async getCategories(): Promise<string[]> {
    const response = await ApiService.get<{ data: string[] }>('/prompt-templates/categories/list');
    return response.data;
  }

  /**
   * Increment template usage count
   */
  async incrementUsageCount(id: string): Promise<void> {
    await ApiService.post(`/prompt-templates/${id}/increment-usage`, {});
  }

  /**
   * Transform API template data to frontend format
   */
  private transformTemplateFromApi(template: any): PromptTemplate {
    return {
      id: String(template.id),
      name: template.name,
      description: template.description || '',
      template: template.template,
      variables: template.variables || [],
      category: template.category || 'general',
      isDefault: template.is_default || false,
      isActive: template.is_active || true,
      usageCount: template.usage_count || 0,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
    };
  }

  /**
   * Transform frontend template data to API format
   */
  private transformTemplateToApi(template: PromptTemplateCreateData | PromptTemplateUpdateData): any {
    const apiTemplate: any = { ...template };
    
    // Convert camelCase to snake_case for backend
    if ('isDefault' in template) {
      apiTemplate.is_default = template.isDefault;
      delete apiTemplate.isDefault;
    }
    
    if ('isActive' in template) {
      apiTemplate.is_active = template.isActive;
      delete apiTemplate.isActive;
    }
    
    return apiTemplate;
  }
}

export const promptTemplateService = new PromptTemplateService();
export default promptTemplateService;
