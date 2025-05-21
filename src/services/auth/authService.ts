import axios, { AxiosHeaders } from "axios";
import { LoginCredentials, RegisterData } from "@/types/domain";
import API_CONFIG from "../api/config";
import tokenService from "./tokenService";

const authService = {
  /**
   * Login a user
   */
  async login(credentials: LoginCredentials) {
    // First, ensure we have a CSRF token
    try {
      await tokenService.initCsrfToken();
    } catch (error) {
      // Failed to fetch CSRF token, proceed anyway
    }

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/login`,
      credentials,
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );

    const { user, token } = response.data;

    // Store token
    tokenService.setToken(token);

    // Cache user data for refresh scenarios
    localStorage.setItem("cached_user_data", JSON.stringify(user));

    return { user, token };
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    // First, ensure we have a CSRF token
    try {
      await tokenService.initCsrfToken();
    } catch (error) {
      // Failed to fetch CSRF token, proceed anyway
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/register`, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    // Cache user data for refresh scenarios
    if (response.data.user) {
      localStorage.setItem(
        "cached_user_data",
        JSON.stringify(response.data.user),
      );
    }

    return response.data.user;
  },

  /**
   * Logout the current user
   */
  async logout() {
    const headers = this.getAuthHeaders();
    try {
      await axios.post(
        `${API_CONFIG.BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers,
        },
      );
    } catch (error) {
      // Logout error, still proceed with cleanup
    }

    // Clean up all token-related storage
    tokenService.removeToken();

    // Clear cached user data
    localStorage.removeItem("cached_user_data");

    return { success: true };
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const headers = this.getAuthHeaders();
    const response = await axios.get(`${API_CONFIG.BASE_URL}/profile`, {
      headers,
      withCredentials: true,
    });

    // Cache user data for refresh scenarios
    if (response.data.user) {
      localStorage.setItem(
        "cached_user_data",
        JSON.stringify(response.data.user),
      );
    }

    return response.data.user;
  },

  /**
   * Get authentication headers
   */
  getAuthHeaders(token?: string): AxiosHeaders {
    const authToken = token || tokenService.getToken();
    const headers = new AxiosHeaders();

    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    return headers;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/forgot-password`,
      { email },
      { withCredentials: true },
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string,
    password_confirmation: string,
  ) {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/reset-password`,
      {
        token,
        password,
        password_confirmation,
      },
      { withCredentials: true },
    );
    return response.data;
  },

  /**
   * Check if session is still valid
   */
  async checkSession() {
    try {
      const headers = this.getAuthHeaders();
      await axios.get(`${API_CONFIG.BASE_URL}/user`, {
        headers,
        withCredentials: true,
        timeout: 3000,
      });
      return true;
    } catch (error) {
      // If request fails, session is invalid
      tokenService.removeToken();
      localStorage.removeItem("cached_user_data");

      // Dispatch auth expired event
      const authExpiredEvent = new Event("auth:expired");
      window.dispatchEvent(authExpiredEvent);

      return false;
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const token = tokenService.getToken();
      if (!token) {
        return null;
      }

      const headers = this.getAuthHeaders(token);
      const response = await axios.get(`${API_CONFIG.BASE_URL}/user`, {
        headers,
        withCredentials: true,
      });

      // The user data is now consistently returned inside a 'user' property
      const userData = response.data.user;

      if (!userData) {
        return null;
      }

      // Ensure permissions is an array
      if (!userData.permissions) {
        userData.permissions = [];
      }

      // Cache user data for refresh scenarios
      localStorage.setItem("cached_user_data", JSON.stringify(userData));

      return userData;
    } catch (error) {
      // Only remove token if it's an authentication error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        tokenService.removeToken();
      }
      return null;
    }
  },
};

export default authService;
