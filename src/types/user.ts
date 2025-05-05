
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
