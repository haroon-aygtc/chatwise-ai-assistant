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
   * Validate token with improved robustness and better page refresh handling
   */
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

    // Improved page reload detection using modern and legacy methods
    let isPageReload = document.readyState !== 'complete';

    // Modern method using Navigation API
    if (typeof performance !== 'undefined' &&
      typeof performance.getEntriesByType === 'function') {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        isPageReload = isPageReload || (navEntries[0] as any).type === 'reload';
      }
    }

    // Check session storage for a page load marker
    const pageLoadTime = Number(sessionStorage.getItem('page_load_time') || '0');
    const timeSinceLoad = Date.now() - pageLoadTime;

    // Consider it a page reload if we're within 3 seconds of page load time
    isPageReload = isPageReload || (timeSinceLoad < 3000);

    // Set a flag to prevent redirect during page reload
    if (isPageReload) {
      sessionStorage.setItem('prevent_auth_redirect', 'true');
      // Clear this flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('prevent_auth_redirect');
      }, 3000);
    }

    // No token means not authenticated
    if (!token) {
      return false;
    }

    try {
      // For non-JWT tokens
      if (!token.includes('.')) {
        const expStr = localStorage.getItem("token_expiration");
        if (expStr) {
          const expTime = parseInt(expStr, 10);
          const isExpired = expTime < Date.now();

          if (isExpired) {
            // Don't remove token during page reload to prevent flashing
            if (!isPageReload) {
              tokenService.removeToken();
            }
            return false;
          }
        }

        // During page reload, be more lenient with validation
        if (isPageReload && hasActiveSession) {
          return true;
        }

        if (hasActiveSession) {
          return true;
        }

        const lastAccessedStr = localStorage.getItem("token_last_accessed");
        if (lastAccessedStr) {
          const lastAccessed = parseInt(lastAccessedStr, 10);
          const now = Date.now();
          // Consider token valid if accessed within the last hour
          if (now - lastAccessed < 60 * 60 * 1000) {
            return true;
          }
        }

        return true;
      }

      // For JWT tokens
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (!decoded.exp) {
        return true;
      }

      const isExpired = decoded.exp < now;

      // During page reload, be more lenient with slightly expired tokens
      // This prevents flashing of login screen during refresh
      if (isPageReload && hasActiveSession && isExpired) {
        // Only allow a grace period of 5 seconds for expired tokens during reload
        const gracePeriod = 5; // seconds
        if (now - decoded.exp < gracePeriod) {
          return true;
        }
      }

      if (isExpired) {
        // Don't remove token during page reload to prevent flashing
        if (!isPageReload) {
          tokenService.removeToken();
        }
        return false;
      }

      return true;
    } catch (error) {
      // During page reload, assume token is valid if there's a token and active session
      if (isPageReload && hasActiveSession && token) {
        return true;
      }

      const expStr = localStorage.getItem("token_expiration");
      if (expStr) {
        const expTime = parseInt(expStr, 10);
        const isExpired = expTime < Date.now();

        if (isExpired && !isPageReload) {
          tokenService.removeToken();
          return false;
        }

        return !isExpired;
      }

      // If we have an active session marker, trust it
      return hasActiveSession;
    }
  },

  /**
   * Check if token is expired with improved handling and page refresh awareness
   */
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession = sessionStorage.getItem("has_active_session") === "true";

    // Check if we're in a page reload scenario
    const isPageReload = document.readyState !== 'complete';
    const pageLoadTime = Number(sessionStorage.getItem('page_load_time') || '0');
    const isRecentPageLoad = (Date.now() - pageLoadTime) < 3000;
    const isRefreshScenario = isPageReload || isRecentPageLoad;

    // No token means it's expired
    if (!token) return true;

    // Check stored expiration time first
    const expStr = localStorage.getItem("token_expiration");
    if (expStr) {
      const expTime = parseInt(expStr, 10);
      const isExpired = expTime < Date.now();

      // During page refresh, don't immediately remove token to prevent flashing
      if (isExpired && !isRefreshScenario) {
        tokenService.removeToken();
        return true;
      }

      // During refresh, be more lenient with slightly expired tokens
      if (isExpired && isRefreshScenario) {
        // Only consider it not expired if it's within 5 seconds of expiry during refresh
        const expiredBy = Date.now() - expTime;
        if (expiredBy < 5000) { // 5 second grace period
          return false;
        }
        return true;
      }

      return isExpired;
    }

    // If we have an active session and token, consider it not expired during initial load
    if (hasActiveSession && token && isRefreshScenario) {
      return false;
    }

    try {
      // For non-JWT tokens
      if (!token.includes('.')) {
        const lastAccessedStr = localStorage.getItem("token_last_accessed");
        if (lastAccessedStr) {
          const lastAccessed = parseInt(lastAccessedStr, 10);
          const now = Date.now();
          // Consider token valid if accessed within the last hour
          if (now - lastAccessed < 60 * 60 * 1000) {
            return false;
          }
        }

        // During refresh, be more lenient
        if (isRefreshScenario && hasActiveSession) {
          return false;
        }

        return false;
      }

      // For JWT tokens
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      const isExpired = decoded.exp && decoded.exp < now;

      // During refresh, be more lenient with slightly expired tokens
      if (isExpired && isRefreshScenario && hasActiveSession) {
        // Only allow a grace period of 5 seconds for expired tokens during reload
        const gracePeriod = 5; // seconds
        if (now - decoded.exp < gracePeriod) {
          return false;
        }
      }

      if (isExpired && !isRefreshScenario) {
        tokenService.removeToken();
      }

      return isExpired;
    } catch (error) {
      // During refresh, trust the session marker
      if (isRefreshScenario && hasActiveSession) {
        return false;
      }

      // If we have an active session marker outside of refresh, still trust it
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
