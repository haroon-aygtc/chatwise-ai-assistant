
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

/**
 * Run diagnostics on CSRF protection
 */
export const runCsrfDiagnostics = async (): Promise<{
  initialToken: string | null;
  refreshedToken: string | null;
  testResult: boolean;
}> => {
  const initialToken = getCSRFToken();
  const refreshedToken = await refreshCSRFToken();
  const testResult = await testCSRFProtection();
  
  return {
    initialToken,
    refreshedToken,
    testResult
  };
};

/**
 * Test the CSRF endpoint directly
 */
export const testCsrfEndpoint = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await ApiService.post<{ success: boolean; message: string }>('/csrf-test');
    return response;
  } catch (error) {
    console.error('CSRF endpoint test failed:', error);
    return { success: false, message: 'Request failed' };
  }
};
