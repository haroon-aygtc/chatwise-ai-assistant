
import ApiService from '@/services/api/base';
import TokenService from './tokenService';

interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface PasswordResetRequestData {
  email: string;
}

interface PasswordResetData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

/**
 * Service for authentication operations
 */
const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await ApiService.post<LoginResponse>('/login', credentials);
      if (response.token) {
        TokenService.setToken(response.token, credentials.remember || false);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterData) => {
    try {
      const response = await ApiService.post<RegisterResponse>('/register', data);
      if (response.token) {
        TokenService.setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      // Call the API to invalidate the token on the server
      await ApiService.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear the token from local storage/cookies
      TokenService.clearToken();
    }
  },

  /**
   * Force logout without API call (for session timeouts, etc.)
   */
  forceLogout: () => {
    TokenService.clearToken();
  },

  /**
   * Get the authenticated user's information
   */
  getCurrentUser: async () => {
    try {
      const response = await ApiService.get('/user');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: () => {
    return TokenService.validateToken();
  },

  /**
   * Request a password reset link
   */
  requestPasswordReset: async (data: PasswordResetRequestData) => {
    const response = await ApiService.post('/password/reset-request', data);
    return response;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordResetData) => {
    const response = await ApiService.post('/password/reset', data);
    return response;
  },
};

export default authService;
