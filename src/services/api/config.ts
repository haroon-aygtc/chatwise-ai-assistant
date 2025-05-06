
import ApiService from "./base";

// Default to the Laravel URL format used by Laragon if environment variable isn't set
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
