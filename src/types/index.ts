/**
 * Core Domain Types
 *
 * Contains the main entity types used across the application.
 * API-specific types (requests/responses) are in @/services/api/types
 */

// User Domain
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar: string;
}

// Permission Domain
export interface Permission {
  id: string;
  name: string;
}

export interface PermissionCategory {
  category: string;
  permissions: Permission[];
}

// Role Domain
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

// Activity Log Domain
export interface ActivityLogEntry {
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar: string;
}

export interface NewUser {
  name: string;
  email: string;
  role: string;
}

export interface EditedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface NewRole {
  name: string;
  description: string;
  permissions: string[];
}

export interface EditedRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
