
export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  permissions?: string[];
  roles?: Role[];
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  isActive?: boolean;
}

export interface EditedUser {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}
