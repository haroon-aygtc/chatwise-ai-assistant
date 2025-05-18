/**
 * Token Service
 * 
 * Handles authentication tokens and CSRF protection for Laravel Sanctum.
 * This service is optimized for Laravel Sanctum's session-based authentication
 * for SPAs (Single Page Applications).
 */

const tokenService = {
  /**
   * Get token from localStorage - used for mobile API access only
   * For SPA authentication, Sanctum uses cookies instead
   */
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Set token in localStorage - used for mobile API access only
   * For SPA authentication, Sanctum uses cookies instead
   */
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  /**
   * Alias for removeToken for backward compatibility
   */
  clearToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  /**
   * Get CSRF token from meta tag
   */
  getCsrfToken: (): string | null => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  },

  /**
   * Get XSRF token from cookies
   */
  getXsrfToken: (): string | null => {
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    if (!xsrfCookie) return null;

    // URL decode the cookie value as Laravel URL-encodes it
    return decodeURIComponent(xsrfCookie.split('=')[1]);
  },

  /**
   * Initialize CSRF token by fetching from the server
   * This is required for Laravel Sanctum's SPA authentication
   */
  initCsrfToken: async (): Promise<void> => {
    try {
      // This endpoint is used in Laravel Sanctum to set the CSRF cookie
      await fetch('/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store'
        }
      });
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  },

  /**
   * Check if user is authenticated (has valid session)
   * For SPA authentication with Sanctum, we make a request to check auth status
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }
};

export default tokenService;
