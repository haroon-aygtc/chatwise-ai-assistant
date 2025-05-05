
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
  return ApiService.post<LoginResponse>(
    "/auth/login",
    { email, password }
  );
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<SignupResponse> => {
  return ApiService.post<SignupResponse>(
    "/auth/register",
    {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }
  );
};

export const logout = async (): Promise<void> => {
  await ApiService.post<void>(
    "/auth/logout",
    {}
  );
  
  // Clear token from localStorage
  localStorage.removeItem("token");
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  return ApiService.post<{ message: string }>(
    "/auth/forgot-password",
    { email }
  );
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<ResetPasswordResponse> => {
  return ApiService.post<ResetPasswordResponse>(
    "/auth/reset-password",
    {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }
  );
};

export const checkAuth = async (): Promise<User> => {
  return ApiService.get<User>("/auth/me");
};
