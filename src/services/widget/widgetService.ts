
import ApiService from '../api/base';
import { ChatWidget, WidgetSettings } from '@/types/chat';

// Get all widgets
export const getAllWidgets = async (): Promise<ChatWidget[]> => {
  return ApiService.get<ChatWidget[]>('/widgets');
};

// Get widget by ID
export const getWidgetById = async (id: string): Promise<ChatWidget> => {
  return ApiService.get<ChatWidget>(`/widgets/${id}`);
};

// Create a new widget
export const createWidget = async (data: Omit<ChatWidget, 'id'>): Promise<ChatWidget> => {
  return ApiService.post<ChatWidget>('/widgets', data);
};

// Update widget
export const updateWidget = async (id: string, data: Partial<ChatWidget>): Promise<ChatWidget> => {
  return ApiService.put<ChatWidget>(`/widgets/${id}`, data);
};

// Delete widget
export const deleteWidget = async (id: string): Promise<void> => {
  return ApiService.delete(`/widgets/${id}`);
};

// Get widget settings
export const getWidgetSettings = async (widgetId: string): Promise<WidgetSettings[]> => {
  return ApiService.get<WidgetSettings[]>(`/widgets/${widgetId}/settings`);
};

// Create widget settings
export const createWidgetSettings = async (widgetId: string, data: Omit<WidgetSettings, 'id' | 'widgetId' | 'createdAt' | 'updatedAt'>): Promise<WidgetSettings> => {
  return ApiService.post<WidgetSettings>(`/widgets/${widgetId}/settings`, data);
};

// Update widget settings
export const updateWidgetSettings = async (id: string, data: Partial<WidgetSettings>): Promise<WidgetSettings> => {
  return ApiService.put<WidgetSettings>(`/widget-settings/${id}`, data);
};

// Delete widget settings
export const deleteWidgetSettings = async (id: string): Promise<void> => {
  return ApiService.delete(`/widget-settings/${id}`);
};

// Get widget preview code
export const getWidgetPreviewCode = async (widgetId: string, format: 'js' | 'react' | 'iframe'): Promise<{ code: string }> => {
  return ApiService.get<{ code: string }>(`/widgets/${widgetId}/code`, { params: { format } });
};

// Get widget analytics
export const getWidgetAnalytics = async (widgetId: string): Promise<any> => {
  return ApiService.get<any>(`/widgets/${widgetId}/analytics`);
};

// Get customization options
export const getCustomizationOptions = async (): Promise<any> => {
  return ApiService.get<any>(`/widgets/customization-options`);
};

// Test widget configuration
export const testWidgetConfig = async (config: Partial<ChatWidget>): Promise<{ status: string; message: string }> => {
  return ApiService.post<{ status: string; message: string }>('/widgets/test-config', config);
};
