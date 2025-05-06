
export interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  read: boolean;
  metadata?: Record<string, any>;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export interface Session {
  id: string;
  name?: string;
  email?: string;
  userId?: string;
  status: 'active' | 'closed' | 'archived';
  source?: string;
  metadata?: Record<string, any>;
  lastMessage?: string;
  lastMessageTime?: Date;
  unread: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWidget {
  id: string;
  name: string;
  description?: string;
  type: 'chat' | 'form' | 'questionnaire';
  status: 'active' | 'inactive' | 'draft';
  configuration: {
    appearance: {
      primaryColor: string;
      headerBgColor: string;
      textColor: string;
      borderRadius: number;
      widgetWidth: number;
      widgetHeight: number;
      darkMode: boolean;
      glassMorphism: boolean;
      shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl';
      animation: 'none' | 'fade' | 'slide' | 'bounce';
    };
    general: {
      botName: string;
      welcomeMessage: string;
      placeholderText: string;
      logoUrl?: string;
    };
    behavior: {
      position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
      initialState: 'open' | 'closed' | 'minimized';
      autoOpen: boolean;
      autoOpenDelay: number;
      welcomeButtons?: {
        label: string;
        value: string;
      }[];
      requireRegistration: boolean;
      collectUserInfo: {
        name: boolean;
        email: boolean;
        phone: boolean;
      };
    };
    integration: {
      aiModel?: string;
      knowledgeBase?: string;
      promptTemplate?: string;
      customPrompt?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetSettings {
  id: string;
  widgetId: string;
  key: string;
  value: any;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
