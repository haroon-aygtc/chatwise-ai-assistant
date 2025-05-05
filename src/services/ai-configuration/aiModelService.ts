
import axios from "axios";
import { AIModel, RoutingRule } from "@/types/ai-configuration";
import { API_BASE_URL } from "@/services/api/config";
import { ApiResponse } from "@/services/api/types";

/**
 * Get all AI models
 */
export const getModels = async (): Promise<AIModel[]> => {
  try {
    const response = await axios.get<ApiResponse<AIModel[]>>(`${API_BASE_URL}/ai/models`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching AI models:", error);
    return [];
  }
};

/**
 * Get a single AI model by ID
 */
export const getModel = async (id: string): Promise<AIModel | null> => {
  try {
    const response = await axios.get<ApiResponse<AIModel>>(`${API_BASE_URL}/ai/models/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching AI model ${id}:`, error);
    return null;
  }
};

/**
 * Create a new AI model
 */
export const createModel = async (model: Omit<AIModel, "id">): Promise<AIModel | null> => {
  try {
    const response = await axios.post<ApiResponse<AIModel>>(`${API_BASE_URL}/ai/models`, model);
    return response.data.data;
  } catch (error) {
    console.error("Error creating AI model:", error);
    return null;
  }
};

/**
 * Update an existing AI model
 */
export const updateModel = async (id: string, model: Partial<AIModel>): Promise<AIModel | null> => {
  try {
    const response = await axios.put<ApiResponse<AIModel>>(`${API_BASE_URL}/ai/models/${id}`, model);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating AI model ${id}:`, error);
    return null;
  }
};

/**
 * Delete an AI model
 */
export const deleteModel = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/ai/models/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting AI model ${id}:`, error);
    return false;
  }
};

/**
 * Get all routing rules
 */
export const getRoutingRules = async (): Promise<RoutingRule[]> => {
  try {
    const response = await axios.get<ApiResponse<RoutingRule[]>>(`${API_BASE_URL}/ai/routing-rules`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching routing rules:", error);
    return [];
  }
};

/**
 * Create a new routing rule
 */
export const createRoutingRule = async (rule: Omit<RoutingRule, "id">): Promise<RoutingRule | null> => {
  try {
    const response = await axios.post<ApiResponse<RoutingRule>>(`${API_BASE_URL}/ai/routing-rules`, rule);
    return response.data.data;
  } catch (error) {
    console.error("Error creating routing rule:", error);
    return null;
  }
};

/**
 * Update an existing routing rule
 */
export const updateRoutingRule = async (id: string, rule: Partial<RoutingRule>): Promise<RoutingRule | null> => {
  try {
    const response = await axios.put<ApiResponse<RoutingRule>>(`${API_BASE_URL}/ai/routing-rules/${id}`, rule);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating routing rule ${id}:`, error);
    return null;
  }
};

/**
 * Delete a routing rule
 */
export const deleteRoutingRule = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/ai/routing-rules/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting routing rule ${id}:`, error);
    return false;
  }
};
