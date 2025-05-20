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
      await fetch(
        `${API_CONFIG.BASE_URL.replace("/api", "")}/sanctum/csrf-cookie`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache, no-store",
          },
        },
      );
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
          "Cache-Control": "no-cache, no-store",
        },
      },
    );

    const { user, token } = response.data;

    // Store token with enhanced persistence
    tokenService.setToken(token);

    // Set session marker to help with page refreshes
    sessionStorage.setItem("has_active_session", "true");

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
      await fetch(`/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
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
          headers: {
            ...headers,
            "Cache-Control": "no-cache, no-store",
          },
        },
      );
    } catch (error) {
      // Logout error, still proceed with cleanup
    }

    // Clean up all token-related storage
    tokenService.removeToken();

    // Clear session marker
    sessionStorage.removeItem("has_active_session");

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
   * Get current user
   */
  async getCurrentUser() {
    try {
      const token = tokenService.getToken();
      if (!token) {
        return null;
      }

      // Improved page reload detection using modern methods
      const isPageReload = document.readyState !== "complete";
      const pageLoadTime = Number(
        sessionStorage.getItem("page_load_time") || "0",
      );
      const isRecentPageLoad = Date.now() - pageLoadTime < 5000; // Increased from 3000ms
      const hasPreventRedirectFlag =
        sessionStorage.getItem("prevent_auth_redirect") === "true";
      const isPageRefresh =
        isPageReload || isRecentPageLoad || hasPreventRedirectFlag;

      // If we're in a page refresh and have a session marker, try API but fallback to cached data
      if (
        isPageRefresh &&
        sessionStorage.getItem("has_active_session") === "true"
      ) {
        try {
          // Do a silent api check but don't fail the auth if it errors
          const headers = this.getAuthHeaders(token);
          const response = await axios.get(`${API_CONFIG.BASE_URL}/user`, {
            headers,
            withCredentials: true,
            timeout: 3000, // Increased timeout for refresh scenario
          });

          if (response.data?.user) {
            // The user data is now consistently returned inside a 'user' property
            const userData = response.data.user;

            // Ensure permissions is an array
            if (!userData.permissions) {
              userData.permissions = [];
            }

            // Cache user data for future refresh scenarios
            localStorage.setItem("cached_user_data", JSON.stringify(userData));

            return userData;
          }
        } catch (silentError) {
          // On page refresh, if API fails, try to use cached user data
          console.log(
            "Silent auth check failed during page refresh, trying cached data",
          );

          const cachedUser = JSON.parse(
            localStorage.getItem("cached_user_data") || "null",
          );
          if (cachedUser) {
            console.log("Using cached user data during refresh");
            return {
              ...cachedUser,
              permissions: Array.isArray(cachedUser.permissions)
                ? cachedUser.permissions
                : [],
            };
          }

          // Return a temporary user object to prevent redirect
          // The real session will be verified on the next non-refresh request
          return {
            id: "temp-user",
            name: "Loading...",
            email: "",
            permissions: [],
            // Include minimal data needed to prevent crash
          };
        }
      }

      // Normal auth flow for non-refresh scenarios
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
      // During page refresh, be more lenient with auth errors - improved detection
      const isPageReload = document.readyState !== "complete";
      const pageLoadTime = Number(
        sessionStorage.getItem("page_load_time") || "0",
      );
      const isRecentPageLoad = Date.now() - pageLoadTime < 5000; // Increased from 3000ms
      const hasPreventRedirectFlag =
        sessionStorage.getItem("prevent_auth_redirect") === "true";
      const isPageRefresh =
        isPageReload || isRecentPageLoad || hasPreventRedirectFlag;

      if (
        isPageRefresh &&
        sessionStorage.getItem("has_active_session") === "true"
      ) {
        console.log(
          "Auth check failed during page refresh, trying cached data",
        );

        // Try to use cached user data
        const cachedUser = JSON.parse(
          localStorage.getItem("cached_user_data") || "null",
        );
        if (cachedUser) {
          console.log("Using cached user data after API error");
          return {
            ...cachedUser,
            permissions: Array.isArray(cachedUser.permissions)
              ? cachedUser.permissions
              : [],
          };
        }

        return {
          id: "temp-user",
          name: "Loading...",
          email: "",
          permissions: [],
          // Include minimal data needed to prevent crash
        };
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
