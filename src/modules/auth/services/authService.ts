
import ApiService from '@/services/api/base';
import { User } from '@/types/user';
import { LoginResponse, PasswordResetRequestData, SignupData } from '../types';

/**
 * Service for handling authentication related API calls
 */
const AuthService = {
  /**
   * Login a user
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return ApiService.post<LoginResponse>('/auth/login', { email, password });
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    return ApiService.post('/auth/logout');
  },

  /**
   * Register a new user
   */
  signup: async (data: SignupData): Promise<User> => {
    return ApiService.post<User>('/auth/register', data);
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    return ApiService.get<User>('/auth/user');
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return ApiService.post<{ message: string }>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordResetRequestData): Promise<{ message: string }> => {
    return ApiService.post<{ message: string }>('/auth/reset-password', data);
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return ApiService.post<{ message: string }>('/auth/verify-email', { token });
  },
};

export default AuthService;
