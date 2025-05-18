
/**
 * Auth Service
 * 
 * Handles authentication for Laravel Sanctum's SPA authentication
 * using session cookies and CSRF protection.
 */

import axios from "axios";
import { LoginCredentials, RegisterData } from "@/types/domain";
import API_CONFIG from "../api/config";
import tokenService from "./tokenService";
import apiService from "../api/api";

const authService = {
  /**
   * Login a user with Laravel Sanctum
   */
  async login(credentials: LoginCredentials) {
    // Initialize CSRF protection first
    await tokenService.initCsrfToken();

    // Login using credentials with Laravel Sanctum
    const response = await axios.post(
      `${API_CONFIG.API_URL}/login`,
      credentials,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true, // Important for cookies to be sent/received
      }
    );

    // For mobile clients, store token if provided
    if (response.data.token) {
      tokenService.setToken(response.data.token);
    }

    return response.data;
  },

  /**
   * Register a new user with Laravel Sanctum
   */
  async register(data: RegisterData) {
    // Initialize CSRF protection first
    await tokenService.initCsrfToken();

    // Register using provided data
    const response = await axios.post(
      `${API_CONFIG.API_URL}/register`,
      data,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      }
    );

    return response.data;
  },

  /**
   * Logout the current user from Laravel Sanctum
   */
  async logout() {
    try {
      // Initialize CSRF protection first
      await tokenService.initCsrfToken();

      // Post to logout endpoint
      await axios.post(
        `${API_CONFIG.API_URL}/logout`,
        {},
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          withCredentials: true,
        }
      );

      // For mobile clients, clear token if any
      tokenService.removeToken();

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await apiService.get<{ user: any }>('/user/profile');
      return response.user;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    // Initialize CSRF protection first
    await tokenService.initCsrfToken();

    const response = await axios.post(
      `${API_CONFIG.API_URL}/forgot-password`,
      { email },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      }
    );

    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, password_confirmation: string) {
    // Initialize CSRF protection first
    await tokenService.initCsrfToken();

    const response = await axios.post(
      `${API_CONFIG.API_URL}/reset-password`,
      {
        token,
        password,
        password_confirmation
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
      }
    );

    return response.data;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      // For SPA authentication in Sanctum, use the /api/user endpoint
      const response = await apiService.get<any>('/user');
      return response;
    } catch (error) {
      console.error("User fetch error:", error);
      throw error;
    }
  }
};

export default authService;
