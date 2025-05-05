
import ApiService from '../api/base';
import { ResponseFormat } from '@/types/ai-configuration';

export const getAllFormats = async (options?: { search?: string; type?: string; }): Promise<ResponseFormat[]> => {
  try {
    const response = await ApiService.get<{ data: ResponseFormat[] }>('/ai/response-formats', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching response formats:', error);
    throw error;
  }
};

export const getFormatById = async (id: string): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.get<{ data: ResponseFormat }>(`/ai/response-formats/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching response format ${id}:`, error);
    throw error;
  }
};

export const createFormat = async (format: Omit<ResponseFormat, 'id'>): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.post<{ data: ResponseFormat }>('/ai/response-formats', format);
    return response.data;
  } catch (error) {
    console.error('Error creating response format:', error);
    throw error;
  }
};

export const updateFormat = async (id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.put<{ data: ResponseFormat }>(`/ai/response-formats/${id}`, format);
    return response.data;
  } catch (error) {
    console.error(`Error updating response format ${id}:`, error);
    throw error;
  }
};

export const deleteFormat = async (id: string): Promise<void> => {
  try {
    await ApiService.delete<{ success: boolean }>(`/ai/response-formats/${id}`);
  } catch (error) {
    console.error(`Error deleting response format ${id}:`, error);
    throw error;
  }
};

export const previewFormat = async (formatId: string, prompt: string): Promise<string> => {
  try {
    const response = await ApiService.post<{ data: { result: string } }>(
      `/ai/response-formats/${formatId}/preview`, 
      { prompt }
    );
    return response.data.result;
  } catch (error) {
    console.error(`Error previewing format ${formatId}:`, error);
    throw error;
  }
};

const responseFormatService = {
  getAllFormats,
  getFormatById,
  createFormat,
  updateFormat,
  deleteFormat,
  previewFormat,
};

export default responseFormatService;
