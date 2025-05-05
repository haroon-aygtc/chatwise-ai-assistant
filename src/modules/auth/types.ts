
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar_url?: string;
  last_active?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface RegisterResponse {
  user: UserResponse;
  token: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  isPhoneValid: boolean;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}
