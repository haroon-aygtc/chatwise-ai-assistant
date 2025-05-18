/**
 * Utility functions for authentication
 */

/**
 * Custom type guard for error with response
 */
interface ErrorWithResponse {
  response: {
    status: number;
    data?: unknown;
  };
}

/**
 * Handle authentication errors
 * @param error The error object
 */
export const handleAuthError = (error: unknown) => {
  if (isErrorWithResponse(error)) {
    const response = error.response;
    switch (response.status) {
      case 401:
        console.error("Authentication failed: Unauthorized access");
        break;
      case 403:
        console.error("Authentication failed: Forbidden access");
        break;
      case 422:
        console.error("Validation error", response.data);
        break;
      default:
        console.error("Authentication error:", error);
    }
  } else {
    console.error("Authentication error:", error);
  }
};

function isErrorWithResponse(error: unknown): error is ErrorWithResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: unknown }).response !== null &&
    typeof (error as { response: { status?: unknown } }).response.status === "number"
  );
}
