
import ApiService from "../api/base";
import { ResponseFormat } from "@/types/ai-configuration";

/**
 * Get all response formats
 */
export const getAllResponseFormats = async (): Promise<ResponseFormat[]> => {
  try {
    return await ApiService.get('/response-formats');
  } catch (error) {
    console.error('Error fetching response formats:', error);
    return [];
  }
};

/**
 * Create a new response format
 */
export const createResponseFormat = async (format: Omit<ResponseFormat, 'id'>): Promise<ResponseFormat> => {
  return await ApiService.post('/response-formats', format);
};

/**
 * Update an existing response format
 */
export const updateResponseFormat = async (id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  return await ApiService.put(`/response-formats/${id}`, format);
};

/**
 * Delete a response format
 */
export const deleteResponseFormat = async (id: string): Promise<void> => {
  await ApiService.delete(`/response-formats/${id}`);
};

/**
 * Set a response format as default
 */
export const setDefaultResponseFormat = async (id: string): Promise<void> => {
  await ApiService.post(`/response-formats/${id}/set-default`);
};

/**
 * Test a response format with sample content
 */
export const testResponseFormat = async (
  formatId: string,
  content: string
): Promise<{ formatted: string }> => {
  return await ApiService.post(`/response-formats/${formatId}/test`, { content });
};
