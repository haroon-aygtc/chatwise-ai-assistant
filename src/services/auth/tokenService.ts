/**
 * Service for managing authentication and CSRF tokens
 */

import axios from 'axios';

const TOKEN_KEY = "auth_token";
// Add a token expiration buffer (5 minutes) to refresh before actual expiration
const TOKEN_EXPIRY_BUFFER = 5 * 60; // 5 minutes in seconds

interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

class TokenService {
  private csrfToken: string | null = null;
  private storageType: 'localStorage' | 'sessionStorage' = 'localStorage'; // Using localStorage for persistence across page refreshes

  /**
   * Store the authentication token
   * @param token The JWT token to store
   * @param rememberMe Optional flag to indicate if the token should be stored for longer
   */
  setToken(token: string, rememberMe: boolean = false): void {
    this.storageType = rememberMe ? 'localStorage' : 'sessionStorage';
    const storage = this.getTokenStorage();
    storage.setItem(TOKEN_KEY, token);

    // Log token expiration if available
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      console.debug(`Token will expire at: ${expiryDate.toLocaleString()}`);
    }
  }

  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    return this.getTokenStorage().getItem(TOKEN_KEY);
  }

  /**
   * Clear the stored authentication token
   */
  clearToken(): void {
    this.getTokenStorage().removeItem(TOKEN_KEY);
  }

  /**
   * Get the appropriate storage based on remember me setting
   */
  private getTokenStorage(): Storage {
    return this.storageType === 'localStorage' ? localStorage : sessionStorage;
  }

  /**
   * Decode a JWT token without verification
   * @param token The JWT token to decode
   * @returns The decoded token payload or null if invalid
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      // JWT tokens are in format: header.payload.signature
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      // Decode the payload (middle part)
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  /**
   * Check if the token is expired
   * @param bufferSeconds Optional seconds to subtract from expiration time (default: TOKEN_EXPIRY_BUFFER)
   * @returns true if token is expired or will expire soon, false otherwise
   */
  isTokenExpired(bufferSeconds: number = TOKEN_EXPIRY_BUFFER): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    // If no expiration in token, consider it not expired
    if (!decoded.exp) return false;

    // Check if token has expired with buffer time
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - bufferSeconds <= currentTime;
  }

  /**
   * Validate the current token
   * @returns true if token exists and is not expired, false otherwise
   */
  validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  }

  /**
   * Get the CSRF token
   */
  getCsrfToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Set the CSRF token
   */
  setCsrfToken(token: string): void {
    this.csrfToken = token;
    // Also set in axios defaults
    axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
  }

  /**
   * Initialize CSRF token by making a request to the sanctum/csrf-cookie endpoint
   * This is required for Laravel Sanctum CSRF protection
   */
  async initCsrfToken(): Promise<string | null> {
    try {
      // Check if we already have a CSRF token
      if (this.csrfToken) {
        return this.csrfToken;
      }

      // Check if there's already an XSRF-TOKEN cookie
      const existingCookie = this.getXsrfCookieFromDocument();
      if (existingCookie) {
        const token = decodeURIComponent(existingCookie.split("=")[1]);
        this.setCsrfToken(token);
        console.log('Using existing CSRF token from cookie:', token);
        return token;
      }

      // Get the API URL from config
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

      console.log('Fetching CSRF token from:', `${baseUrl}/sanctum/csrf-cookie`);
      console.log('Current cookies:', document.cookie);

      // Make a request to get the CSRF cookie
      const response = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "Cache-Control": "no-cache, no-store",
          "Content-Type": "application/json",
        },
      });

      console.log('CSRF Response status:', response.status);
      console.log('CSRF Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Extract the CSRF token from cookies
      const xsrfCookie = this.getXsrfCookieFromDocument();
      if (xsrfCookie) {
        const token = decodeURIComponent(xsrfCookie.split("=")[1]);
        this.setCsrfToken(token);
        console.log('CSRF token refreshed successfully:', token);
        return token;
      }

      console.error('No XSRF cookie found after fetch');
      if (import.meta.env.DEV) {
        // In development, provide a fallback token
        const fallbackToken = "fallback-csrf-token-" + Date.now();
        this.setCsrfToken(fallbackToken);
        console.log('Using fallback CSRF token for development:', fallbackToken);
        return fallbackToken;
      }

      return null;
    } catch (error) {
      console.error("Failed to initialize CSRF token:", error);

      if (import.meta.env.DEV) {
        // In development, provide a fallback token on error
        const fallbackToken = "error-fallback-csrf-token-" + Date.now();
        this.setCsrfToken(fallbackToken);
        return fallbackToken;
      }

      return null;
    }
  }

  /**
   * Helper method to get XSRF cookie from document
   */
  private getXsrfCookieFromDocument(): string | undefined {
    const cookies = document.cookie.split(";");
    const xsrfCookie = cookies.find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));
    if (xsrfCookie) {
      console.log('Found XSRF cookie:', xsrfCookie);
    } else {
      console.log('No XSRF cookie found in document.cookie');
      console.log('All cookies:', document.cookie);
    }
    return xsrfCookie;
  }
}

// Create and export a singleton instance
const tokenService = new TokenService();
export default tokenService;
