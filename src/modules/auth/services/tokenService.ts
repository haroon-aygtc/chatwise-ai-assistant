
/**
 * Token Service - Handles storage and retrieval of auth tokens
 */
class TokenService {
  private tokenKey = 'auth_token';

  /**
   * Set the authentication token
   * @param token The token to store
   * @param remember Whether to use localStorage (true) or sessionStorage (false)
   */
  setToken(token: string, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.tokenKey, token);
  }

  /**
   * Get the stored authentication token
   * @returns The stored token or null if none exists
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Check if a token exists and is valid
   * @returns Whether the token is valid
   */
  validateToken(): boolean {
    // Simple validation - check if token exists
    // A more robust implementation would also check expiration
    return !!this.getToken();
  }

  /**
   * Clear the stored authentication token
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }
}

export const tokenService = new TokenService();
