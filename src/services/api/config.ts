
import ApiService from "./base";

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const setBaseUrl = (url: string) => {
  const api = ApiService.getAxiosInstance();
  api.defaults.baseURL = url;
};

export const addGlobalHeader = (name: string, value: string) => {
  const api = ApiService.getAxiosInstance();
  api.defaults.headers.common[name] = value;
};

export const removeGlobalHeader = (name: string) => {
  const api = ApiService.getAxiosInstance();
  delete api.defaults.headers.common[name];
};
