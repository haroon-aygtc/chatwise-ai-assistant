
export type ValidationError = string | null;

export interface ValidationResult {
  isValid: boolean;
  error: ValidationError;
}

export const validateRequired = (value: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: "This field is required" };
  }
  return { isValid: true, error: null };
};

export const validateEmail = (email: string): ValidationResult => {
  const required = validateRequired(email);
  if (!required.isValid) return required;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true, error: null };
};

export const validatePassword = (password: string): ValidationResult => {
  const required = validateRequired(password);
  if (!required.isValid) return required;

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strength < 3) {
    return { 
      isValid: false, 
      error: "Password must contain at least 3 of: uppercase letters, lowercase letters, numbers, and special characters" 
    };
  }

  return { isValid: true, error: null };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  const required = validateRequired(confirmPassword);
  if (!required.isValid) return required;

  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  return { isValid: true, error: null };
};

export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  const required = validateRequired(phoneNumber);
  if (!required.isValid) return required;

  // Remove non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if the phone number has a reasonable length (typically 8-15 digits including country code)
  if (digitsOnly.length < 8 || digitsOnly.length > 15) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  
  return { isValid: true, error: null };
};
