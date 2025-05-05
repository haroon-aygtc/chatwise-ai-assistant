
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user" | string;
  status: "active" | "inactive" | "pending" | string;
  lastActive?: string;
  createdAt: string;
  avatarUrl?: string;
  organization?: string;
  permissions?: string[];
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
