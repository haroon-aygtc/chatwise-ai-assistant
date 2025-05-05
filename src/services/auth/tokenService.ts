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

  /**
   * Store the authentication token
   * @param token The JWT token to store
   * @param rememberMe Optional flag to indicate if the token should be stored for longer
   */
  setToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      // Store in localStorage for persistence across browser sessions
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(`${TOKEN_KEY}_created`, Date.now().toString());
      localStorage.setItem(`${TOKEN_KEY}_remember`, "true");

      // Clear any sessionStorage tokens to avoid confusion
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(`${TOKEN_KEY}_created`);
      sessionStorage.removeItem(`${TOKEN_KEY}_remember`);

      // Token stored in localStorage with remember me
    } else {
      // Store in sessionStorage for session-only persistence
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(`${TOKEN_KEY}_created`, Date.now().toString());
      sessionStorage.setItem(`${TOKEN_KEY}_remember`, "false");

      // Clear any localStorage tokens to avoid confusion
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(`${TOKEN_KEY}_created`);
      localStorage.removeItem(`${TOKEN_KEY}_remember`);

      // Token stored in sessionStorage
    }

    // Log token expiration if available
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      // Token expiry date set
    }
  }

  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    // Check localStorage first (for remembered sessions)
    let token = localStorage.getItem(TOKEN_KEY);
    let sessionToken = sessionStorage.getItem(TOKEN_KEY);

    // If we have both tokens (which shouldn't happen but just in case),
    // use the one that was created most recently
    if (token && sessionToken) {
      const localCreated = localStorage.getItem(`${TOKEN_KEY}_created`);
      const sessionCreated = sessionStorage.getItem(`${TOKEN_KEY}_created`);

      if (localCreated && sessionCreated) {
        // Use the most recently created token
        return parseInt(localCreated) > parseInt(sessionCreated)
          ? token
          : sessionToken;
      }
    }

    // If only one exists, return it
    return token || sessionToken || null;
  }

  /**
   * Clear the stored authentication token and related data
   */
  clearToken(): void {
    // Clear from both storage types to ensure complete logout
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_created`);
    localStorage.removeItem(`${TOKEN_KEY}_remember`);

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(`${TOKEN_KEY}_created`);
    sessionStorage.removeItem(`${TOKEN_KEY}_remember`);

    // Token cleared from storage
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
      // No token found when checking expiration
      return true;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        // Don't log warning repeatedly to avoid console spam
        // Only log once per session
        if (!sessionStorage.getItem("token_decode_warning")) {
          // Could not decode token when checking expiration
          sessionStorage.setItem("token_decode_warning", "true");
        }
        return true;
      }

      // If token doesn't have an expiration claim
      if (!decoded.exp) {
        // Don't log warning repeatedly
        if (!sessionStorage.getItem("token_no_exp_warning")) {
          // Token has no expiration claim
          sessionStorage.setItem("token_no_exp_warning", "true");
        }

        // Check if token was created more than 24 hours ago as a fallback
        const createdTime =
          localStorage.getItem(`${TOKEN_KEY}_created`) ||
          sessionStorage.getItem(`${TOKEN_KEY}_created`);

        if (createdTime) {
          const tokenAge = (Date.now() - parseInt(createdTime)) / 1000; // in seconds
          const maxAge = 24 * 60 * 60; // 24 hours in seconds

          if (tokenAge > maxAge) {
            // Don't log warning repeatedly
            if (!sessionStorage.getItem("token_age_warning")) {
              // Token is older than 24 hours
              sessionStorage.setItem("token_age_warning", "true");
            }
            return true;
          }
        } else {
          // If we can't determine when the token was created, consider it expired
          // Don't log warning repeatedly
          if (!sessionStorage.getItem("token_no_creation_warning")) {
            // Token has no expiration and no creation time
            sessionStorage.setItem("token_no_creation_warning", "true");
          }
          return true;
        }

        return false;
      }

      // exp is in seconds, Date.now() is in milliseconds
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;

      // Check if token is expired or will expire soon (within buffer)
      const isExpiring = timeUntilExpiry <= bufferSeconds;

      // Only log warnings once per minute to avoid console spam
      const lastWarningTime = parseInt(
        sessionStorage.getItem("last_token_warning_time") || "0",
      );
      const currentTimeMs = Date.now();
      const shouldLog = currentTimeMs - lastWarningTime > 60000; // 1 minute

      if (isExpiring && shouldLog) {
        if (timeUntilExpiry <= 0) {
          // Token is expired
        } else {
          // Token will expire soon
        }
        sessionStorage.setItem(
          "last_token_warning_time",
          currentTimeMs.toString(),
        );
      }

      return isExpiring;
    } catch (error) {
      // Don't log error repeatedly
      if (!sessionStorage.getItem("token_expiry_error")) {
        // Error checking token expiration
        sessionStorage.setItem("token_expiry_error", "true");
      }
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
      // Token validation failed: token is expired
      return false;
    }

    // Check if token is properly formatted
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        // Token validation failed: could not decode token
        return false;
      }

      // Additional validation could be added here

      return true;
    } catch (error) {
      // Token validation error
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
        // Using existing CSRF token
        return this.csrfToken;
      }

      // Initializing CSRF token

      // Check if there's already an XSRF-TOKEN cookie
      const existingCookie = this.getXsrfCookieFromDocument();
      if (existingCookie) {
        // Found existing XSRF-TOKEN cookie
        const token = decodeURIComponent(existingCookie.split("=")[1]);
        this.setCsrfToken(token);
        return token;
      }

      // Get the API URL from config
      const apiBaseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Using API base URL

      // For development environment, we might need to handle CSRF differently
      // If we're in a development environment and the API is on a different domain,
      // we'll use a simulated CSRF token for local development
      if (
        import.meta.env.DEV &&
        !apiBaseUrl.includes(window.location.hostname)
      ) {
        // Development environment detected with cross-domain API
        const simulatedToken = "dev-csrf-token-" + Date.now();
        this.setCsrfToken(simulatedToken);
        return simulatedToken;
      }

      // Make a request to get the CSRF cookie with better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        // Make a request to get the CSRF cookie
        const csrfUrl = apiBaseUrl.endsWith("/api")
          ? `${apiBaseUrl.substring(0, apiBaseUrl.length - 4)}/sanctum/csrf-cookie`
          : `${apiBaseUrl}/sanctum/csrf-cookie`;

        // Fetching CSRF token

        const response = await fetch(csrfUrl, {
          method: "GET",
          credentials: "include", // Important: include cookies
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
          mode: "cors", // Explicitly set CORS mode
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // CSRF token fetch failed
          // Try to get response body for more details
          try {
            const errorBody = await response.text();
            console.error("Error response body:", errorBody);
          } catch (e) {
            // Could not read error response body
          }
          throw new Error(
            `Failed to fetch CSRF token: ${response.status} ${response.statusText}`,
          );
        }

        // CSRF cookie response received

        // Extract the CSRF token from cookies
        const xsrfCookie = this.getXsrfCookieFromDocument();
        const laravelSessionCookie = document.cookie
          .split(";")
          .find((cookie) => cookie.trim().startsWith("laravel_session="));

        // XSRF cookie and Laravel session cookie check

        if (xsrfCookie) {
          // The cookie value is URL encoded, so we need to decode it
          const token = decodeURIComponent(xsrfCookie.split("=")[1]);
          this.setCsrfToken(token);
          // CSRF token set successfully
          return token;
        } else {
          // No XSRF-TOKEN cookie found after request

          // If we're in development and no XSRF token was found, but the request was successful,
          // we'll create a simulated token to allow development to continue
          if (import.meta.env.DEV) {
            // Development environment: Creating simulated CSRF token
            const simulatedToken = "dev-csrf-token-" + Date.now();
            this.setCsrfToken(simulatedToken);
            return simulatedToken;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          // CSRF token request timed out
          throw new Error("CSRF token request timed out");
        }
        throw fetchError;
      }

      return null;
    } catch (error) {
      // Failed to initialize CSRF token

      // In development, provide a fallback token to allow work to continue
      if (import.meta.env.DEV) {
        // Development environment: Using fallback CSRF token
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

export const tokenService = new TokenService();
