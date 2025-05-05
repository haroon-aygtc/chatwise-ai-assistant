
import ApiService from '../api/base';
import type { ResponseFormat } from '@/types/ai-configuration';

const BASE_URL = 'response-formats';

export const getAllResponseFormats = async (): Promise<ResponseFormat[]> => {
  try {
    const response = await ApiService.get<{ data: ResponseFormat[] }>(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching response formats:', error);
    throw error;
  }
};

export const getResponseFormatById = async (id: string): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.get<{ data: ResponseFormat }>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching response format ${id}:`, error);
    throw error;
  }
};

export const getDefaultResponseFormat = async (): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.get<{ data: ResponseFormat }>(`${BASE_URL}/default`);
    return response.data;
  } catch (error) {
    console.error('Error fetching default response format:', error);
    throw error;
  }
};

export const createResponseFormat = async (format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.post<{ data: ResponseFormat }>(`${BASE_URL}`, format);
    return response.data;
  } catch (error) {
    console.error('Error creating response format:', error);
    throw error;
  }
};

export const updateResponseFormat = async (id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.put<{ data: ResponseFormat }>(`${BASE_URL}/${id}`, format);
    return response.data;
  } catch (error) {
    console.error(`Error updating response format ${id}:`, error);
    throw error;
  }
};

export const deleteResponseFormat = async (id: string): Promise<void> => {
  try {
    await ApiService.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting response format ${id}:`, error);
    throw error;
  }
};

export const setDefaultResponseFormat = async (id: string): Promise<ResponseFormat> => {
  try {
    const response = await ApiService.post<{ data: ResponseFormat }>(`${BASE_URL}/${id}/set-default`);
    return response.data;
  } catch (error) {
    console.error(`Error setting default response format ${id}:`, error);
    throw error;
  }
};

export const testResponseFormat = async (formatId: string, prompt: string): Promise<string> => {
  try {
    const response = await ApiService.post<{ data: string }>(`${BASE_URL}/test`, {
      formatId,
      prompt
    });
    return response.data;
  } catch (error) {
    console.error(`Error testing response format:`, error);
    throw error;
  }
};
