import { jwtDecode } from "jwt-decode";
import API_CONFIG from "../api/config";

const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  setToken: (token: string): void => {
    if (!token) {
      console.error("Attempted to set empty token");
      return;
    }

    console.log("Setting auth token:", token.substring(0, 10) + "...");
    localStorage.setItem("auth_token", token);

    // Decode and log token data (debugging only)
    try {
      const decoded = jwtDecode(token);
      console.log("Token decoded successfully, expires:", new Date((decoded as any).exp * 1000).toLocaleString());
    } catch (error) {
      console.warn("Could not decode token:", error);
    }
  },

  removeToken: (): void => {
    localStorage.removeItem("auth_token");
  },

  // Alias for removeToken for backward compatibility
  clearToken: (): void => {
    localStorage.removeItem("auth_token");
  },

  getCsrfToken: (): string | null => {
    return (
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content") || null
    );
  },

  // Initialize CSRF token by fetching from the server
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
            console.error("Error response:", errorData);
          } catch (readError) {
            console.error("Failed to read error response:", readError);
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
          console.log("Checking for XSRF-TOKEN cookie...");
          const cookies = document.cookie.split('; ');
          const xsrfCookie = cookies.find(cookie => cookie.startsWith('XSRF-TOKEN='));
          console.log("XSRF cookie found?", !!xsrfCookie);
        }
      } else if (isDevMode) {
        console.log("CSRF token found in meta tag:", token.substring(0, 5) + "...");
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      throw error; // Re-throw to allow handling by the caller
    }
  },

  // Decode JWT token
  decodeToken: (token: string): any => {
    try {
      // First check if token is a valid format before attempting to decode
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Token is not in JWT format, cannot decode");
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

  // Check if token is valid
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log("validateToken: No token found in storage");
      }
      return false;
    }

    try {
      // Handle non-JWT tokens (Laravel Sanctum sometimes uses non-JWT tokens)
      if (!token.includes('.')) {
        // If it's not a JWT, we can still consider it valid if it exists
        // The server will validate it properly when used
        if (process.env.NODE_ENV === 'development') {
          console.log("Token is not in JWT format, but treating as valid");
        }
        return true;
      }

      const decoded: any = jwtDecode(token);

      // Check if token is expired
      const now = Date.now() / 1000;
      const isExpired = decoded.exp && decoded.exp < now;

      if (isExpired) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Token expired at ${new Date(decoded.exp * 1000).toLocaleString()}`);
        }
        // Clean up expired token
        localStorage.removeItem("auth_token");
        return false;
      }

      // Check if token will expire soon (within 5 minutes)
      const expiresInSeconds = decoded.exp - now;
      if (expiresInSeconds < 300) { // 5 minutes in seconds
        if (process.env.NODE_ENV === 'development') {
          console.log(`Token will expire soon (${Math.floor(expiresInSeconds)}s remaining)`);
        }
        // We'll still return true but this could trigger a refresh in the future
      } else if (process.env.NODE_ENV === 'development') {
        console.log("Token is valid until:", new Date(decoded.exp * 1000).toLocaleString());
      }

      return true;
    } catch (error) {
      // For non-JWT tokens from Laravel Sanctum, we'll assume they're valid
      // The server will validate them when they're used
      if (process.env.NODE_ENV === 'development') {
        console.log("Failed to validate token as JWT, but will consider it valid:", error);
      }
      return true;
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return true;

    try {
      // If it's not a JWT, assume it's not expired
      if (!token.includes('.')) {
        return false;
      }

      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      const isExpired = decoded.exp && decoded.exp < now;

      // Clean up if expired
      if (isExpired) {
        localStorage.removeItem("auth_token");
      }

      return isExpired;
    } catch (error) {
      // For non-JWT tokens, assume they're not expired
      return false;
    }
  },

  // Check if token needs refresh (less than 5 minutes remaining)
  needsRefresh: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false; // No token to refresh

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
