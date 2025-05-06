import axios, { AxiosRequestConfig } from "axios";
import tokenService from "@/services/auth/tokenService";

// Fixed API endpoint for API tests
const BASE_URL = "/api";

// API tester functions
export const apiTester = {
  get: async (endpoint: string, params?: any) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const config: AxiosRequestConfig = { params };

      // Add auth token if available
      const token = tokenService.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await axios.get(url, config);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        success: true,
      };
    } catch (error: any) {
      return {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        success: false,
      };
    }
  },

  post: async (endpoint: string, data?: any) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const config: AxiosRequestConfig = {};

      // Add auth token if available
      const token = tokenService.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await axios.post(url, data, config);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        success: true,
      };
    } catch (error: any) {
      return {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        success: false,
      };
    }
  },

  put: async (endpoint: string, data?: any) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const config: AxiosRequestConfig = {};

      // Add auth token if available
      const token = tokenService.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await axios.put(url, data, config);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        success: true,
      };
    } catch (error: any) {
      return {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        success: false,
      };
    }
  },

  delete: async (endpoint: string) => {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const config: AxiosRequestConfig = {};

      // Add auth token if available
      const token = tokenService.getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await axios.delete(url, config);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        success: true,
      };
    } catch (error: any) {
      return {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        success: false,
      };
    }
  },

  // Initialize CSRF token for Laravel
  initCsrf: async () => {
    try {
      await tokenService.initCsrfToken();
      return true;
    } catch (error) {
      console.error("Failed to initialize CSRF token:", error);
      return false;
    }
  },

  // Get status for test badge
  testStatus: (response: any) => {
    if (!response) return "error";
    if (response.success) return "success";
    if (response.status >= 400 && response.status < 500) return "client-error";
    if (response.status >= 500) return "server-error";
    return "unknown";
  },
};

export default apiTester;
