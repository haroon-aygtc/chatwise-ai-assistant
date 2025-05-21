/**
 * API Error Handling
 *
 * Custom error classes and utilities for handling API errors
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  /**
   * Check if the error is a specific HTTP status code
   */
  is(status: number): boolean {
    return this.status === status;
  }

  /**
   * Check if the error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if the error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if the error is an authentication error (401)
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if the error is a permission error (403)
   */
  isPermissionError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if the error is a validation error (422)
   */
  isValidationError(): boolean {
    return this.status === 422;
  }

  /**
   * Get validation errors if available
   */
  getValidationErrors(): Record<string, string[]> | null {
    if (this.isValidationError() && this.data?.errors) {
      return this.data.errors;
    }
    return null;
  }
}

/**
 * Format validation errors into a readable string
 */
export function formatValidationErrors(
  errors: Record<string, string[]>,
): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("\n");
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isValidationError() && error.data?.errors) {
      return formatValidationErrors(error.data.errors);
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
