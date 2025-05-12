import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { LoginCredentials, User, RegisterData } from "@/types";
import { handleApiError } from "@/utils/helpers";
import { AxiosHeaders } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Login user with credentials
 * @param credentials User login credentials
 * @returns User data
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<{ user: User; token: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Register a new user
 * @param data User registration data
 * @returns Registered user data
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true,
    });
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get the authenticated user profile
 * @returns User profile data
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/auth/user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Create request headers with authentication token
 * @param token Authentication token
 * @returns Request headers object
 */
export const getAuthHeaders = (token?: string): AxiosRequestConfig["headers"] => {
  if (!token) return new AxiosHeaders();
  
  const headers = new AxiosHeaders();
  headers.set('Authorization', `Bearer ${token}`);
  return headers;
};
