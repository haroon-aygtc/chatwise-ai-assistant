import axios from 'axios';
import { User } from '@/types/user';
import { LoginResponse, SignupData, PasswordResetRequestData } from './types';
import tokenService from './tokenService';
import { handleAuthError } from './utils';

/**
 * Authentication service for handling API calls related to authentication
 */
class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = '/api';
  }

  /**
   * Login a user
   * @param email User email
   * @param password User password
   * @param remember Whether to remember the user
   * @returns Promise with login response
   */
  async login(email: string, password: string, remember: boolean = false): Promise<LoginResponse> {
    try {
      // Initialize CSRF token for Laravel Sanctum
      await tokenService.initCsrfToken();

      const response = await axios.post(`${this.apiUrl}/auth/login`, {
        email,
        password,
        remember,
      }, {
        withCredentials: true // Important for cookies
      });

      // Store the token if returned in the response
      if (response.data.token) {
        tokenService.setToken(
          response.data.token,
          remember,
          response.data.expires_in
        );
      }

      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with signup response
   */
  async signup(userData: SignupData): Promise<LoginResponse> {
    try {
      // Initialize CSRF token for Laravel Sanctum
      await tokenService.initCsrfToken();

      const response = await axios.post(`${this.apiUrl}/auth/register`, userData, {
        withCredentials: true // Important for cookies
      });

      // Store the token if returned in the response
      if (response.data.token) {
        tokenService.setToken(
          response.data.token,
          false,
          response.data.expires_in
        );
      }

      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Logout the current user
   * @returns Promise
   */
  async logout(): Promise<void> {
    try {
      // For Laravel Sanctum, we need to make a request to the logout endpoint
      // This will invalidate the session and clear the cookie
      await axios.post(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true // Important for cookies
        }
      );

      // Clear the token from storage
      tokenService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the token on error
      tokenService.clearToken();
    }
  }

  /**
   * Get the current authenticated user
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<User> {
    try {
      // For Laravel Sanctum, the authentication is handled by cookies
      const response = await axios.get(`${this.apiUrl}/auth/user`, {
        withCredentials: true // Important for cookies
      });

      return response.data.user;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Request a password reset
   * @param email User email
   * @returns Promise with response
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      // Initialize CSRF token for Laravel Sanctum
      await tokenService.initCsrfToken();

      const response = await axios.post(
        `${this.apiUrl}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Reset a user's password
   * @param data Password reset data
   * @returns Promise with response
   */
  async resetPassword(data: PasswordResetRequestData): Promise<{ message: string }> {
    try {
      // Initialize CSRF token for Laravel Sanctum
      await tokenService.initCsrfToken();

      const response = await axios.post(
        `${this.apiUrl}/auth/reset-password`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Verify a user's email
   * @param token Verification token
   * @returns Promise with response
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      // Initialize CSRF token for Laravel Sanctum
      await tokenService.initCsrfToken();

      const response = await axios.post(
        `${this.apiUrl}/auth/verify-email`,
        { token },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }
}

export default new AuthService();
