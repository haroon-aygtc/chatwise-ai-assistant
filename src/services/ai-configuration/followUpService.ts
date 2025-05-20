import apiService from '../api/api';
import { FollowUpSuggestion } from "@/types/ai-configuration";

// Interface for follow-up settings from the backend
export interface FollowUpSettings {
  id?: number;
  enabled: boolean;
  maxSuggestions: number;
  displayMode?: string;
  autoGenerate?: boolean;
  branchingEnabled?: boolean;
}

/**
 * Get all follow-up suggestions
 */
export async function getAllSuggestions(): Promise<FollowUpSuggestion[]> {
  try {
    const response = await apiService.get<{ data: FollowUpSuggestion[] }>("/ai/follow-up/suggestions");
    return response.data;
  } catch (error) {
    console.error("Error fetching follow-up suggestions:", error);
    throw error;
  }
}

/**
 * Get follow-up suggestion by ID
 */
export async function getSuggestionById(id: string): Promise<FollowUpSuggestion> {
  try {
    const response = await apiService.get<{ data: FollowUpSuggestion }>(`/ai/follow-up/suggestions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching follow-up suggestion ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new follow-up suggestion
 */
export async function createSuggestion(suggestion: Omit<FollowUpSuggestion, "id">): Promise<FollowUpSuggestion> {
  try {
    const response = await apiService.post<{ data: FollowUpSuggestion }>("/ai/follow-up/suggestions", suggestion);
    return response.data;
  } catch (error) {
    console.error("Error creating follow-up suggestion:", error);
    throw error;
  }
}

/**
 * Update an existing follow-up suggestion
 */
export async function updateSuggestion(id: string, suggestion: FollowUpSuggestion): Promise<FollowUpSuggestion> {
  try {
    const response = await apiService.put<{ data: FollowUpSuggestion }>(`/ai/follow-up/suggestions/${id}`, suggestion);
    return response.data;
  } catch (error) {
    console.error(`Error updating follow-up suggestion ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a follow-up suggestion
 */
export async function deleteSuggestion(id: string): Promise<void> {
  try {
    await apiService.delete(`/ai/follow-up/suggestions/${id}`);
  } catch (error) {
    console.error(`Error deleting follow-up suggestion ${id}:`, error);
    throw error;
  }
}

/**
 * Get follow-up settings
 */
export async function getSettings(): Promise<FollowUpSettings> {
  try {
    const response = await apiService.get<{ data: FollowUpSettings }>("/ai/follow-up/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching follow-up settings:", error);
    throw error;
  }
}

/**
 * Update follow-up settings
 */
export async function updateSettings(settings: FollowUpSettings): Promise<FollowUpSettings> {
  try {
    const response = await apiService.put<{ data: FollowUpSettings }>("/ai/follow-up/settings", settings);
    return response.data;
  } catch (error) {
    console.error("Error updating follow-up settings:", error);
    throw error;
  }
}

/**
 * Reorder follow-up suggestions
 */
export async function reorderSuggestions(ids: string[]): Promise<FollowUpSuggestion[]> {
  return await apiService.put<FollowUpSuggestion[]>('/follow-up/suggestions/reorder', { ordered_ids: ids });
}

/**
 * Get suggestion categories
 */
export async function getCategories(): Promise<string[]> {
  return await apiService.get<string[]>('/follow-up/categories');
}
