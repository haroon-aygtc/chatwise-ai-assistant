
import ApiService from '../api/api';
import { ResponseFormat } from '@/types/ai-configuration';

// Get all response formats
export const getAllFormats = async (): Promise<ResponseFormat[]> => {
  return ApiService.get<ResponseFormat[]>('/response-formats');
};

// Get default response format
export const getDefaultFormat = async (): Promise<ResponseFormat> => {
  return ApiService.get<ResponseFormat>('/response-formats/default');
};

// Get format by ID
export const getFormatById = async (id: string): Promise<ResponseFormat> => {
  return ApiService.get<ResponseFormat>(`/response-formats/${id}`);
};

// Create new response format
export const createFormat = async (data: Omit<ResponseFormat, 'id'>): Promise<ResponseFormat> => {
  return ApiService.post<ResponseFormat>('/response-formats', data);
};

// Update response format
export const updateFormat = async (id: string, data: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  return ApiService.put<ResponseFormat>(`/response-formats/${id}`, data);
};

// Delete response format
export const deleteFormat = async (id: string): Promise<void> => {
  return ApiService.delete(`/response-formats/${id}`);
};

// Set format as default
export const setDefaultFormat = async (id: string): Promise<ResponseFormat> => {
  return ApiService.post<ResponseFormat>(`/response-formats/${id}/set-default`);
};

// Test format with a prompt
export const testFormat = async (formatId: string, prompt: string): Promise<{ formatted: string }> => {
  return ApiService.post<{ formatted: string }>(`/response-formats/${formatId}/test`, { prompt });
};
