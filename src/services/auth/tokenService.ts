
import { jwtDecode } from "jwt-decode";

const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  // Alias for removeToken for backward compatibility
  clearToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  getCsrfToken: (): string | null => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  },

  // Initialize CSRF token by fetching from the server
  initCsrfToken: async (): Promise<void> => {
    try {
      // This endpoint is typically used in Laravel Sanctum to set the CSRF cookie
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

  // Decode JWT token
  decodeToken: (token: string): any => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  },

  // Check if token is valid
  validateToken: (): boolean => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      // Check if token is expired
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp ? decoded.exp < Date.now() / 1000 : true;
    } catch (error) {
      return true;
    }
  }
};

export default tokenService;
