
/**
 * Utility functions for authentication
 */

/**
 * Handle authentication errors
 * @param error The error object
 */
export const handleAuthError = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.error("Authentication failed: Unauthorized access");
        break;
      case 403:
        console.error("Authentication failed: Forbidden access");
        break;
      case 422:
        console.error("Validation error", error.response.data);
        break;
      default:
        console.error("Authentication error:", error);
    }
  } else {
    console.error("Authentication error:", error);
  }
};
