
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { User, LoginCredentials, RegisterData } from "@/types/domain";
import API_CONFIG from "../api/config";
import tokenService from "./tokenService";

const authService = {
  /**
   * Login a user
   */
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, credentials);
    const { user, token } = response.data;
    tokenService.setToken(token);
    return { user, token };
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/register`, data);
    return response.data.user;
  },

  /**
   * Logout the current user
   */
  async logout() {
    const headers = this.getAuthHeaders();
    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}/auth/logout`,
        {},
        { headers }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    tokenService.removeToken();
    return { success: true };
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const headers = this.getAuthHeaders();
    const response = await axios.get(`${API_CONFIG.BASE_URL}/profile`, { headers });
    return response.data.user;
  },

  /**
   * Get authentication headers
   */
  getAuthHeaders(token?: string): AxiosHeaders {
    const authToken = token || tokenService.getToken();
    const headers = new AxiosHeaders();
    
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    
    return headers;
  },
  
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, password_confirmation: string) {
    const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
      token,
      password,
      password_confirmation
    });
    return response.data;
  },
  
  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const token = tokenService.getToken();
      if (!token) {
        return null;
      }
      
      const headers = this.getAuthHeaders(token);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/auth/user`, { headers });
      return response.data.user;
    } catch (error) {
      tokenService.removeToken();
      return null;
    }
  }
};

export default authService;
