
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../api/config';
import API_CONFIG from '../api/config';
import tokenService from './tokenService';
import { toast } from 'sonner';
import { User } from '@/types/user';

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface PasswordResetRequestData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Set up axios with credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_CONFIG.BASE_URL;

// Add response interceptor to handle CSRF token mismatches and authentication errors
axios.interceptors.response.use(
  response => response,
  async error => {
    // Handle CSRF token mismatch (status 419)
    if (error.response && error.response.status === 419) {
      console.log("CSRF token mismatch detected, refreshing token...");

      try {
        // Get a fresh CSRF token using our centralized token service
        await tokenService.initCsrfToken();

        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh CSRF token:", refreshError);
        return Promise.reject(error);
      }
    }
    
    // Handle unauthorized errors (status 401)
    if (error.response && error.response.status === 401) {
      // Only clear token if it's not a login attempt
      if (error.config && !error.config.url.includes('login')) {
        console.log("Unauthorized access detected, clearing token...");
        tokenService.clearToken();
        
        // Show an error message
        toast.error("Session expired", {
          description: "Your session has expired. Please log in again."
        });
      }
    }

    return Promise.reject(error);
  }
);

// Add request interceptor to automatically add token
axios.interceptors.request.use(
  config => {
    const token = tokenService.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Get CSRF token first using our centralized token service
      await tokenService.initCsrfToken();

      const response = await axios.post(AUTH_ENDPOINTS.REGISTER, data);

      if (response.data.token) {
        tokenService.setToken(response.data.token, false);

        // Show success toast
        toast.success("Account created successfully!", {
          description: "Welcome to our platform.",
        });
      }

      return response.data;
    } catch (error: any) {
      // Centralized error handling
      const errorData = error.response?.data || { message: "Network error occurred" };

      // Show error toast with more specific message if available
      if (errorData.errors) {
        // Get first validation error message
        const firstError = Object.values(errorData.errors)[0]?.[0] || "Please check your form inputs.";
        toast.error("Registration Failed", {
          description: firstError,
        });
      } else {
        toast.error("Registration Failed", {
          description: errorData.message || "Failed to create account. Please try again.",
        });
      }

      throw errorData;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Get CSRF token first using our centralized token service
      await tokenService.initCsrfToken();

      const response = await axios.post(AUTH_ENDPOINTS.LOGIN, data);

      if (response.data.token) {
        tokenService.setToken(response.data.token, data.remember || false);

        // Show success toast
        toast.success("Login successful!", {
          description: `Welcome back, ${response.data.user.name}!`,
        });
      }

      return response.data;
    } catch (error: any) {
      // Centralized error handling
      const errorData = error.response?.data || { message: "Network error occurred" };

      toast.error("Login Failed", {
        description: errorData.message || "Invalid email or password. Please try again.",
      });

      throw errorData;
    }
  },

  async logout(): Promise<void> {
    try {
      // Get CSRF token first using our centralized token service
      await tokenService.initCsrfToken();

      const token = tokenService.getToken();
      await axios.post(
        AUTH_ENDPOINTS.LOGOUT,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      tokenService.clearToken();

      // Show success toast
      toast.success("Logout successful", {
        description: "You have been logged out.",
      });
    } catch (error: any) {
      // Even if the server request fails, we should clear the token
      tokenService.clearToken();

      // Show error toast
      toast.error("Logout Error", {
        description: "There was an issue logging you out. Your local session has been cleared.",
      });

      throw error.response?.data || { message: "Network error occurred" };
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      // Make sure authorization header is set
      const token = tokenService.getToken();
      const response = await axios.get(AUTH_ENDPOINTS.CURRENT_USER, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      return response.data;
    } catch (error: any) {
      // If we can't get the current user, then the token is probably invalid
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        tokenService.clearToken();
      }
      throw error.response?.data || { message: "Network error occurred" };
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      // Get CSRF token first using our centralized token service
      await tokenService.initCsrfToken();

      await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD_REQUEST, { email });

      // Success toast is handled by the component
    } catch (error: any) {
      // Centralized error handling
      const errorData = error.response?.data || { message: "Network error occurred" };

      toast.error("Reset Request Failed", {
        description: errorData.message || "Failed to send reset email. Please try again.",
      });

      throw errorData;
    }
  },

  async resetPassword(data: PasswordResetRequestData): Promise<void> {
    try {
      // Get CSRF token first using our centralized token service
      await tokenService.initCsrfToken();

      await axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);

      // Success toast is handled by the component
    } catch (error: any) {
      // Centralized error handling
      const errorData = error.response?.data || { message: "Network error occurred" };

      toast.error("Password Reset Failed", {
        description: errorData.message || "Failed to reset password. The link may have expired.",
      });

      throw errorData;
    }
  }
};

// Export aliases for compatibility
export const signup = authService.register;
export const getUser = authService.getCurrentUser;
export const getCurrentUser = authService.getCurrentUser;

export default authService;
