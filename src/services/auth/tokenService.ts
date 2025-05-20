import { jwtDecode } from "jwt-decode";
import API_CONFIG from "../api/config";

/**
 * Token service for handling authentication tokens
 */
const tokenService = {
  /**
   * Get token from storage
   */
  getToken: (): string | null => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      localStorage.setItem("token_last_accessed", Date.now().toString());
    }

    return token;
  },

  /**
   * Save token to storage
   */
  setToken: (token: string): void => {
    if (!token) {
      return;
    }

    localStorage.setItem("auth_token", token);
    localStorage.setItem("token_last_accessed", Date.now().toString());
    sessionStorage.setItem("has_active_session", "true");

    try {
      const decoded = jwtDecode(token);
      if ((decoded as any).exp) {
        localStorage.setItem("token_expiration", String((decoded as any).exp * 1000));
      }
    } catch (error) {
      const expiration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("token_expiration", String(expiration));
    }
  },

  /**
   * Remove token from storage
   */
  removeToken: (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_expiration");
    localStorage.removeItem("token_last_accessed");
    sessionStorage.removeItem("has_active_session");
  },

  /**
   * Alias for removeToken for backward compatibility
   */
  clearToken: (): void => {
    tokenService.removeToken();
  },

  /**
   * Get CSRF token from meta tag
   */
  getCsrfToken: (): string | null => {
    return (
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || null
    );
  },

  /**
   * Initialize CSRF token by fetching from the server
   */
  initCsrfToken: async (): Promise<void> => {
    try {
      const existingToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (existingToken) {
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch CSRF token: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Decode JWT token with better error handling
   */
  decodeToken: (token: string): any => {
    try {
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        return {
          exp: Math.floor(Date.now() / 1000) + 86400
        };
      }

      return jwtDecode(token);
    } catch (error) {
      return {
        exp: Math.floor(Date.now() / 1000) + 86400
      };
    }
  },

  /**
   * Validate token with improved robustness
   */
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

    if (!token) {
      return false;
    }

    try {
      if (!token.includes('.')) {
        const expStr = localStorage.getItem("token_expiration");
        if (expStr) {
          const expTime = parseInt(expStr, 10);
          const isExpired = expTime < Date.now();

          if (isExpired) {
            tokenService.removeToken();
            return false;
          }
        }

        if (hasActiveSession) {
          return true;
        }

        const lastAccessedStr = localStorage.getItem("token_last_accessed");
        if (lastAccessedStr) {
          const lastAccessed = parseInt(lastAccessedStr, 10);
          const now = Date.now();
          if (now - lastAccessed < 60 * 60 * 1000) {
            return true;
          }
        }

        return true;
      }

      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded.exp) {
        return true;
      }

      const isExpired = decoded.exp < now;

      if (isExpired) {
        tokenService.removeToken();
        return false;
      }

      return true;
    } catch (error) {
      const expStr = localStorage.getItem("token_expiration");
      if (expStr) {
        const expTime = parseInt(expStr, 10);
        const isExpired = expTime < Date.now();

        if (isExpired) {
          tokenService.removeToken();
          return false;
        }

        return true;
      }
      return true;
    }
  },

  /**
   * Check if token is expired with improved handling
   */
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

    if (!token) return true;

    const expStr = localStorage.getItem("token_expiration");
    if (expStr) {
      const expTime = parseInt(expStr, 10);
      const isExpired = expTime < Date.now();

      if (isExpired) {
        tokenService.removeToken();
        return true;
      }

      return false;
    }

    if (hasActiveSession && token) {
      return false;
    }

    try {
      if (!token.includes('.')) {
        const lastAccessedStr = localStorage.getItem("token_last_accessed");
        if (lastAccessedStr) {
          const lastAccessed = parseInt(lastAccessedStr, 10);
          const now = Date.now();
          if (now - lastAccessed < 60 * 60 * 1000) {
            return false;
          }
        }

        return false;
      }

      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      const isExpired = decoded.exp && decoded.exp < now;

      if (isExpired) {
        tokenService.removeToken();
      }

      return isExpired;
    } catch (error) {
      if (hasActiveSession) {
        return false;
      }

      return false;
    }
  },

  /**
   * Check if token needs refresh (less than 5 minutes remaining)
   */
  needsRefresh: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false;

    const expStr = localStorage.getItem("token_expiration");
    if (expStr) {
      const expTime = parseInt(expStr, 10);
      return (expTime - Date.now()) < 5 * 60 * 1000;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      return decoded.exp && (decoded.exp - now < 300);
    } catch (error) {
      return false;
    }
  },
};

export default tokenService;
