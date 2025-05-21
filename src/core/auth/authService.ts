/**
 * Auth Service
 *
 * Handles authentication operations like login, logout, registration, and session management
 */
import axios from "axios";
import { apiService } from "../api/service";
import { AUTH_ENDPOINTS } from "../api/config";
import tokenService from "./tokenService";
import {
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetData,
} from "./types";

const SESSION_TIMESTAMP_KEY = "page_load_time";
const DEBUG = process.env.NODE_ENV === "development";

/**
 * Auth Service Class
 */
export class AuthService {
  /**
   * Login a user
   */
  async login(credentials: LoginCredentials) {
    // First try to get a fresh CSRF token
    try {
      if (DEBUG) console.log("Login: Initializing CSRF token");
      const token = await tokenService.initCsrfToken(true); // Force refresh

      if (!token) {
        if (DEBUG) console.log("Login: Warning - No CSRF token obtained");
      } else {
        if (DEBUG)
          console.log(
            `Login: CSRF token obtained: ${token.substring(0, 10)}...`,
          );
      }
    } catch (error) {
      if (DEBUG) console.log("Login: Failed to fetch CSRF token", error);
      // Continue anyway - the server might not require CSRF for login
    }

    try {
      if (DEBUG) console.log("Login: Making login request");

      const response = await apiService.post(AUTH_ENDPOINTS.LOGIN, credentials);

      if (DEBUG) console.log("Login: Success, marking session as active");

      // Mark session as active
      tokenService.setActiveSession();

      // Store timestamp for page refresh detection
      const timestamp = Date.now().toString();
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);

      return response;
    } catch (error) {
      if (DEBUG) console.log("Login error:", error);

      // Check if it's a CSRF token mismatch
      if (axios.isAxiosError(error) && error.response?.status === 419) {
        if (DEBUG)
          console.log(
            "Login: CSRF token mismatch, trying again with fresh token",
          );

        // Try one more time with a fresh token
        try {
          await tokenService.initCsrfToken(true); // Force refresh

          const retryResponse = await apiService.post(
            AUTH_ENDPOINTS.LOGIN,
            credentials,
          );

          if (DEBUG)
            console.log("Login retry: Success, marking session as active");
          tokenService.setActiveSession();

          const timestamp = Date.now().toString();
          sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
          localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);

          return retryResponse;
        } catch (retryError) {
          if (DEBUG) console.log("Login retry error:", retryError);
          tokenService.clearSession();
          throw retryError;
        }
      }

      // Clear session and rethrow for other errors
      tokenService.clearSession();
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    try {
      await tokenService.initCsrfToken();
    } catch (error) {
      if (DEBUG) console.log("Register: Failed to fetch CSRF token", error);
    }

    const response = await apiService.post(AUTH_ENDPOINTS.REGISTER, data);
    tokenService.setActiveSession();
    return response.user;
  }

  /**
   * Logout the current user
   */
  async logout() {
    try {
      await apiService.post(AUTH_ENDPOINTS.LOGOUT, {});
    } catch (error) {
      if (DEBUG) console.log("Logout error (ignored):", error);
    }

    tokenService.clearSession();
    return { success: true };
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    if (!tokenService.hasActiveSession()) {
      return null;
    }

    try {
      await tokenService.initCsrfToken();

      const response = await apiService.get(AUTH_ENDPOINTS.CURRENT_USER);
      return response.user;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 419)
      ) {
        tokenService.clearSession();
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
      return null;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    await tokenService.initCsrfToken();
    return await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD_REQUEST, {
      email,
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordResetData) {
    await tokenService.initCsrfToken();
    return await apiService.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  }

  /**
   * Check if session is still valid
   */
  async checkSession() {
    if (!tokenService.hasActiveSession()) {
      throw new Error("No active session");
    }

    await this.getCurrentUser();
    return true;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    if (!tokenService.hasActiveSession()) {
      if (DEBUG) console.log("getCurrentUser: No active session found");
      return null;
    }

    try {
      await tokenService.initCsrfToken();
      if (DEBUG) console.log("getCurrentUser: Fetching user data");

      const response = await apiService.get(AUTH_ENDPOINTS.CURRENT_USER);

      if (DEBUG) console.log("getCurrentUser: Response received");

      const userData = response.user;

      if (!userData) {
        if (DEBUG) console.log("getCurrentUser: No user data in response");
        return null;
      }

      if (!userData.permissions) {
        userData.permissions = [];
      }

      tokenService.setActiveSession();
      if (DEBUG)
        console.log("getCurrentUser: User data retrieved successfully");

      return userData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (DEBUG) console.log("getCurrentUser error:", error);

        if (error.response?.status === 401 || error.response?.status === 419) {
          if (DEBUG)
            console.log("getCurrentUser: Auth error, clearing session");
          tokenService.clearSession();
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
      } else {
        if (DEBUG) console.log("getCurrentUser unknown error:", error);
      }

      return null;
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

// Export the class for extending or testing
export default AuthService;
