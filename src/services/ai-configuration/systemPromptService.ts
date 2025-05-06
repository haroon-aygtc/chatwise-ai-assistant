
import ApiService from '../api/base';
import { SystemPrompt } from '@/types/ai-configuration';

/**
 * System prompt service for managing the system-wide prompt templates
 */

// Get the system prompt
export const getSystemPrompt = async (): Promise<SystemPrompt> => {
  return ApiService.get<SystemPrompt>('/ai-configuration/system-prompt');
};

// Update system prompt
export const updateSystemPrompt = async (content: string): Promise<SystemPrompt> => {
  return ApiService.put<SystemPrompt>('/ai-configuration/system-prompt', { content });
};
