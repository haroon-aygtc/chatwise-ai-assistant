
import { tokenService } from './tokenService';

/**
 * Service for managing user session
 */
class SessionService {
  private refreshCallbacks: (() => Promise<void>)[] = [];
  private sessionCheckInterval: number | null = null;
  private expirationWarningThreshold = 5 * 60; // 5 minutes in seconds

  /**
   * Register a callback to be called when session needs refreshing
   * @param callback Function to call when session needs refreshing
   */
  registerRefreshCallback(callback: () => Promise<void>): void {
    this.refreshCallbacks.push(callback);
  }

  /**
   * Start monitoring the session for expiration
   * @param intervalSeconds How often to check session status (in seconds)
   */
  startSessionMonitor(intervalSeconds: number = 60): void {
    if (this.sessionCheckInterval) {
      this.stopSessionMonitor();
    }

    this.sessionCheckInterval = window.setInterval(() => {
      this.checkSession();
    }, intervalSeconds * 1000);

    // Initial check
    this.checkSession();
  }

  /**
   * Stop monitoring the session
   */
  stopSessionMonitor(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }

  /**
   * Check the current session status
   * @returns Information about session status
   */
  checkSession(): { isValid: boolean; timeRemaining: number | null; isExpiringSoon: boolean } {
    const token = tokenService.getToken();
    if (!token) {
      return { isValid: false, timeRemaining: null, isExpiringSoon: false };
    }

    // Decode token to get expiration
    const decoded = tokenService.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return { isValid: true, timeRemaining: null, isExpiringSoon: false };
    }

    // Calculate time remaining
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - currentTime;
    const isExpiringSoon = timeRemaining > 0 && timeRemaining <= this.expirationWarningThreshold;

    return {
      isValid: timeRemaining > 0,
      timeRemaining,
      isExpiringSoon
    };
  }

  /**
   * Attempt to refresh the session
   * @returns Whether the refresh was successful
   */
  async refreshSession(): Promise<boolean> {
    try {
      // Call all registered refresh callbacks
      await Promise.all(this.refreshCallbacks.map(callback => callback()));
      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  }

  /**
   * Set the threshold for showing expiration warnings
   * @param minutes Minutes before expiration to show warning
   */
  setExpirationWarningThreshold(minutes: number): void {
    this.expirationWarningThreshold = minutes * 60;
  }
}

export const sessionService = new SessionService();
