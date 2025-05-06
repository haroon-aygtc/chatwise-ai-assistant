
import ApiService from '../api/base';
import { PromptTemplate, PromptTemplateCategory } from '@/types/ai-configuration';

/**
 * Service for managing prompt templates
 */

// Get all templates
export const getAllTemplates = async (): Promise<PromptTemplate[]> => {
  return ApiService.get<PromptTemplate[]>('/ai/prompt-templates');
};

// Get template by ID
export const getTemplateById = async (id: string): Promise<PromptTemplate> => {
  return ApiService.get<PromptTemplate>(`/ai/prompt-templates/${id}`);
};

// Get all template categories
export const getCategories = async (): Promise<PromptTemplateCategory[]> => {
  return ApiService.get<PromptTemplateCategory[]>('/ai/prompt-templates/categories');
};

// Create new template
export const createTemplate = async (data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<PromptTemplate> => {
  return ApiService.post<PromptTemplate>('/ai/prompt-templates', data);
};

// Update template
export const updateTemplate = async (id: string, data: Partial<PromptTemplate>): Promise<PromptTemplate> => {
  return ApiService.put<PromptTemplate>(`/ai/prompt-templates/${id}`, data);
};

// Delete template
export const deleteTemplate = async (id: string): Promise<void> => {
  return ApiService.delete(`/ai/prompt-templates/${id}`);
};

// Increment usage count
export const incrementUsage = async (id: string): Promise<PromptTemplate> => {
  return ApiService.post<PromptTemplate>(`/ai/prompt-templates/${id}/increment-usage`);
};
