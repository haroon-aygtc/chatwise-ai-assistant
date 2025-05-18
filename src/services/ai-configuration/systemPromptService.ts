
import apiService from '../api/api';
import { SystemPrompt } from '@/types/ai-configuration';

/**
 * System prompt service for managing the system-wide prompt templates
 */

/**
 * Get the current system prompt
 * @returns The system prompt configuration
 */
export const getSystemPrompt = async (): Promise<SystemPrompt> => {
  return apiService.get<SystemPrompt>('/ai-configuration/system-prompt');
};

/**
 * Update the system prompt
 * @param content The new content for the system prompt
 * @returns The updated system prompt configuration
 */
export const updateSystemPrompt = async (content: string): Promise<SystemPrompt> => {
  return apiService.put<SystemPrompt>('/ai-configuration/system-prompt', { content });
};
