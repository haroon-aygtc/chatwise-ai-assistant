
/**
 * Custom API error class for handling error responses from the API
 */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  
  constructor(message: string, status = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Create an API error from an HTTP response
 */
export const createApiError = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    
    // Handle standard Laravel error format
    if (data && data.message) {
      return new ApiError(
        data.message,
        response.status,
        data.errors || undefined
      );
    }
    
    // Fallback
    return new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  } catch (e) {
    // If we can't parse the JSON response
    return new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }
};

/**
 * Network error
 */
export class NetworkError extends Error {
  constructor(message = 'Network error occurred. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication error
 */
export class AuthError extends ApiError {
  constructor(message = 'Authentication failed', status = 401) {
    super(message, status);
    this.name = 'AuthError';
  }
}

/**
 * Permission error
 */
export class PermissionError extends ApiError {
  constructor(message = 'You do not have permission to perform this action', status = 403) {
    super(message, status);
    this.name = 'PermissionError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', status = 422, errors?: Record<string, string[]>) {
    super(message, status, errors);
    this.name = 'ValidationError';
  }
}
