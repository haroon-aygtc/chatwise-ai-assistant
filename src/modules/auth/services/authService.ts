import ApiService from "@/services/api/base";
import { User } from "@/types/user";
import { LoginResponse, PasswordResetRequestData, SignupData } from "../types";
import tokenService from "./tokenService";

/**
 * Service for handling authentication related API calls
 */
const AuthService = {
  /**
   * Login a user
   * @param email User's email
   * @param password User's password
   * @param rememberMe Whether to remember the user's session
   */
  login: async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResponse> => {
    try {
      const response = await ApiService.post<LoginResponse>("/auth/login", {
        email,
        password,
        remember: rememberMe,
      });

      // Store the token
      if (response && response.token) {
        tokenService.setToken(response.token, rememberMe);
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await ApiService.post("/auth/logout");
      // Clear the token regardless of API response
      tokenService.clearToken();
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the token even if the API call fails
      tokenService.clearToken();
      throw error;
    }
  },

  /**
   * Register a new user
   */
  signup: async (data: SignupData): Promise<LoginResponse> => {
    try {
      const response = await ApiService.post<LoginResponse>(
        "/auth/register",
        data
      );

      // Store the token if available
      if (response && response.token) {
        tokenService.setToken(response.token, false);
      }

      return response;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      return await ApiService.get<User>("/auth/user");
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      // First check if we have a valid token
      if (!tokenService.validateToken()) {
        return false;
      }

      // Then verify with the server
      await ApiService.get("/auth/check");
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );
    } catch (error) {
      console.error("Request password reset error:", error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (
    data: PasswordResetRequestData
  ): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>(
        "/auth/reset-password",
        data
      );
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    try {
      return await ApiService.post<{ message: string }>("/auth/verify-email", {
        token,
      });
    } catch (error) {
      console.error("Verify email error:", error);
      throw error;
    }
  },
};

export default AuthService;
