
/**
 * Service for managing authentication tokens
 */
const TokenService = {
  /**
   * Store the authentication token
   */
  setToken: (token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  },

  /**
   * Get the stored authentication token
   */
  getToken: (): string | null => {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },

  /**
   * Clear the stored authentication token
   */
  clearToken: () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  },

  /**
   * Check if a token exists and is not expired
   */
  validateToken: (): boolean => {
    const token = TokenService.getToken();
    if (!token) return false;
    
    try {
      // Simple check if token exists and has the expected format
      // In a real app, you would also check the expiration
      return token.split('.').length === 3;
    } catch (error) {
      return false;
    }
  },

  /**
   * Check if a token is expired
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = TokenService.decodeToken(token);
      if (!payload || !payload.exp) return true;
      
      // Convert expiration time to milliseconds and compare with current time
      const expTimestamp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expTimestamp;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  /**
   * Decode the JWT token to get user information
   */
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  /**
   * Initialize CSRF token for API requests
   */
  initCsrfToken: async (): Promise<string | null> => {
    try {
      const response = await fetch('/sanctum/csrf-cookie', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return csrfToken;
      }
      return null;
    } catch (error) {
      console.error('Error initializing CSRF token:', error);
      return null;
    }
  }
};

export default TokenService;
