
import apiService from '../api/api';
import { ChatWidget, WidgetSettings } from '@/types/chat';
import { WidgetAnalytics, CustomizationOptions } from '@/types/analytics';

/**
 * Get all chat widgets
 * @returns Array of chat widgets
 */
export const getAllWidgets = async (): Promise<ChatWidget[]> => {
  return apiService.get<ChatWidget[]>('/widgets');
};

/**
 * Get a specific chat widget by ID
 * @param id Widget ID
 * @returns Chat widget details
 */
export const getWidgetById = async (id: string): Promise<ChatWidget> => {
  return apiService.get<ChatWidget>(`/widgets/${id}`);
};

/**
 * Create a new chat widget
 * @param data Widget data
 * @returns Created chat widget
 */
export const createWidget = async (data: Omit<ChatWidget, 'id'>): Promise<ChatWidget> => {
  return apiService.post<ChatWidget>('/widgets', data);
};

/**
 * Update an existing chat widget
 * @param id Widget ID
 * @param data Updated widget data
 * @returns Updated chat widget
 */
export const updateWidget = async (id: string, data: Partial<ChatWidget>): Promise<ChatWidget> => {
  return apiService.put<ChatWidget>(`/widgets/${id}`, data);
};

/**
 * Delete a chat widget
 * @param id Widget ID
 */
export const deleteWidget = async (id: string): Promise<void> => {
  return apiService.delete(`/widgets/${id}`);
};

/**
 * Get settings for a specific widget
 * @param widgetId Widget ID
 * @returns Array of widget settings
 */
export const getWidgetSettings = async (widgetId: string): Promise<WidgetSettings[]> => {
  return apiService.get<WidgetSettings[]>(`/widgets/${widgetId}/settings`);
};

/**
 * Create settings for a widget
 * @param widgetId Widget ID
 * @param data Settings data
 * @returns Created widget settings
 */
export const createWidgetSettings = async (
  widgetId: string,
  data: Omit<WidgetSettings, 'id' | 'widgetId' | 'createdAt' | 'updatedAt'>
): Promise<WidgetSettings> => {
  return apiService.post<WidgetSettings>(`/widgets/${widgetId}/settings`, data);
};

/**
 * Update widget settings
 * @param id Settings ID
 * @param data Updated settings data
 * @returns Updated widget settings
 */
export const updateWidgetSettings = async (id: string, data: Partial<WidgetSettings>): Promise<WidgetSettings> => {
  return apiService.put<WidgetSettings>(`/widget-settings/${id}`, data);
};

/**
 * Delete widget settings
 * @param id Settings ID
 */
export const deleteWidgetSettings = async (id: string): Promise<void> => {
  return apiService.delete(`/widget-settings/${id}`);
};

/**
 * Get widget embed code for different platforms
 * @param widgetId Widget ID
 * @param format Code format (js, react, or iframe)
 * @returns Object containing the code
 */
export const getWidgetPreviewCode = async (
  widgetId: string,
  format: 'js' | 'react' | 'iframe'
): Promise<{ code: string }> => {
  return apiService.get<{ code: string }>(`/widgets/${widgetId}/code`, { params: { format } });
};

/**
 * Get analytics data for a widget
 * @param widgetId Widget ID
 * @returns Widget analytics data
 */
export const getWidgetAnalytics = async (widgetId: string): Promise<WidgetAnalytics> => {
  return apiService.get<WidgetAnalytics>(`/widgets/${widgetId}/analytics`);
};

/**
 * Get available customization options for widgets
 * @returns Customization options
 */
export const getCustomizationOptions = async (): Promise<CustomizationOptions> => {
  return apiService.get<CustomizationOptions>(`/widgets/customization-options`);
};

/**
 * Test a widget configuration
 * @param config Widget configuration to test
 * @returns Test result
 */
export const testWidgetConfig = async (
  config: Partial<ChatWidget>
): Promise<{ status: string; message: string }> => {
  return apiService.post<{ status: string; message: string }>('/widgets/test-config', config);
};
