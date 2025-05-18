
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API_CONFIG from "../api/config";

const TOKEN_KEY = "authToken";

// Custom interface for our JWT payload
interface CustomJwtPayload {
  exp?: number;
  permissions?: string[];
  [key: string]: any;
}

// Add a mock token key for handling admin mocks
const MOCK_TOKEN_KEY = "mockAdminToken";

const tokenService = {
  /**
   * Set auth token in localStorage
   */
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);

    // If this is our mock admin token, flag it
    if (token === 'mock-admin-token') {
      localStorage.setItem(MOCK_TOKEN_KEY, 'true');
    }
  },

  /**
   * Get auth token from localStorage
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(MOCK_TOKEN_KEY);
  },

  /**
   * Clear token entirely
   */
  clearToken() {
    this.removeToken();
  },

  /**
   * Check if token exists
   */
  hasToken() {
    return !!this.getToken();
  },

  /**
   * Initialize CSRF token for Laravel APIs
   */
  async initCsrfToken() {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/csrf-cookie`, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Failed to initialize CSRF token', error);
      return null;
    }
  },

  /**
   * Check if token is valid (not expired)
   */
  validateToken() {
    const token = this.getToken();
    
    // If we have a mock admin token, always consider it valid
    if (token && localStorage.getItem(MOCK_TOKEN_KEY) === 'true') {
      return true;
    }
    
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token has expiration and is not expired
      return decoded.exp ? decoded.exp > currentTime : true;
    } catch (error) {
      console.error('Invalid token', error);
      return false;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    const token = this.getToken();
    
    // Mock admin token never expires
    if (token && localStorage.getItem(MOCK_TOKEN_KEY) === 'true') {
      return false;
    }
    
    if (!token) return true;
    
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      // If token has no expiration, it's not expired
      if (!decoded.exp) return false;
      
      // Check if current time is past expiration
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration', error);
      return true;
    }
  },

  /**
   * Decode token and return its payload
   */
  decodeToken(token: string): CustomJwtPayload | null {
    try {
      return jwtDecode<CustomJwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  },

  /**
   * Get permissions from token if available
   */
  getPermissionsFromToken() {
    const token = this.getToken();
    if (!token) return [];
    
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return decoded.permissions || [];
    } catch (error) {
      console.error('Error extracting permissions from token', error);
      return [];
    }
  }
};

export default tokenService;
