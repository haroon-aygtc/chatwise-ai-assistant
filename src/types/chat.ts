
export interface Session {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
  status: "active" | "closed";
  unread: number;
  isAiActive: boolean;
}

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: "user" | "ai" | "agent" | "system";
  agentName?: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
  followUpQuestions?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document" | "video" | "audio";
  size: number;
}

export interface ChatWidget {
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  welcomeMessage: string;
  offlineMessage: string;
  placeholderText: string;
  logoUrl?: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: "small" | "medium" | "large";
  showAgentAvatar: boolean;
  showUserAvatar: boolean;
  allowAttachments: boolean;
  collectUserInfo: boolean;
  requiredFields: ("name" | "email" | "phone")[];
  aiConfigId: string;
}

export interface WidgetSettings {
  id: string;
  domain: string;
  allowedOrigins: string[];
  isActive: boolean;
  widgetId: string;
  createdAt: string;
  updatedAt: string;
}
