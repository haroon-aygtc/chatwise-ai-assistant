import { User } from "@/types/user";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  organization?: string;
  termsAccepted?: boolean;
}

export interface PasswordResetRequestData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface EmailVerificationData {
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted?: boolean;
  organization?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
