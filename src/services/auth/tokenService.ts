
/**
 * Service for managing authentication tokens
 */

const TOKEN_KEY = "auth_token";
// Add a token expiration buffer (5 minutes) to refresh before actual expiration
const TOKEN_EXPIRY_BUFFER = 5 * 60; // 5 minutes in seconds

interface DecodedToken {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

class TokenService {
  private csrfToken: string | null = null;
  private storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage';

  /**
   * Store the authentication token
   * @param token The JWT token to store
   * @param rememberMe Optional flag to indicate if the token should be stored for longer
   */
  setToken(token: string, rememberMe: boolean = false): void {
    this.storageType = rememberMe ? 'localStorage' : 'sessionStorage';
    if (rememberMe) {
      // Store in localStorage for persistence across browser sessions
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(`${TOKEN_KEY}_created`, Date.now().toString());
      localStorage.setItem(`${TOKEN_KEY}_remember`, "true");
    } else {
      // Store in sessionStorage for session-only persistence
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(`${TOKEN_KEY}_created`, Date.now().toString());
      sessionStorage.setItem(`${TOKEN_KEY}_remember`, "false");
    }

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
    // Get token from the appropriate storage
    const storage = this.getTokenStorage();
    if (storage === 'localStorage') {
      return localStorage.getItem(TOKEN_KEY) || null;
    }
    return sessionStorage.getItem(TOKEN_KEY) || null;
  }

  /**
   * Clear the stored authentication token and related data
   */
  private getTokenStorage(): 'localStorage' | 'sessionStorage' {
    return this.storageType;
  }

  clearToken(): void {
    // Clear token storage based on where it was stored
    const storage = this.getTokenStorage();
    if (storage === 'localStorage') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(`${TOKEN_KEY}_created`);
      localStorage.removeItem(`${TOKEN_KEY}_remember`);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(`${TOKEN_KEY}_created`);
      sessionStorage.removeItem(`${TOKEN_KEY}_remember`);
    }
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
    if (!token) {
      return true;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return true;
      }

      // If token doesn't have an expiration claim
      if (!decoded.exp) {
        // Check if token was created more than 24 hours ago as a fallback
        const createdTime =
          localStorage.getItem(`${TOKEN_KEY}_created`) ||
          sessionStorage.getItem(`${TOKEN_KEY}_created`);

        if (createdTime) {
          const tokenAge = (Date.now() - parseInt(createdTime)) / 1000; // in seconds
          const maxAge = 24 * 60 * 60; // 24 hours in seconds
          return tokenAge > maxAge;
        } else {
          // If we can't determine when the token was created, consider it expired
          return true;
        }
      }

      // exp is in seconds, Date.now() is in milliseconds
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;

      // Check if token is expired or will expire soon (within buffer)
      return timeUntilExpiry <= bufferSeconds;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  /**
   * Validate the current token
   * @returns true if token exists and is not expired, false otherwise
   */
  validateToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    if (this.isTokenExpired()) {
      return false;
    }

    // Check if token is properly formatted
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
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
        return token;
      }

      // Get the API URL from config
      const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

      // For development environment with cross-domain API, use simulated token
      if (
        import.meta.env.DEV &&
        !apiBaseUrl.includes(window.location.hostname)
      ) {
        const simulatedToken = "dev-csrf-token-" + Date.now();
        this.setCsrfToken(simulatedToken);
        return simulatedToken;
      }

      // Make a request to get the CSRF cookie
      const csrfUrl = apiBaseUrl.endsWith("/api")
        ? `${apiBaseUrl.substring(
            0,
            apiBaseUrl.length - 4
          )}/sanctum/csrf-cookie`
        : `${apiBaseUrl}/sanctum/csrf-cookie`;

      const response = await fetch(csrfUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch CSRF token: ${response.status} ${response.statusText}`
        );
      }

      // Extract the CSRF token from cookies
      const xsrfCookie = this.getXsrfCookieFromDocument();

      if (xsrfCookie) {
        const token = decodeURIComponent(xsrfCookie.split("=")[1]);
        this.setCsrfToken(token);
        return token;
      } else if (import.meta.env.DEV) {
        // In development, provide a fallback token
        const fallbackToken = "fallback-csrf-token-" + Date.now();
        this.setCsrfToken(fallbackToken);
        return fallbackToken;
      }

      return null;
    } catch (error) {
      console.error("Failed to initialize CSRF token:", error);

      // In development, provide a fallback token
      if (import.meta.env.DEV) {
        const fallbackToken = "fallback-csrf-token-" + Date.now();
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
    return cookies.find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="));
  }
}

// Create and export a singleton instance
const tokenServiceInstance = new TokenService();
export default tokenServiceInstance;
