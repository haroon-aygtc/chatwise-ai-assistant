
import ApiService from '../api/base';
import { FollowUpSuggestion } from '@/types/ai-configuration';

interface FollowUpSettings {
  enabled: boolean;
  max_suggestions: number;
}

interface TestResponse {
  response: string;
  followUps: FollowUpSuggestion[];
  settings: {
    enabled: boolean;
    max_suggestions: number;
  };
}

class FollowUpService {
  private readonly baseUrl = '/follow-up-suggestions';

  /**
   * Get all follow-up suggestions.
   */
  async getAllSuggestions(): Promise<FollowUpSuggestion[]> {
    return ApiService.get<FollowUpSuggestion[]>(this.baseUrl);
  }

  /**
   * Get a specific follow-up suggestion by ID.
   */
  async getSuggestionById(id: string): Promise<FollowUpSuggestion> {
    return ApiService.get<FollowUpSuggestion>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new follow-up suggestion.
   */
  async createSuggestion(suggestion: Partial<FollowUpSuggestion>): Promise<FollowUpSuggestion> {
    return ApiService.post<FollowUpSuggestion>(this.baseUrl, suggestion);
  }

  /**
   * Update an existing follow-up suggestion.
   */
  async updateSuggestion(id: string, suggestion: Partial<FollowUpSuggestion>): Promise<FollowUpSuggestion> {
    return ApiService.put<FollowUpSuggestion>(`${this.baseUrl}/${id}`, suggestion);
  }

  /**
   * Delete a follow-up suggestion.
   */
  async deleteSuggestion(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Move a suggestion up in order.
   */
  async moveSuggestionUp(id: string): Promise<FollowUpSuggestion[]> {
    return ApiService.post<FollowUpSuggestion[]>(`${this.baseUrl}/${id}/move-up`, {});
  }

  /**
   * Move a suggestion down in order.
   */
  async moveSuggestionDown(id: string): Promise<FollowUpSuggestion[]> {
    return ApiService.post<FollowUpSuggestion[]>(`${this.baseUrl}/${id}/move-down`, {});
  }

  /**
   * Reorder suggestions.
   */
  async reorderSuggestions(orderedIds: string[]): Promise<FollowUpSuggestion[]> {
    return ApiService.post<FollowUpSuggestion[]>(`${this.baseUrl}/reorder`, { ordered_ids: orderedIds });
  }

  /**
   * Get follow-up settings.
   */
  async getSettings(): Promise<FollowUpSettings> {
    return ApiService.get<FollowUpSettings>(`${this.baseUrl}/settings`);
  }

  /**
   * Update follow-up settings.
   */
  async updateSettings(settings: Partial<FollowUpSettings>): Promise<FollowUpSettings> {
    return ApiService.put<FollowUpSettings>(`${this.baseUrl}/settings`, settings);
  }

  /**
   * Test follow-up suggestions.
   */
  async testSuggestions(): Promise<TestResponse> {
    return ApiService.post<TestResponse>(`${this.baseUrl}/test`, {});
  }
}

export default new FollowUpService();
