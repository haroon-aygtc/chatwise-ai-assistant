
import { apiRequest } from "./api/base";
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
  return apiRequest<LoginResponse>({
    method: "POST",
    url: "/auth/login",
    data: { email, password },
  });
};

export const signup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<SignupResponse> => {
  return apiRequest<SignupResponse>({
    method: "POST",
    url: "/auth/register",
    data: {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
  });
};

export const logout = async (): Promise<void> => {
  await apiRequest<void>({
    method: "POST",
    url: "/auth/logout",
  });
  
  // Clear token from localStorage
  localStorage.removeItem("token");
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>({
    method: "POST",
    url: "/auth/forgot-password",
    data: { email },
  });
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<ResetPasswordResponse> => {
  return apiRequest<ResetPasswordResponse>({
    method: "POST",
    url: "/auth/reset-password",
    data: {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    },
  });
};

export const checkAuth = async (): Promise<User> => {
  return apiRequest<User>({
    method: "GET",
    url: "/auth/me",
  });
};
