
import ApiService from '../api/base';
import { User } from '@/types/user';

/**
 * Service for handling authentication related API calls
 */
const AuthService = {
  /**
   * Login a user
   */
  login: async (email: string, password: string) => {
    try {
      const response = await ApiService.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  signup: async (userData: any) => {
    try {
      const response = await ApiService.post('/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await ApiService.get('/auth/user');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      await ApiService.get('/auth/check');
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    try {
      const response = await ApiService.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: { token: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const response = await ApiService.post('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string) => {
    try {
      const response = await ApiService.post('/auth/verify-email', { token });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },
};

export default AuthService;
