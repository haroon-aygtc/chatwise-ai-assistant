
import { Session } from "@/types/chat";

export const mockChatSessions: Session[] = [
  {
    id: "sess_001",
    name: "John Doe",
    email: "john@example.com",
    lastMessage: "Can you help me with my subscription?",
    lastMessageTime: "2025-05-04T15:30:00Z",
    status: "active",
    unread: 3,
    isAiActive: true
  },
  {
    id: "sess_002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    lastMessage: "Thanks for the information!",
    lastMessageTime: "2025-05-04T14:45:00Z",
    status: "active",
    unread: 0,
    isAiActive: true
  },
  {
    id: "sess_003",
    name: "Michael Brown",
    email: "michael@example.com",
    lastMessage: "I still have an issue with login...",
    lastMessageTime: "2025-05-04T13:20:00Z",
    status: "active",
    unread: 1,
    isAiActive: false
  },
  {
    id: "sess_004",
    name: "Emma Wilson",
    email: "emma@example.com",
    lastMessage: "How do I cancel my subscription?",
    lastMessageTime: "2025-05-03T18:10:00Z",
    status: "active",
    unread: 0,
    isAiActive: true
  },
  {
    id: "sess_005",
    name: "David Lee",
    email: "david@example.com",
    lastMessage: "I need a refund for my recent purchase",
    lastMessageTime: "2025-05-03T10:05:00Z",
    status: "active",
    unread: 0,
    isAiActive: false
  },
  {
    id: "sess_006",
    name: "Lisa Garcia",
    email: "lisa@example.com",
    lastMessage: "The new feature works great!",
    lastMessageTime: "2025-05-02T16:40:00Z",
    status: "closed",
    unread: 0,
    isAiActive: true
  },
  {
    id: "sess_007",
    name: "Ryan Martinez",
    email: "ryan@example.com",
    lastMessage: "When will you add PayPal support?",
    lastMessageTime: "2025-05-02T09:15:00Z",
    status: "closed",
    unread: 0,
    isAiActive: true
  },
  {
    id: "sess_008",
    name: "Jennifer Taylor",
    email: "jennifer@example.com",
    lastMessage: "I'm having trouble uploading files",
    lastMessageTime: "2025-05-01T17:25:00Z",
    status: "closed",
    unread: 0,
    isAiActive: false
  }
];

export const getSessionById = (id: string): Session | undefined => {
  return mockChatSessions.find(session => session.id === id);
};
