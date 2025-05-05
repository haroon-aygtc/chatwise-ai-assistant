
import ApiService from "../api/base";
import { ResponseFormat } from "@/types/ai-configuration";

/**
 * Get all response formats
 */
export const getAllResponseFormats = async (): Promise<ResponseFormat[]> => {
  try {
    const response = await ApiService.get('/response-formats');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching response formats:', error);
    return [];
  }
};

/**
 * Create a new response format
 */
export const createResponseFormat = async (format: Omit<ResponseFormat, 'id'>): Promise<ResponseFormat> => {
  const response = await ApiService.post('/response-formats', format);
  return response.data;
};

/**
 * Update an existing response format
 */
export const updateResponseFormat = async (id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  const response = await ApiService.put(`/response-formats/${id}`, format);
  return response.data;
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
  const response = await ApiService.post(`/response-formats/${formatId}/test`, { content });
  return response.data;
};

const responseFormatService = {
  getAllResponseFormats,
  createResponseFormat,
  updateResponseFormat,
  deleteResponseFormat,
  setDefaultResponseFormat,
  testResponseFormat,
};

export default responseFormatService;
