
// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Auth API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  CURRENT_USER: '/user',
  CHECK_AUTH: '/check-auth',
  RESET_PASSWORD_REQUEST: '/password/reset-request',
  RESET_PASSWORD: '/password/reset',
  VERIFY_EMAIL: '/verify-email',
};

// User API endpoints
export const USER_ENDPOINTS = {
  USERS: '/users',
  USER_ROLES: (userId: string) => `/users/${userId}/roles`,
  USER_STATUS: (userId: string) => `/users/${userId}/status`,
  USER_PERMISSIONS: (userId: string) => `/users/${userId}/permissions`,
  ASSIGN_ROLES: (userId: string) => `/users/${userId}/assign-roles`,
};

// Permission API endpoints
export const PERMISSION_ENDPOINTS = {
  PERMISSIONS: '/permissions',
  PERMISSION_CATEGORIES: '/permissions/categories',
};
