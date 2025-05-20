import { jwtDecode } from "jwt-decode";
import API_CONFIG from "../api/config";

/**
 * Token service for handling authentication tokens
 * Enhanced with better persistence and validation
 */
const tokenService = {
  /**
   * Get token from storage
   */
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  /**
   * Save token to storage
   */
  setToken: (token: string): void => {
    if (!token) {
      console.error("Attempted to set empty token");
      return;
    }

    console.log("Setting auth token:", token.substring(0, 10) + "...");
    localStorage.setItem("auth_token", token);

    // Store the token expiration time as a timestamp for easier validation later
    try {
      const decoded = jwtDecode(token);
      if ((decoded as any).exp) {
        localStorage.setItem("token_expiration", String((decoded as any).exp * 1000));
      }
    } catch (error) {
      console.warn("Could not decode token:", error);
      // For non-JWT tokens, set a default expiration (24 hours)
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
  },

  /**
   * Alias for removeToken for backward compatibility
   */
  clearToken: (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_expiration");
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
    const isDevMode = process.env.NODE_ENV === 'development';

    try {
      if (isDevMode) console.log("Starting CSRF token initialization...");

      // Check if we already have a CSRF token before making the request
      const existingToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (existingToken) {
        if (isDevMode) console.log("CSRF token already exists, skipping fetch");
        return;
      }

      // This endpoint is typically used in Laravel Sanctum to set the CSRF cookie
      if (isDevMode) console.log(`Making fetch request to ${API_CONFIG.BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`);

      // Use fetch with credentials to ensure cookies are sent and stored
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
        console.error(`CSRF fetch failed with status: ${response.status} ${response.statusText}`);

        // Only try to read error response body in development mode
        if (isDevMode) {
          try {
            const errorData = await response.text();
          } catch (readError) {
          }
        }

        throw new Error(
          `Failed to fetch CSRF token: ${response.status} ${response.statusText}`,
        );
      }

      if (isDevMode) console.log("CSRF cookie fetch completed successfully. Looking for meta tag...");

      // After fetching, check if the token is now available
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      if (!token) {
        console.warn("CSRF token not found in meta tag after fetch");

        // Check if we can find the cookie directly (only in dev mode)
        if (isDevMode) {
          const cookies = document.cookie.split('; ');
          const xsrfCookie = cookies.find(cookie => cookie.startsWith('XSRF-TOKEN='));
        }
      } else if (isDevMode) {
      }
    } catch (error) {
      throw error; // Re-throw to allow handling by the caller
    }
  },

  /**
   * Decode JWT token with better error handling
   */
  decodeToken: (token: string): any => {
    try {
      // First check if token is a valid format before attempting to decode
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        if (process.env.NODE_ENV === 'development') {
        }
        // Return a placeholder object with a far-future expiration
        // This prevents errors in components that expect a decoded token
        return {
          exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
        };
      }

      return jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      // Return a placeholder object with a far-future expiration
      return {
        exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
      };
    }
  },

  /**
   * Validate token with improved robustness
   */
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
      }
      return false;
    }

    try {
      // For Laravel Sanctum, we'll accept tokens that are not JWT format
      // as the server will validate them properly
      if (!token.includes('.')) {
        // Check for stored expiration time
        const expStr = localStorage.getItem("token_expiration");
        if (expStr) {
          const expTime = parseInt(expStr, 10);
          const isExpired = expTime < Date.now();

          if (isExpired) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("token_expiration");
            return false;
          }
        }

        if (process.env.NODE_ENV === 'development') {
        }
        return true;
      }

      // For JWT tokens, decode and check expiration
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      // If there's no expiration, consider it valid
      if (!decoded.exp) {
        if (process.env.NODE_ENV === 'development') {
        }
        return true;
      }

      const isExpired = decoded.exp < now;

      if (isExpired) {
        if (process.env.NODE_ENV === 'development') {
        }
        // Clean up expired token
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_expiration");
        return false;
      }

      // Check if token will expire soon (within 5 minutes)
      const expiresInSeconds = decoded.exp - now;
      if (expiresInSeconds < 300) { // 5 minutes in seconds
        if (process.env.NODE_ENV === 'development') {
        }
        // We'll still return true but this could trigger a refresh in the future
      } else if (process.env.NODE_ENV === 'development') {
      }

      return true;
    } catch (error) {
      // For non-JWT tokens or if there's an error in decoding,
      // we'll check the stored expiration time as a fallback
      const expStr = localStorage.getItem("token_expiration");
      if (expStr) {
        const expTime = parseInt(expStr, 10);
        const isExpired = expTime < Date.now();

        if (isExpired) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("token_expiration");
          return false;
        }

        return true;
      }

      if (process.env.NODE_ENV === 'development') {
      }
      return true;
    }
  },

  /**
   * Check if token is expired with improved handling
   */
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return true;

    // First check the stored expiration time as it works for both JWT and non-JWT tokens
    const expStr = localStorage.getItem("token_expiration");
    if (expStr) {
      const expTime = parseInt(expStr, 10);
      const isExpired = expTime < Date.now();

      if (isExpired) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_expiration");
        return true;
      }

      // If we have a stored expiration time that's not expired, trust that
      return false;
    }

    try {
      // If it's not a JWT, and we don't have a stored expiration, assume it's not expired
      if (!token.includes('.')) {
        return false;
      }

      // For JWT tokens, decode and check expiration
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      const isExpired = decoded.exp && decoded.exp < now;

      // Clean up if expired
      if (isExpired) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("token_expiration");
      }

      return isExpired;
    } catch (error) {
      // If we can't decode the token, err on the side of caution and assume not expired
      return false;
    }
  },

  /**
   * Check if token needs refresh (less than 5 minutes remaining)
   */
  needsRefresh: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false; // No token to refresh

    // Check stored expiration first
    const expStr = localStorage.getItem("token_expiration");
    if (expStr) {
      const expTime = parseInt(expStr, 10);
      // Return true if less than 5 minutes remaining
      return (expTime - Date.now()) < 5 * 60 * 1000;
    }

    // Fall back to JWT decoding
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      // Return true if less than 5 minutes remaining
      return decoded.exp && (decoded.exp - now < 300);
    } catch (error) {
      return false;
    }
  },
};

export default tokenService;
