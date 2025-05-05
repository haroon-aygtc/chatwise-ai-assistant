
/**
 * Custom API Error class
 */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  
  constructor(message: string, status: number = 400, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Network Error class for connectivity issues
 */
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends ApiError {
  constructor(message: string = 'Authentication failed', status: number = 401) {
    super(message, status);
    this.name = 'AuthError';
  }
}

/**
 * Authorization Error class
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'You do not have permission to perform this action', status: number = 403) {
    super(message, status);
    this.name = 'ForbiddenError';
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', errors?: Record<string, string[]>) {
    super(message, 422, errors);
    this.name = 'ValidationError';
  }
}
