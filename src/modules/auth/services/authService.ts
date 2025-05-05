
import ApiService from '@/services/api/base';
import { tokenService } from './tokenService';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse, 
  PasswordResetConfirmRequest 
} from '../types';

class AuthService {
  /**
   * Login a user
   * @param credentials Login credentials
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await ApiService.post<LoginResponse>(
        '/login',
        credentials,
        { withAuth: false }
      );

      // Store the token
      if (response.token) {
        tokenService.setToken(response.token, credentials.remember || false);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await ApiService.post<RegisterResponse>(
        '/register',
        userData,
        { withAuth: false }
      );

      // Store the token if provided
      if (response.token) {
        tokenService.setToken(response.token, false);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<any> {
    try {
      return await ApiService.get<any>('/user');
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  static async logout(): Promise<void> {
    try {
      await ApiService.post('/logout', {});
      tokenService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Always clear token even if API call fails
      tokenService.clearToken();
      throw error;
    }
  }

  /**
   * Request a password reset
   * @param email User email
   */
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      return await ApiService.post<{ message: string }>(
        '/password/reset-request',
        { email },
        { withAuth: false }
      );
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param data Password reset data
   */
  static async resetPassword(data: PasswordResetConfirmRequest): Promise<{ message: string }> {
    try {
      return await ApiService.post<{ message: string }>(
        '/password/reset',
        data,
        { withAuth: false }
      );
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Check if the user is authenticated
   */
  static isAuthenticated(): boolean {
    return tokenService.validateToken();
  }
}

export default AuthService;
