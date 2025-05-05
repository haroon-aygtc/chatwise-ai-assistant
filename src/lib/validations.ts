
// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  message: string;
  error?: string; // Added error property
}

/**
 * Validates that a value is not empty
 */
export const validateRequired = (value: any): ValidationResult => {
  const isValid = value !== undefined && value !== null && value !== '';
  return {
    isValid,
    message: isValid ? '' : 'This field is required'
  };
};

/**
 * Validates that a value is a valid email
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  };
};

/**
 * Validates that a password meets minimum requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  const isValid = password.length >= 8;
  return {
    isValid,
    message: isValid ? '' : 'Password must be at least 8 characters long'
  };
};

/**
 * Validates that passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  const isValid = password === confirmPassword;
  return {
    isValid,
    message: isValid ? '' : 'Passwords do not match'
  };
};

/**
 * Validates a phone number
 */
export const validatePhoneNumber = (phone: string, isValid: boolean): ValidationResult => {
  return {
    isValid: isValid && phone.length > 0,
    message: (isValid && phone.length > 0) ? '' : 'Please enter a valid phone number'
  };
};
