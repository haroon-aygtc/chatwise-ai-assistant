
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  status?: "active" | "inactive" | "pending";
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
}

export interface EditedUser {
  name?: string;
  email?: string;
  role?: string;
  status?: "active" | "inactive" | "pending";
  permissions?: string[];
}
