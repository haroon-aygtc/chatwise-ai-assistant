
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: Role[];
  permissions?: string[];
  status?: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: string;
  jobTitle?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  userCount?: number;
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  categoryId?: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface NewRole {
  name: string;
  description?: string;
  permissions: string[];
}

export interface EditedRole {
  name?: string;
  description?: string;
  permissions?: string[];
}
