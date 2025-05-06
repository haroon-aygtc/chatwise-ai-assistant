
import ApiService from '../api/base';

export interface FollowUpSetting {
  id?: number;
  enabled: boolean;
  max_suggestions: number;
  created_at?: string;
  updated_at?: string;
}

export interface FollowUpSuggestion {
  id: string;
  text: string;
  category: string;
  description?: string;
  order: number;
  is_active: boolean;
  trigger_conditions?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

const followUpService = {
  /**
   * Get follow-up settings
   */
  getSettings: async (): Promise<FollowUpSetting> => {
    const response = await ApiService.get<FollowUpSetting>('/follow-up/settings');
    return response.data;
  },
  
  /**
   * Update follow-up settings
   */
  updateSettings: async (settings: Partial<FollowUpSetting>): Promise<FollowUpSetting> => {
    const response = await ApiService.put<FollowUpSetting>('/follow-up/settings', settings);
    return response.data;
  },
  
  /**
   * Get all follow-up suggestions
   */
  getSuggestions: async (): Promise<FollowUpSuggestion[]> => {
    const response = await ApiService.get<FollowUpSuggestion[]>('/follow-up/suggestions');
    return response.data;
  },
  
  /**
   * Create a new follow-up suggestion
   */
  createSuggestion: async (suggestion: Omit<FollowUpSuggestion, 'id'>): Promise<FollowUpSuggestion> => {
    const response = await ApiService.post<FollowUpSuggestion>('/follow-up/suggestions', suggestion);
    return response.data;
  },
  
  /**
   * Update an existing follow-up suggestion
   */
  updateSuggestion: async (id: string, suggestion: Partial<FollowUpSuggestion>): Promise<FollowUpSuggestion> => {
    const response = await ApiService.put<FollowUpSuggestion>(`/follow-up/suggestions/${id}`, suggestion);
    return response.data;
  },
  
  /**
   * Delete a follow-up suggestion
   */
  deleteSuggestion: async (id: string): Promise<void> => {
    await ApiService.delete<void>(`/follow-up/suggestions/${id}`);
  },
  
  /**
   * Reorder follow-up suggestions
   */
  reorderSuggestions: async (ids: string[]): Promise<FollowUpSuggestion[]> => {
    const response = await ApiService.put<FollowUpSuggestion[]>('/follow-up/suggestions/reorder', { ordered_ids: ids });
    return response.data;
  },
  
  /**
   * Get suggestion categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await ApiService.get<string[]>('/follow-up/categories');
    return response.data;
  },
};

export default followUpService;
