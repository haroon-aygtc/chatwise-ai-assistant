
import ApiService from '../api/base';

export interface FollowUpSetting {
  id?: number;
  enabled: boolean;
  max_suggestions: number;
  created_at?: string;
  updated_at?: string;
}

export interface FollowUpSuggestion {
  id?: string;
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
    return ApiService.get<FollowUpSetting>('/follow-up/settings');
  },
  
  /**
   * Update follow-up settings
   */
  updateSettings: async (settings: Partial<FollowUpSetting>): Promise<FollowUpSetting> => {
    return ApiService.put<FollowUpSetting>('/follow-up/settings', settings);
  },
  
  /**
   * Get all follow-up suggestions
   */
  getSuggestions: async (): Promise<FollowUpSuggestion[]> => {
    return ApiService.get<FollowUpSuggestion[]>('/follow-up/suggestions');
  },
  
  /**
   * Create a new follow-up suggestion
   */
  createSuggestion: async (suggestion: Omit<FollowUpSuggestion, 'id'>): Promise<FollowUpSuggestion> => {
    return ApiService.post<FollowUpSuggestion>('/follow-up/suggestions', suggestion);
  },
  
  /**
   * Update an existing follow-up suggestion
   */
  updateSuggestion: async (id: string, suggestion: Partial<FollowUpSuggestion>): Promise<FollowUpSuggestion> => {
    return ApiService.put<FollowUpSuggestion>(`/follow-up/suggestions/${id}`, suggestion);
  },
  
  /**
   * Delete a follow-up suggestion
   */
  deleteSuggestion: async (id: string): Promise<void> => {
    return ApiService.delete<void>(`/follow-up/suggestions/${id}`);
  },
  
  /**
   * Reorder follow-up suggestions
   */
  reorderSuggestions: async (ids: string[]): Promise<FollowUpSuggestion[]> => {
    return ApiService.put<FollowUpSuggestion[]>('/follow-up/suggestions/reorder', { ids });
  },
  
  /**
   * Get suggestion categories
   */
  getCategories: async (): Promise<string[]> => {
    return ApiService.get<string[]>('/follow-up/categories');
  },
};

export default followUpService;
