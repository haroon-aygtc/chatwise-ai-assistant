/**
 * API Registry - Centralized management of API endpoints
 */

import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface EndpointDefinition {
  path: string;
  method: HttpMethod;
  requiresAuth: boolean;
  description?: string;
  cacheable?: boolean;
  cacheTime?: number; // in milliseconds
}

type ApiEndpoints = Record<string, EndpointDefinition>;

interface ApiRegistry {
  auth: ApiEndpoints;
  users: ApiEndpoints;
  roles: ApiEndpoints;
  permissions: ApiEndpoints;
  activityLogs: ApiEndpoints;
  [key: string]: ApiEndpoints;
}

/**
 * Central registry of all API endpoints
 * This makes it easier to maintain and update API endpoints in one place
 */
export const apiRegistry: ApiRegistry = {
  auth: {
    login: {
      path: "/login",
      method: "POST",
      requiresAuth: false,
      description: "Authenticate user and get token",
    },
    register: {
      path: "/register",
      method: "POST",
      requiresAuth: false,
      description: "Register a new user",
    },
    logout: {
      path: "/logout",
      method: "POST",
      requiresAuth: true,
      description: "Logout the current user",
    },
    currentUser: {
      path: "/user",
      method: "GET",
      requiresAuth: true,
      description: "Get the current authenticated user",
      cacheable: true,
      cacheTime: 60000, // 1 minute
    },
    forgotPassword: {
      path: "/password/email",
      method: "POST",
      requiresAuth: false,
      description: "Send password reset link",
    },
    resetPassword: {
      path: "/password/reset",
      method: "POST",
      requiresAuth: false,
      description: "Reset password with token",
    },
  },
  users: {
    list: {
      path: "/users",
      method: "GET",
      requiresAuth: true,
      description: "Get all users with optional filtering and pagination",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
    get: {
      path: "/users/:id",
      method: "GET",
      requiresAuth: true,
      description: "Get a single user by ID",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
    create: {
      path: "/users",
      method: "POST",
      requiresAuth: true,
      description: "Create a new user",
    },
    update: {
      path: "/users/:id",
      method: "PATCH",
      requiresAuth: true,
      description: "Update an existing user",
    },
    delete: {
      path: "/users/:id",
      method: "DELETE",
      requiresAuth: true,
      description: "Delete a user",
    },
    passwordReset: {
      path: "/users/password-reset",
      method: "POST",
      requiresAuth: true,
      description: "Send password reset email to user",
    },
    changeStatus: {
      path: "/users/:id/status",
      method: "PATCH",
      requiresAuth: true,
      description: "Change user status (activate/deactivate)",
    },
  },
  roles: {
    list: {
      path: "/roles",
      method: "GET",
      requiresAuth: true,
      description: "Get all roles with optional filtering and pagination",
      cacheable: true,
      cacheTime: 60000, // 1 minute
    },
    get: {
      path: "/roles/:id",
      method: "GET",
      requiresAuth: true,
      description: "Get a single role by ID",
      cacheable: true,
      cacheTime: 60000, // 1 minute
    },
    create: {
      path: "/roles",
      method: "POST",
      requiresAuth: true,
      description: "Create a new role",
    },
    update: {
      path: "/roles/:id",
      method: "PATCH",
      requiresAuth: true,
      description: "Update an existing role",
    },
    delete: {
      path: "/roles/:id",
      method: "DELETE",
      requiresAuth: true,
      description: "Delete a role",
    },
    users: {
      path: "/roles/:id/users",
      method: "GET",
      requiresAuth: true,
      description: "Get users assigned to a role",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
  },
  permissions: {
    list: {
      path: "/permissions",
      method: "GET",
      requiresAuth: true,
      description: "Get all available permissions grouped by category",
      cacheable: true,
      cacheTime: 300000, // 5 minutes
    },
    rolePermissions: {
      path: "/roles/:id/permissions",
      method: "GET",
      requiresAuth: true,
      description: "Get permissions for a specific role",
      cacheable: true,
      cacheTime: 60000, // 1 minute
    },
    updateRolePermissions: {
      path: "/roles/:id/permissions",
      method: "PUT",
      requiresAuth: true,
      description: "Update permissions for a role",
    },
    userPermissions: {
      path: "/user/permissions",
      method: "GET",
      requiresAuth: true,
      description: "Get permissions for the current user",
      cacheable: true,
      cacheTime: 60000, // 1 minute
    },
  },
  activityLogs: {
    list: {
      path: "/activity-logs",
      method: "GET",
      requiresAuth: true,
      description: "Get activity logs with optional filtering and pagination",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
    get: {
      path: "/activity-logs/:id",
      method: "GET",
      requiresAuth: true,
      description: "Get a single activity log entry by ID",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
    userLogs: {
      path: "/users/:id/activity-logs",
      method: "GET",
      requiresAuth: true,
      description: "Get activity logs for a specific user",
      cacheable: true,
      cacheTime: 30000, // 30 seconds
    },
    export: {
      path: "/activity-logs/export",
      method: "GET",
      requiresAuth: true,
      description: "Export activity logs as CSV or JSON",
    },
  },
};

/**
 * Get the full URL for an API endpoint
 * @param category The API category (e.g., 'auth', 'users')
 * @param endpoint The endpoint name within the category
 * @param params Optional parameters to replace in the path (e.g., :id)
 * @returns The full URL for the API endpoint
 */
export function getApiUrl(
  category: keyof ApiRegistry,
  endpoint: string,
  params?: Record<string, string | number>,
): string {
  const categoryEndpoints = apiRegistry[category];
  if (!categoryEndpoints) {
    throw new Error(`API category '${category}' not found in registry`);
  }

  const endpointDef = categoryEndpoints[endpoint];
  if (!endpointDef) {
    throw new Error(
      `Endpoint '${endpoint}' not found in category '${category}'`,
    );
  }

  let path = endpointDef.path;

  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }

  return `${API_BASE_URL}${path}`;
}

/**
 * Get the endpoint definition
 * @param category The API category (e.g., 'auth', 'users')
 * @param endpoint The endpoint name within the category
 * @returns The endpoint definition
 */
export function getEndpointDefinition(
  category: keyof ApiRegistry,
  endpoint: string,
): EndpointDefinition {
  const categoryEndpoints = apiRegistry[category];
  if (!categoryEndpoints) {
    throw new Error(`API category '${category}' not found in registry`);
  }

  const endpointDef = categoryEndpoints[endpoint];
  if (!endpointDef) {
    throw new Error(
      `Endpoint '${endpoint}' not found in category '${category}'`,
    );
  }

  return endpointDef;
}

/**
 * Get all API endpoints
 * @returns A flattened array of all API endpoints with their categories
 */
export function getAllEndpoints(): Array<{
  category: string;
  endpoint: string;
  definition: EndpointDefinition;
}> {
  const allEndpoints: Array<{
    category: string;
    endpoint: string;
    definition: EndpointDefinition;
  }> = [];

  Object.entries(apiRegistry).forEach(([category, endpoints]) => {
    Object.entries(endpoints).forEach(([endpoint, definition]) => {
      allEndpoints.push({
        category,
        endpoint,
        definition,
      });
    });
  });

  return allEndpoints;
}
