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
      await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store",
        },
      });
    } catch (error) {
      console.warn("Failed to fetch CSRF token before login:", error);
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
          "Cache-Control": "no-cache, no-store",
        },
      },
    );

    const { user, token } = response.data;

    // Store token with enhanced persistence
    tokenService.setToken(token);

    // Set session marker to help with page refreshes
    sessionStorage.setItem("has_active_session", "true");

    return { user, token };
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData) {
    // First, ensure we have a CSRF token
    try {
      await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    } catch (error) {
      console.warn("Failed to fetch CSRF token before registration:", error);
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/register`, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
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
          headers,
          withCredentials: true,
          headers: {
            ...headers,
            "Cache-Control": "no-cache, no-store",
          },
        },
      );
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clean up all token-related storage
    tokenService.removeToken();

    // Clear session marker
    sessionStorage.removeItem("has_active_session");

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
   * Get current user
   */
  async getCurrentUser() {
    try {
      const token = tokenService.getToken();
      if (!token) {
        // Reduced log noise - only log in development environment
        if (process.env.NODE_ENV === 'development') {
          console.log("getCurrentUser: No token available");
        }
        return null;
      }

      const headers = this.getAuthHeaders(token);

      // Only log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log("Fetching user data from API");
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/user`, {
        headers,
        withCredentials: true,
      });

      // The user data is now consistently returned inside a 'user' property
      const userData = response.data.user;

      if (!userData) {
        console.warn("No user data returned from API");
        return null;
      }

      // Ensure permissions is an array
      if (!userData.permissions) {
        userData.permissions = [];
      }

      // Log permissions count for debugging - only in development
      if (process.env.NODE_ENV === 'development') {
        const permissionsCount = Array.isArray(userData.permissions) ? userData.permissions.length : 0;
        console.log(`User data retrieved: ID=${userData.id}, ${permissionsCount} permissions`);
      }

      return userData;
    } catch (error) {
      // Only log detailed errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error("Error getting current user:", error);
      }

      // Only remove token if it's an authentication error
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        tokenService.removeToken();
      }
      return null;
    }
  },
};

export default authService;
