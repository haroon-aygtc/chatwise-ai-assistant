
/**
 * Result of a validation check
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
  error?: string;
}

/**
 * Validate an email address
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      message: "Email is required",
      error: "Email is required"
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
      error: "Invalid email format"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validate a password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
      error: "Password is required"
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters",
      error: "Password too short"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmation: string): ValidationResult => {
  if (!confirmation) {
    return {
      isValid: false,
      message: "Please confirm your password",
      error: "Confirmation required"
    };
  }

  if (password !== confirmation) {
    return {
      isValid: false,
      message: "Passwords do not match",
      error: "Passwords don't match"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validate a name
 */
export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return {
      isValid: false,
      message: "Name is required",
      error: "Name is required"
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters",
      error: "Name too short"
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validate a URL
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return {
      isValid: true, // URLs can be optional
      message: ""
    };
  }

  try {
    new URL(url);
    return {
      isValid: true,
      message: ""
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Please enter a valid URL",
      error: "Invalid URL format"
    };
  }
};
