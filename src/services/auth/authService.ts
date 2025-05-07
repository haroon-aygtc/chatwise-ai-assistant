import apiService from '../api/api';
import { AUTH_ENDPOINTS } from '../api/config';

export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
  // add more fields as necessary
}

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

// Authenticated login
export const login = async (
  email: string,
  password: string
): Promise<User & { token: string }> => {
  try {
    console.log('Starting login process for email:', email);

    // The CSRF token is now fetched in the form component before calling this function
    // This ensures a fresh token is available for the request

    // Make the POST request
    const response = await apiService.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, { email, password });
    console.log('Login successful, response:', response);

    // The backend returns { message, user, token }
    // We need to merge the user object with the token
    const { user, token } = response;

    // Store token in localStorage for future requests
    localStorage.setItem('auth_token', token);

    return { ...user, token };
  } catch (error) {
    console.error('Login error:', error);

    // Log more details about the error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('Login error details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data
      });
    }

    throw error;
  }
};

// Authenticated logout
export const logout = async (): Promise<void> => {
  await apiService.post(AUTH_ENDPOINTS.LOGOUT);

  // Clear token from localStorage
  localStorage.removeItem('auth_token');
};

// Fetch current user info
export const getUser = async (): Promise<User> => {
  return await apiService.get<User>(AUTH_ENDPOINTS.CURRENT_USER);
};

// Alias getUser as getCurrentUser for compatibility with useAuth.tsx
export const getCurrentUser = getUser;

// Register a new user
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<User> => {
  try {
    console.log('Starting registration process with data:', {
      ...userData,
      password: '[REDACTED]',
      password_confirmation: '[REDACTED]'
    });

    // The CSRF token is now fetched in the form component before calling this function
    // This ensures a fresh token is available for the request

    // Make the POST request
    const response = await apiService.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);
    console.log('Registration successful, response:', response);

    // If registration returns a token, store it
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      return { ...response.user, token: response.token };
    }

    return response.user;
  } catch (error) {
    console.error('Registration error:', error);

    // Log more details about the error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('Registration error details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data
      });
    }

    throw error;
  }
};

// Alias register as signup for compatibility with useAuth.tsx
export const signup = register;
