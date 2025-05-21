/**
 * Token service for Laravel Sanctum cookie-based authentication
 * Only handles CSRF token management and session tracking
 */
import API_CONFIG from "../api/config";

// Debug flag
const DEBUG = process.env.NODE_ENV === "development";

// Get the backend URL without the /api or /api/ suffix
const getBackendUrl = (): string => {
  const apiUrl = API_CONFIG.BASE_URL;
  return apiUrl.replace(/\/api\/?$/, '');
};

const tokenService = {
  /**
   * Get CSRF token from meta tag or cookie
   */
  getCsrfToken: (): string | null => {
    // First try to get from meta tag
    const metaToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    if (metaToken) {
      if (DEBUG) console.log("Found CSRF token in meta tag");
      return metaToken;
    }

    // If no meta tag, try to get from cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const match = cookie.trim().match(/^XSRF-TOKEN=(.*)$/i);
      if (match) {
        const token = decodeURIComponent(match[1]);
        if (DEBUG) console.log("Found CSRF token in cookie");
        return token;
      }
    }

    if (DEBUG) console.log("No CSRF token found");
    return null;
  },

  /**
   * Initialize CSRF token by fetching from the server
   * @param force Force fetching a new token even if one exists
   */
  initCsrfToken: async (force: boolean = false): Promise<string | null> => {
    try {
      const existingToken = tokenService.getCsrfToken();

      if (existingToken && !force) {
        if (DEBUG) console.log("Using existing CSRF token");
        return existingToken;
      }

      if (DEBUG) console.log("Fetching new CSRF token");

      const backendUrl = getBackendUrl();
      const url = `${backendUrl}/sanctum/csrf-cookie`;

      if (DEBUG) console.log(`CSRF token URL: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store",
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch CSRF token: ${response.status} ${response.statusText}`);
        return null;
      }

      if (DEBUG) console.log("CSRF token fetch response:", response.status);

      // Wait a moment for the cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the token from the cookie
      const newToken = tokenService.getCsrfToken();

      if (newToken) {
        if (DEBUG) console.log("New CSRF token obtained");
        return newToken;
      } else {
        console.warn("CSRF token not found after fetch");
        return null;
      }
    } catch (error) {
      console.warn("Error fetching CSRF token:", error);
      return null;
    }
  },

  /**
   * Mark session as active
   */
  setActiveSession: (): void => {
    const timestamp = Date.now().toString();
    localStorage.setItem("has_active_session", "true");
    sessionStorage.setItem("has_active_session", "true");
    localStorage.setItem("session_last_active", timestamp);

    if (DEBUG) console.log("Session marked as active");
  },

  /**
   * Clear session
   */
  clearSession: (): void => {
    localStorage.removeItem("has_active_session");
    sessionStorage.removeItem("has_active_session");
    localStorage.removeItem("session_last_active");

    if (DEBUG) console.log("Session cleared");
  },

  /**
   * Check if session is active
   */
  hasActiveSession: (): boolean => {
    const hasSession =
      localStorage.getItem("has_active_session") === "true" ||
      sessionStorage.getItem("has_active_session") === "true";

    if (DEBUG && hasSession) console.log("Active session found");
    return hasSession;
  },

  /**
   * Check if session is stale (based on last activity timestamp)
   * @param maxAgeMs Max age in milliseconds (default: 30 minutes)
   */
  isSessionStale: (maxAgeMs = 30 * 60 * 1000): boolean => {
    const lastActive = parseInt(localStorage.getItem("session_last_active") || "0", 10);
    return isNaN(lastActive) || Date.now() - lastActive > maxAgeMs;
  }
};

export default tokenService;

