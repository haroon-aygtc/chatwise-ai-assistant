
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../api';
import { API_CONFIG } from '../api/config';
import { User, LoginFormValues, RegisterFormValues } from '@/types/auth';

class AuthService {
  /**
   * Get CSRF cookie
   */
  static async getCsrfCookie(): Promise<void> {
    try {
      // Laravel requires a CSRF token for all non-GET requests
      await axios.get(`${API_CONFIG.BASE_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    } catch (error) {
      console.error("Failed to get CSRF cookie:", error);
      throw error;
    }
  }

  /**
   * Login user
   * @param credentials User credentials
   */
  static async login(credentials: LoginFormValues): Promise<User> {
    try {
      await this.getCsrfCookie();
      const response = await api.post<User>('/login', credentials);
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
  static async register(userData: RegisterFormValues): Promise<User> {
    try {
      await this.getCsrfCookie();
      const response = await api.post<User>('/register', userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Get authenticated user
   */
  static async getUser(): Promise<User> {
    try {
      const response = await api.get<User>('/user');
      return response;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Verify authentication
   */
  static async verifyAuth(): Promise<boolean> {
    try {
      await this.getUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await this.getCsrfCookie();
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   * @param email User email
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      await this.getCsrfCookie();
      await api.post('/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   * @param data Password reset data
   */
  static async resetPassword(data: { 
    email: string; 
    password: string; 
    password_confirmation: string; 
    token: string;
  }): Promise<void> {
    try {
      await this.getCsrfCookie();
      await api.post('/reset-password', data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

export default AuthService;
