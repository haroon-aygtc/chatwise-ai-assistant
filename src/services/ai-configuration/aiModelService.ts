
import ApiService from '../api/base';
import { AIModel, RoutingRule } from '@/types/ai-configuration';

export const getAllModels = async (): Promise<AIModel[]> => {
  try {
    const response = await ApiService.get<{ data: AIModel[] }>('/ai/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI models:', error);
    throw error;
  }
};

export const getModelById = async (id: string): Promise<AIModel> => {
  try {
    const response = await ApiService.get<{ data: AIModel }>(`/ai/models/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI model ${id}:`, error);
    throw error;
  }
};

export const createModel = async (model: Omit<AIModel, 'id'>): Promise<AIModel> => {
  try {
    const response = await ApiService.post<{ data: AIModel }>('/ai/models', model);
    return response.data;
  } catch (error) {
    console.error('Error creating AI model:', error);
    throw error;
  }
};

export const updateModel = async (id: string, model: Partial<AIModel>): Promise<AIModel> => {
  try {
    const response = await ApiService.put<{ data: AIModel }>(`/ai/models/${id}`, model);
    return response.data;
  } catch (error) {
    console.error(`Error updating AI model ${id}:`, error);
    throw error;
  }
};

export const deleteModel = async (id: string): Promise<void> => {
  try {
    await ApiService.delete<{ success: boolean }>(`/ai/models/${id}`);
  } catch (error) {
    console.error(`Error deleting AI model ${id}:`, error);
    throw error;
  }
};

export const getRoutingRules = async (): Promise<RoutingRule[]> => {
  try {
    const response = await ApiService.get<{ data: RoutingRule[] }>('/ai/routing-rules');
    return response.data;
  } catch (error) {
    console.error('Error fetching routing rules:', error);
    throw error;
  }
};

export const createRoutingRule = async (rule: Omit<RoutingRule, 'id'>): Promise<RoutingRule> => {
  try {
    const response = await ApiService.post<{ data: RoutingRule }>('/ai/routing-rules', rule);
    return response.data;
  } catch (error) {
    console.error('Error creating routing rule:', error);
    throw error;
  }
};

export const updateRoutingRule = async (id: string, rule: Partial<RoutingRule>): Promise<RoutingRule> => {
  try {
    const response = await ApiService.put<{ data: RoutingRule }>(`/ai/routing-rules/${id}`, rule);
    return response.data;
  } catch (error) {
    console.error(`Error updating routing rule ${id}:`, error);
    throw error;
  }
};

export const deleteRoutingRule = async (id: string): Promise<void> => {
  try {
    await ApiService.delete<{ success: boolean }>(`/ai/routing-rules/${id}`);
  } catch (error) {
    console.error(`Error deleting routing rule ${id}:`, error);
    throw error;
  }
};

export const testModel = async (id: string, prompt: string): Promise<string> => {
  try {
    const response = await ApiService.post<{ data: { response: string } }>(`/ai/models/${id}/test`, { prompt });
    return response.data.response;
  } catch (error) {
    console.error(`Error testing AI model ${id}:`, error);
    throw error;
  }
};
