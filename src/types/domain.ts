/**
 * Domain Types
 *
 * These types represent the core domain entities of the application.
 * They should be used consistently across the application.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: Role[];
  permissions?: string[];
  status?: "active" | "inactive" | "pending";
  lastActive?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: string;
  jobTitle?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

/**
 * Core interfaces for roles and permissions system.
 * These are the canonical definitions used throughout the application.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount?: number;
  permissions: string[] | Permission[];
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  category?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionCategory {
  id: string;
  category: string;
  name?: string;
  description?: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NewRole {
  name: string;
  description: string;
  permissions: string[];
  [key: string]: unknown;
}

export interface EditedRole {
  id?: string;
  name?: string;
  description?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface NewUser {
  name: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface EditedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  [key: string]: unknown;
}

export interface ActivityLogEntry {
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
