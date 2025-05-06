
import ApiService from "@/services/api/base";
import { User } from "@/types/user";
import { LoginResponse, PasswordResetRequestData, SignupData } from "../types";
import tokenService from "./tokenService";
import { handleAuthError } from "../utils/errorHandler";

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
      const response = await ApiService.post<LoginResponse>("/login", {
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
      handleAuthError(error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await ApiService.post("/logout");
      // Clear the token regardless of API response
      tokenService.clearToken();
    } catch (error) {
      tokenService.clearToken();
      handleAuthError(error);
      throw error;
    }
  },

  /**
   * Register a new user
   */
  signup: async (data: SignupData): Promise<LoginResponse> => {
    try {
      // Fixed endpoint to ensure it's properly formatted
      const response = await ApiService.post<LoginResponse>("/register", data);

      // Store the token if available
      if (response && response.token) {
        tokenService.setToken(response.token, false);
      }

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      handleAuthError(error);
      throw error;
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      return await ApiService.get<User>("/user");
    } catch (error) {
      handleAuthError(error);
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
      await ApiService.get("/check-auth");
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
      const data = { email };
      const response = await ApiService.post<{ message: string }>(
        "/password/reset-request",
        data
      );
      return { message: response.message || "Password reset email sent" };
    } catch (error) {
      handleAuthError(error);
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
      const response = await ApiService.post<{ message: string }>(
        "/password/reset",
        data
      );
      return { message: response.message || "Password reset successful" };
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    try {
      const response = await ApiService.post<{ message: string }>(
        "/verify-email",
        {
          token,
        }
      );
      return { message: response.message || "Email verified successfully" };
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },
};

export default AuthService;
