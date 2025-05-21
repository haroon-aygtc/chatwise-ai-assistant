import axios from "axios";
import { LoginCredentials, RegisterData } from "@/types/domain";
import API_CONFIG from "../api/config";
import tokenService from "./tokenService";

const SESSION_TIMESTAMP_KEY = "page_load_time";
const DEBUG = process.env.NODE_ENV === "development";

// Helper to generate common headers
function getHeaders(extra: Record<string, string> = {}) {
  const csrfToken = tokenService.getCsrfToken() || "";

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...extra,
  };

  // Add CSRF token headers if available
  if (csrfToken) {
    headers["X-CSRF-TOKEN"] = csrfToken;
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  return headers;
}

// Debug logger
function logDebug(label: string, error?: unknown) {
  if (DEBUG) {
    if (error) console.error(label, error);
    else console.log(label);
  }
}

const authService = {
  /**
   * Login a user
   */
  async login(credentials: LoginCredentials) {
    // First try to get a fresh CSRF token
    try {
      logDebug("Login: Initializing CSRF token");
      const token = await tokenService.initCsrfToken(true); // Force refresh

      if (!token) {
        logDebug("Login: Warning - No CSRF token obtained");
      } else {
        logDebug(`Login: CSRF token obtained: ${token.substring(0, 10)}...`);
      }
    } catch (error) {
      logDebug("Login: Failed to fetch CSRF token", error);
      // Continue anyway - the server might not require CSRF for login
    }

    try {
      logDebug("Login: Making login request");

      // Get the latest CSRF token
      const csrfToken = tokenService.getCsrfToken();
      logDebug(`Login: Using CSRF token: ${csrfToken ? csrfToken.substring(0, 10) + '...' : 'none'}`);

      // Create headers with the latest token
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };

      // Only add CSRF token if we have one
      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
        headers["X-XSRF-TOKEN"] = csrfToken;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/login`,
        credentials,
        {
          withCredentials: true,
          headers,
        }
      );

      logDebug("Login: Success, marking session as active");

      // Mark session as active
      tokenService.setActiveSession();

      // Store timestamp for page refresh detection
      const timestamp = Date.now().toString();
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);

      return response.data;
    } catch (error) {
      logDebug("Login error:", error);

      // Check if it's a CSRF token mismatch
      if (axios.isAxiosError(error) && error.response?.status === 419) {
        logDebug("Login: CSRF token mismatch, trying again with fresh token");

        // Try one more time with a fresh token
        try {
          await tokenService.initCsrfToken(true); // Force refresh

          const freshCsrfToken = tokenService.getCsrfToken();
          logDebug(`Login retry: Using fresh CSRF token: ${freshCsrfToken ? freshCsrfToken.substring(0, 10) + '...' : 'none'}`);

          const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          };

          if (freshCsrfToken) {
            headers["X-CSRF-TOKEN"] = freshCsrfToken;
            headers["X-XSRF-TOKEN"] = freshCsrfToken;
          }

          const retryResponse = await axios.post(
            `${API_CONFIG.BASE_URL}/login`,
            credentials,
            {
              withCredentials: true,
              headers,
            }
          );

          logDebug("Login retry: Success, marking session as active");
          tokenService.setActiveSession();

          const timestamp = Date.now().toString();
          sessionStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);
          localStorage.setItem(SESSION_TIMESTAMP_KEY, timestamp);

          return retryResponse.data;
        } catch (retryError) {
          logDebug("Login retry error:", retryError);
          tokenService.clearSession();
          throw retryError;
        }
      }

      // Clear session and rethrow for other errors
      tokenService.clearSession();
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    try {
      await tokenService.initCsrfToken();
    } catch (error) {
      logDebug("Register: Failed to fetch CSRF token", error);
    }

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/register`,
      data,
      {
        withCredentials: true,
        headers: getHeaders(),
      }
    );

    tokenService.setActiveSession();
    return response.data.user;
  },

  /**
   * Logout the current user
   */
  async logout() {
    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: getHeaders({
            "Cache-Control": "no-cache, no-store",
          }),
        }
      );
    } catch (error) {
      logDebug("Logout error (ignored):", error);
    }

    tokenService.clearSession();
    return { success: true };
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    if (!tokenService.hasActiveSession()) {
      return null;
    }

    try {
      await tokenService.initCsrfToken();

      const response = await axios.get(`${API_CONFIG.BASE_URL}/profile`, {
        withCredentials: true,
        headers: getHeaders(),
      });

      return response.data.user;
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
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    await tokenService.initCsrfToken();

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/forgot-password`,
      { email },
      {
        withCredentials: true,
        headers: getHeaders(),
      }
    );

    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string,
    password_confirmation: string
  ) {
    await tokenService.initCsrfToken();

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/reset-password`,
      {
        token,
        password,
        password_confirmation,
      },
      {
        withCredentials: true,
        headers: getHeaders(),
      }
    );

    return response.data;
  },

  /**
   * Check if session is still valid
   */
  async checkSession() {
    if (!tokenService.hasActiveSession()) {
      throw new Error("No active session");
    }

    await this.getCurrentUser();
    return true;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    if (!tokenService.hasActiveSession()) {
      logDebug("getCurrentUser: No active session found");
      return null;
    }

    try {
      await tokenService.initCsrfToken();
      logDebug("getCurrentUser: Fetching user data");

      const response = await axios.get(`${API_CONFIG.BASE_URL}/user`, {
        withCredentials: true,
        headers: getHeaders(),
      });

      logDebug("getCurrentUser: Response received", response.status);

      const userData = response.data.user;

      if (!userData) {
        logDebug("getCurrentUser: No user data in response");
        return null;
      }

      if (!userData.permissions) {
        userData.permissions = [];
      }

      tokenService.setActiveSession();
      logDebug("getCurrentUser: User data retrieved successfully");

      return userData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logDebug("getCurrentUser error:", error);

        if (error.response?.status === 401 || error.response?.status === 419) {
          logDebug("getCurrentUser: Auth error, clearing session");
          tokenService.clearSession();
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
      } else {
        logDebug("getCurrentUser unknown error:", error);
      }

      return null;
    }
  },
};

export default authService;
