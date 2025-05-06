
import ApiService from '@/services/api/base';
import { User } from '@/types/user';
import { LoginResponse, PasswordResetRequestData, SignupData } from '../types';

export interface UserResponse extends User {}

/**
 * Service for handling authentication related API calls
 */
const AuthService = {
  /**
   * Login a user
   */
  login: async (credentials: { email: string; password: string; remember?: boolean }): Promise<LoginResponse> => {
    try {
      return await ApiService.post<LoginResponse>('/auth/login', credentials);
    } catch (error) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      return await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('[AuthService] Logout error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  signup: async (data: SignupData): Promise<User> => {
    try {
      return await ApiService.post<User>('/auth/register', data);
    } catch (error) {
      console.error('[AuthService] Signup error:', error);
      throw error;
    }
  },

  /**
   * Register a new user (alias for signup)
   */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ user: User }> => {
    try {
      const user = await ApiService.post<User>('/auth/register', data);
      return { user };
    } catch (error) {
      console.error('[AuthService] Register error:', error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await ApiService.get<{ data: User }>('/auth/user');
      return response.data;
    } catch (error) {
      console.error('[AuthService] Get current user error:', error);
      throw error;
    }
  },

  /**
   * Check if the user is authenticated
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      await ApiService.get('/auth/check');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>('/auth/forgot-password', { email });
    } catch (error) {
      console.error('[AuthService] Request password reset error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordResetRequestData): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>('/auth/reset-password', data);
    } catch (error) {
      console.error('[AuthService] Reset password error:', error);
      throw error;
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>('/auth/verify-email', { token });
    } catch (error) {
      console.error('[AuthService] Verify email error:', error);
      throw error;
    }
  },
};

export default AuthService;
