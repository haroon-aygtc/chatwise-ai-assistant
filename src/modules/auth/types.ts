
import { User } from '@/types/user';

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
