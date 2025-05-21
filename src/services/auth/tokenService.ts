/**
 * Token service for handling authentication tokens
 * Simplified for Laravel Sanctum session-based authentication
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
      return;
    }

    localStorage.setItem("auth_token", token);
    sessionStorage.setItem("has_active_session", "true");
  },

  /**
   * Remove token from storage
   */
  removeToken: (): void => {
    localStorage.removeItem("auth_token");
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

      await fetch(`/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store",
        },
      });
    } catch (error) {
      console.warn("Error fetching CSRF token:", error);
      // Don't throw error, just log it and continue
    }
  },

  /**
   * Validate token (simplified)
   */
  validateToken: (): boolean => {
    const token = localStorage.getItem("auth_token");
    const hasActiveSession =
      sessionStorage.getItem("has_active_session") === "true";

    // Simple check - if we have a token and session marker, consider it valid
    return !!token && hasActiveSession;
  },
};

export default tokenService;
