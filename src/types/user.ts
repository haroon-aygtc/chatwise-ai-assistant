
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "editor" | "user" | string;
  status: "active" | "inactive" | "pending" | "suspended" | string;
  lastActive: string;
  createdAt: string;
  avatar?: string;
  avatarUrl?: string;
  organization?: string;
  permissions?: string[];
}

export interface NewUser {
  name: string;
  email: string;
  role: string;
  password?: string;
  status?: string;
  organization?: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
}
