
import ApiService from '../api/base';
import type { ResponseFormat } from '@/types/ai-configuration';

const BASE_URL = 'response-formats';

export const getAllResponseFormats = async (): Promise<ResponseFormat[]> => {
  const response = await ApiService.get<{data: ResponseFormat[]}>(`${BASE_URL}`);
  return response.data;
};

export const getResponseFormatById = async (id: string): Promise<ResponseFormat> => {
  const response = await ApiService.get<{data: ResponseFormat}>(`${BASE_URL}/${id}`);
  return response.data;
};

export const getDefaultResponseFormat = async (): Promise<ResponseFormat> => {
  const response = await ApiService.get<{data: ResponseFormat}>(`${BASE_URL}/default`);
  return response.data;
};

export const createResponseFormat = async (format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  const response = await ApiService.post<{data: ResponseFormat}>(`${BASE_URL}`, format);
  return response.data;
};

export const updateResponseFormat = async (id: string, format: Partial<ResponseFormat>): Promise<ResponseFormat> => {
  const response = await ApiService.put<{data: ResponseFormat}>(`${BASE_URL}/${id}`, format);
  return response.data;
};

export const deleteResponseFormat = async (id: string): Promise<void> => {
  await ApiService.delete(`${BASE_URL}/${id}`);
};

export const setDefaultResponseFormat = async (id: string): Promise<ResponseFormat> => {
  const response = await ApiService.post<{data: ResponseFormat}>(`${BASE_URL}/${id}/set-default`);
  return response.data;
};

export const testResponseFormat = async (formatId: string, prompt: string): Promise<string> => {
  const response = await ApiService.post<{data: string}>(`${BASE_URL}/test`, {
    formatId,
    prompt
  });
  return response.data;
};
