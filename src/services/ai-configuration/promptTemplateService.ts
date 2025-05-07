
import apiService from '../api/api';
import { PromptTemplate, PromptTemplateCategory } from '@/types/ai-configuration';

/**
 * Service for managing prompt templates
 * Provides methods for CRUD operations on prompt templates and categories
 */

/**
 * Get all prompt templates
 * @returns Array of prompt templates
 */
export const getAllTemplates = async (): Promise<PromptTemplate[]> => {
  return apiService.get<PromptTemplate[]>('/ai/prompt-templates');
};

/**
 * Get a specific prompt template by ID
 * @param id The template ID
 * @returns The prompt template
 */
export const getTemplateById = async (id: string): Promise<PromptTemplate> => {
  return apiService.get<PromptTemplate>(`/ai/prompt-templates/${id}`);
};

/**
 * Get all prompt template categories
 * @returns Array of template categories
 */
export const getCategories = async (): Promise<PromptTemplateCategory[]> => {
  return apiService.get<PromptTemplateCategory[]>('/ai/prompt-templates/categories');
};

/**
 * Create a new prompt template
 * @param data The template data
 * @returns The created template
 */
export const createTemplate = async (data: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<PromptTemplate> => {
  return apiService.post<PromptTemplate>('/ai/prompt-templates', data);
};

/**
 * Update an existing prompt template
 * @param id The template ID
 * @param data The updated template data
 * @returns The updated template
 */
export const updateTemplate = async (id: string, data: Partial<PromptTemplate>): Promise<PromptTemplate> => {
  return apiService.put<PromptTemplate>(`/ai/prompt-templates/${id}`, data);
};

/**
 * Delete a prompt template
 * @param id The template ID
 */
export const deleteTemplate = async (id: string): Promise<void> => {
  return apiService.delete(`/ai/prompt-templates/${id}`);
};

/**
 * Increment the usage count for a template
 * @param id The template ID
 * @returns The updated template
 */
export const incrementUsage = async (id: string): Promise<PromptTemplate> => {
  return apiService.post<PromptTemplate>(`/ai/prompt-templates/${id}/increment-usage`);
};
