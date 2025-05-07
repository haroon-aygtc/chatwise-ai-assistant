
import apiService from '../api/api';
import { AIModel, ModelProvider, RoutingRule } from '@/types/ai-configuration';

/**
 * Get all AI models
 */
export const getAllModels = async (): Promise<AIModel[]> => {
  try {
    const response = await apiService.get<{ data: AIModel[] }>('/ai/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI models:', error);
    throw error;
  }
};

/**
 * Get public AI models (no auth required)
 */
export const getPublicModels = async (): Promise<AIModel[]> => {
  try {
    const response = await apiService.get<{ data: AIModel[] }>('/ai/models/public');
    return response.data;
  } catch (error) {
    console.error('Error fetching public AI models:', error);
    throw error;
  }
};

/**
 * Get a specific AI model by ID
 */
export const getModelById = async (id: string): Promise<AIModel> => {
  try {
    const response = await apiService.get<{ data: AIModel }>(`/ai/models/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new AI model
 */
export const createModel = async (model: Omit<AIModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIModel> => {
  try {
    const response = await apiService.post<{ data: AIModel }>('/ai/models', model);
    return response.data;
  } catch (error) {
    console.error('Error creating AI model:', error);
    throw error;
  }
};

/**
 * Update an existing AI model
 */
export const updateModel = async (id: string, model: Partial<AIModel>): Promise<AIModel> => {
  try {
    const response = await apiService.put<{ data: AIModel }>(`/ai/models/${id}`, model);
    return response.data;
  } catch (error) {
    console.error(`Error updating AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an AI model
 */
export const deleteModel = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`/ai/models/${id}`);
  } catch (error) {
    console.error(`Error deleting AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Set a model as the default
 */
export const setDefaultModel = async (id: string): Promise<AIModel> => {
  try {
    const response = await apiService.post<{ data: AIModel }>(`/ai/models/${id}/default`);
    return response.data;
  } catch (error) {
    console.error(`Error setting default model ${id}:`, error);
    throw error;
  }
};

/**
 * Test a model with a prompt
 */
export const testModel = async (id: string, prompt: string, options?: Record<string, any>): Promise<string> => {
  try {
    const response = await apiService.post<{ data: { response: string } }>(`/ai/models/${id}/test`, {
      prompt,
      options
    });
    return response.data.response;
  } catch (error) {
    console.error(`Error testing AI model ${id}:`, error);
    throw error;
  }
};

/**
 * Get all model providers
 */
export const getAllProviders = async (): Promise<ModelProvider[]> => {
  try {
    const response = await apiService.get<{ data: ModelProvider[] }>('/ai/providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching model providers:', error);
    throw error;
  }
};

/**
 * Get a specific provider by ID
 */
export const getProviderById = async (id: string): Promise<ModelProvider> => {
  try {
    const response = await apiService.get<{ data: ModelProvider }>(`/ai/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new model provider
 */
export const createProvider = async (provider: Omit<ModelProvider, 'id' | 'createdAt' | 'updatedAt' | 'slug'>): Promise<ModelProvider> => {
  try {
    const response = await apiService.post<{ data: ModelProvider }>('/ai/providers', provider);
    return response.data;
  } catch (error) {
    console.error('Error creating model provider:', error);
    throw error;
  }
};

/**
 * Update an existing model provider
 */
export const updateProvider = async (id: string, provider: Partial<ModelProvider>): Promise<ModelProvider> => {
  try {
    const response = await apiService.put<{ data: ModelProvider }>(`/ai/providers/${id}`, provider);
    return response.data;
  } catch (error) {
    console.error(`Error updating model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a model provider
 */
export const deleteProvider = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`/ai/providers/${id}`);
  } catch (error) {
    console.error(`Error deleting model provider ${id}:`, error);
    throw error;
  }
};

/**
 * Get all routing rules
 */
export const getRoutingRules = async (): Promise<RoutingRule[]> => {
  try {
    const response = await apiService.get<{ data: RoutingRule[] }>('/ai/routing-rules');
    return response.data;
  } catch (error) {
    console.error('Error fetching routing rules:', error);
    throw error;
  }
};

/**
 * Create a new routing rule
 */
export const createRoutingRule = async (rule: Omit<RoutingRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoutingRule> => {
  try {
    const response = await apiService.post<{ data: RoutingRule }>('/ai/routing-rules', rule);
    return response.data;
  } catch (error) {
    console.error('Error creating routing rule:', error);
    throw error;
  }
};

/**
 * Update an existing routing rule
 */
export const updateRoutingRule = async (id: string, rule: Partial<RoutingRule>): Promise<RoutingRule> => {
  try {
    const response = await apiService.put<{ data: RoutingRule }>(`/ai/routing-rules/${id}`, rule);
    return response.data;
  } catch (error) {
    console.error(`Error updating routing rule ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a routing rule
 */
export const deleteRoutingRule = async (id: string): Promise<void> => {
  try {
    await apiService.delete<{ success: boolean }>(`/ai/routing-rules/${id}`);
  } catch (error) {
    console.error(`Error deleting routing rule ${id}:`, error);
    throw error;
  }
};
