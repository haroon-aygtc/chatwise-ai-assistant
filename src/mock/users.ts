
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "inactive" | "pending";
  lastActive?: string;
  createdAt: string;
  avatarUrl?: string;
  organization?: string;
  permissions?: string[];
}

export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    status: "active",
    lastActive: "2025-05-03T10:30:00",
    createdAt: "2025-01-15T08:00:00",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    organization: "ChatWise Inc.",
    permissions: ["all"]
  },
  {
    id: "user-002",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "moderator",
    status: "active",
    lastActive: "2025-05-04T16:45:00",
    createdAt: "2025-02-10T11:20:00",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    organization: "ChatWise Inc.",
    permissions: ["chat.manage", "kb.edit", "kb.view"]
  },
  {
    id: "user-003",
    name: "James Wilson",
    email: "james@example.com",
    role: "user",
    status: "active",
    lastActive: "2025-05-03T09:15:00",
    createdAt: "2025-03-05T14:30:00",
    organization: "ChatWise Inc.",
    permissions: ["chat.view", "kb.view"]
  },
  {
    id: "user-004",
    name: "Liu Wei",
    email: "liu@example.com",
    role: "moderator",
    status: "active",
    lastActive: "2025-05-05T08:20:00",
    createdAt: "2025-03-12T09:45:00",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    organization: "ChatWise Inc.",
    permissions: ["chat.manage", "kb.edit", "kb.view"]
  },
  {
    id: "user-005",
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "user",
    status: "inactive",
    lastActive: "2025-04-20T11:30:00",
    createdAt: "2025-02-22T13:15:00",
    avatarUrl: "https://i.pravatar.cc/150?img=6",
    organization: "ChatWise Inc.",
    permissions: ["chat.view"]
  },
  {
    id: "user-006",
    name: "David Brown",
    email: "david@example.com",
    role: "user",
    status: "pending",
    createdAt: "2025-05-02T16:40:00",
    organization: "ChatWise Inc."
  },
  {
    id: "user-007",
    name: "Emma Davis",
    email: "emma@example.com",
    role: "admin",
    status: "active",
    lastActive: "2025-05-05T09:10:00",
    createdAt: "2025-01-30T10:00:00",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    organization: "ChatWise Inc.",
    permissions: ["all"]
  },
  {
    id: "user-008",
    name: "Michael Lee",
    email: "michael@example.com",
    role: "user",
    status: "active",
    lastActive: "2025-05-04T13:25:00",
    createdAt: "2025-04-05T08:30:00",
    organization: "ChatWise Inc.",
    permissions: ["chat.view", "kb.view"]
  }
];
