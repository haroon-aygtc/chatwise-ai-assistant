
import ApiService from '../api/base';
import { tokenService } from './tokenService';

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar_url?: string;
  last_active?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface RegisterResponse {
  user: UserResponse;
  token: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

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
  static async getCurrentUser(): Promise<UserResponse> {
    try {
      return await ApiService.get<UserResponse>('/user');
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
