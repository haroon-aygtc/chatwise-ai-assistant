/**
 * Token service for handling authentication tokens
 * Simplified for Laravel Sanctum session-based authentication
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

    // Set page load time for token validation
    sessionStorage.setItem("page_load_time", Date.now().toString());
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

      // Check if we're in development mode
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      // Use a different endpoint based on environment
      const csrfEndpoint = isDevelopment
        ? `${window.location.protocol}//${window.location.hostname}:8000/sanctum/csrf-cookie`
        : `/sanctum/csrf-cookie`;

      try {
        const response = await fetch(csrfEndpoint, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Cache-Control": "no-cache, no-store",
          },
          // Add a timeout to prevent long-hanging requests
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) {
          console.warn(
            `CSRF token fetch failed: ${response.status} ${response.statusText}`,
          );
          // Create a fallback token for development purposes
          if (isDevelopment) {
            const meta = document.createElement("meta");
            meta.name = "csrf-token";
            meta.content = "development-csrf-token-fallback";
            document.head.appendChild(meta);
            console.info("Using fallback CSRF token for development");
          }
        }
      } catch (fetchError) {
        console.warn("Error fetching CSRF token:", fetchError);
        // Don't throw error, just log it and continue
        // This prevents authentication from breaking if CSRF endpoint is down
      }
    } catch (error) {
      console.error("CSRF initialization error:", error);
      // Don't throw the error to prevent breaking the app
    }
  },

  /**
   * Validate token with improved robustness and better page refresh handling
   */
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession =
      sessionStorage.getItem("has_active_session") === "true";

    // Set page load time if not already set
    if (!sessionStorage.getItem("page_load_time")) {
      sessionStorage.setItem("page_load_time", Date.now().toString());
    }

    // Improved page reload detection using modern and legacy methods
    let isPageReload = document.readyState !== "complete";

    // Modern method using Navigation API
    if (
      typeof performance !== "undefined" &&
      typeof performance.getEntriesByType === "function"
    ) {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        isPageReload = isPageReload || (navEntries[0] as any).type === "reload";
      }
    }

    // Check session storage for a page load marker
    const pageLoadTime = Number(
      sessionStorage.getItem("page_load_time") || "0",
    );
    const timeSinceLoad = Date.now() - pageLoadTime;

    // Consider it a page reload if we're within 5 seconds of page load time
    isPageReload = isPageReload || timeSinceLoad < 5000;

    // Define isRefreshScenario for use throughout the function
    const isRefreshScenario = isPageReload || timeSinceLoad < 5000;

    // Set a flag to prevent redirect during page reload
    if (isPageReload) {
      sessionStorage.setItem("prevent_auth_redirect", "true");
      // Clear this flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem("prevent_auth_redirect");
      }, 5000);
    }

    // No token means not authenticated, but preserve session during refresh
    if (!token) {
      // During page refresh with active session, don't immediately invalidate
      if (isRefreshScenario && hasActiveSession) {
        return true;
      }
      return false;
    }

    // Trust active session marker more during refresh
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
  },
};

export default tokenService;
