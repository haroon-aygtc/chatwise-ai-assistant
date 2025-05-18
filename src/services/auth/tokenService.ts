import axios from 'axios';

/**
 * Token service for managing authentication tokens with Laravel Sanctum
 */
class TokenService {
  private tokenKey: string;
  private storageType: 'localStorage' | 'sessionStorage';
  private tokenExpiryKey: string;

  constructor() {
    this.tokenKey = 'token';
    this.tokenExpiryKey = 'token_expiry';
    this.storageType = 'localStorage';
  }

  /**
   * Set the authentication token
   * @param token Bearer token
   * @param remember Whether to store in localStorage (true) or sessionStorage (false)
   * @param expiresIn Expiration time in seconds (optional)
   */
  setToken(token: string, remember: boolean = false, expiresIn?: number): void {
    this.storageType = remember ? 'localStorage' : 'sessionStorage';
    window[this.storageType].setItem(this.tokenKey, token);

    // If expiration time is provided, store it
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000;
      window[this.storageType].setItem(this.tokenExpiryKey, expiryTime.toString());
    }
  }

  /**
   * Get the authentication token
   * @returns The token or null if not found
   */
  getToken(): string | null {
    // Try localStorage first
    let token = localStorage.getItem(this.tokenKey);

    // If not in localStorage, try sessionStorage
    if (!token) {
      token = sessionStorage.getItem(this.tokenKey);
      if (token) {
        this.storageType = 'sessionStorage';
      }
    } else {
      this.storageType = 'localStorage';
    }

    // If token exists but is expired, clear it and return null
    if (token && !this.validateToken()) {
      this.clearToken();
      return null;
    }

    return token;
  }

  /**
   * Clear the authentication token
   */
  clearToken(): void {
    // Clear from both storage types to be safe
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenExpiryKey);
  }

  /**
   * Validate if the token is valid and not expired
   * @returns True if valid, false otherwise
   */
  validateToken(): boolean {
    const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);

    if (!token) {
      return false;
    }

    // Check expiration if we have it stored
    const expiryStr = localStorage.getItem(this.tokenExpiryKey) || sessionStorage.getItem(this.tokenExpiryKey);

    if (expiryStr) {
      const expiryTime = parseInt(expiryStr, 10);
      return Date.now() < expiryTime;
    }

    // If no expiry time is stored, assume the token is valid
    // This is because Laravel Sanctum handles expiration on the server side
    return true;
  }

  /**
   * Get the token expiration time
   * @returns Expiration timestamp or null
   */
  getTokenExpiration(): number | null {
    const expiryStr = localStorage.getItem(this.tokenExpiryKey) || sessionStorage.getItem(this.tokenExpiryKey);

    if (expiryStr) {
      return parseInt(expiryStr, 10);
    }

    return null;
  }

  /**
   * Calculate time remaining until token expiration
   * @returns Seconds remaining or null if no expiration is set
   */
  getSecondsUntilExpiry(): number | null {
    const expiry = this.getTokenExpiration();

    if (!expiry) {
      return null;
    }

    const secondsRemaining = Math.floor((expiry - Date.now()) / 1000);
    return secondsRemaining > 0 ? secondsRemaining : 0;
  }

  /**
   * Refresh the authentication token
   * @returns Promise with new token
   */
  async refreshToken(): Promise<string | null> {
    try {
      // For Laravel Sanctum, we need to make a request to the refresh endpoint
      // The server will set a new cookie
      const response = await axios.post('/api/auth/refresh', {}, {
        withCredentials: true // Important for cookies
      });

      // If the API also returns a token in the response, store it
      if (response.data.token) {
        this.setToken(
          response.data.token,
          this.storageType === 'localStorage',
          response.data.expires_in
        );
        return response.data.token;
      }

      return 'refreshed'; // Return a non-null value to indicate success
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Initialize CSRF token for Laravel Sanctum
   * @returns Promise
   */
  async initCsrfToken(): Promise<void> {
    try {
      // Laravel Sanctum requires a call to /sanctum/csrf-cookie
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true // Important for cookies
      });
    } catch (error) {
      console.error('CSRF token initialization error:', error);
      throw error;
    }
  }
}

export default new TokenService();
