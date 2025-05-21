/**
 * Auth Types
 *
 * Type definitions for authentication-related data structures
 */

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted?: boolean;
  organization?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * User session data
 */
export interface UserSession {
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}
