
import ApiService from "./base";

/**
 * Get the CSRF token from the meta tag
 */
export const getCSRFToken = (): string | null => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || null;
};

/**
 * Refresh the CSRF token by making a request to the server
 */
export const refreshCSRFToken = async (): Promise<string | null> => {
  try {
    await ApiService.get('/sanctum/csrf-cookie');
    return getCSRFToken();
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
    return null;
  }
};

/**
 * Test if CSRF protection is working correctly
 */
export const testCSRFProtection = async (): Promise<boolean> => {
  try {
    await ApiService.post('/csrf-test');
    return true;
  } catch (error) {
    console.error('CSRF test failed:', error);
    return false;
  }
};
