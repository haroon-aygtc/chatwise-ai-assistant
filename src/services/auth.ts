
import ApiService from './api/base';
import { User } from "@/types/user";

interface LoginResponse {
  token: string;
  user: User;
}

interface SignupResponse {
  token: string;
  user: User;
}

interface ResetPasswordResponse {
  message: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return ApiService.post<LoginResponse>({
    url: "/auth/login",
    data: { email, password },
    withAuth: false
  });
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<SignupResponse> => {
  return ApiService.post<SignupResponse>({
    url: "/auth/register",
    data: {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
    withAuth: false
  });
};

export const logout = async (): Promise<void> => {
  await ApiService.post<void>({
    url: "/auth/logout",
    withAuth: true
  });
  
  // Clear token from localStorage
  localStorage.removeItem("token");
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  return ApiService.post<{ message: string }>({
    url: "/auth/forgot-password",
    data: { email },
    withAuth: false
  });
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<ResetPasswordResponse> => {
  return ApiService.post<ResetPasswordResponse>({
    url: "/auth/reset-password",
    data: {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
    withAuth: false
  });
};

export const checkAuth = async (): Promise<User> => {
  return ApiService.get<User>({
    url: "/auth/me",
    withAuth: true
  });
};
