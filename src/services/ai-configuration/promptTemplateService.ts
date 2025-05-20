import type {
  PromptTemplate,
  PromptTemplateCategory
} from "@/types/ai-configuration";
import api from "../api/api";

// Base URL for prompt template endpoints
const ENDPOINT = "/ai/prompt-templates";

// Service for managing prompt templates
const promptTemplateService = {
  /**
   * Get all templates with optional filtering
   */
  async getAllTemplates(filters?: { search?: string; category?: string }): Promise<PromptTemplate[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }

      if (filters?.category) {
        params.append("category", filters.category);
      }

      const queryString = params.toString();
      const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;

      const response = await api.get(url);
      return response.data.templates || [];
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },

  /**
   * Get a template by ID
   */
  async getTemplateById(id: string): Promise<PromptTemplate> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.template;
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all template categories
   */
  async getCategories(): Promise<PromptTemplateCategory[]> {
    try {
      const response = await api.get(`${ENDPOINT}/categories`);
      return response.data.categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Create a new template
   */
  async createTemplate(templateData: Partial<PromptTemplate>): Promise<PromptTemplate> {
    try {
      const response = await api.post(ENDPOINT, templateData);
      return response.data.template;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },

  /**
   * Update an existing template
   */
  async updateTemplate(id: string, templateData: Partial<PromptTemplate>): Promise<PromptTemplate> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, templateData);
      return response.data.template;
    } catch (error) {
      console.error(`Error updating template with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`${ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting template with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get template library
   */
  async getTemplateLibrary(): Promise<PromptTemplate[]> {
    try {
      const response = await api.get(`${ENDPOINT}/library`);
      return response.data.templates || [];
    } catch (error) {
      console.error("Error fetching template library:", error);
      throw error;
    }
  },

  /**
   * Increment template usage count
   */
  async incrementUsage(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.post(`${ENDPOINT}/${id}/usage`);
      return response.data;
    } catch (error) {
      console.error(`Error incrementing template usage with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Test a template with variables
   */
  async testTemplate(
    templateId: string,
    variables: Record<string, string>,
    modelId?: string
  ): Promise<{ renderedTemplate: string; aiResponse?: string }> {
    try {
      const response = await api.post(`${ENDPOINT}/${templateId}/test`, {
        variables,
        modelId
      });
      return response.data;
    } catch (error) {
      console.error(`Error testing template with ID ${templateId}:`, error);
      throw error;
    }
  },

  /**
   * Get or update system prompt
   */
  async getSystemPrompt(): Promise<{ content: string; version: number; isActive: boolean }> {
    try {
      const response = await api.get(`${ENDPOINT}/system-prompt`);
      return response.data.systemPrompt;
    } catch (error) {
      console.error("Error fetching system prompt:", error);
      throw error;
    }
  },

  /**
   * Update system prompt
   */
  async updateSystemPrompt(content: string): Promise<{ success: boolean }> {
    try {
      const response = await api.put(`${ENDPOINT}/system-prompt`, { content });
      return response.data;
    } catch (error) {
      console.error("Error updating system prompt:", error);
      throw error;
    }
  }
};

export default promptTemplateService;
export const {
  getAllTemplates,
  getTemplateById,
  getCategories,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateLibrary,
  incrementUsage,
  testTemplate,
  getSystemPrompt,
  updateSystemPrompt
} = promptTemplateService;
