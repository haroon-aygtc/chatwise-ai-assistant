
import { Message } from "@/types/chat";

export const mockChatMessages: Record<string, Message[]> = {
  "sess_001": [
    {
      id: "msg_1001",
      sessionId: "sess_001",
      content: "Hello, I'm having trouble with my subscription. It's not showing the premium features.",
      sender: "user",
      timestamp: "2025-05-04T15:15:00Z",
      read: true
    },
    {
      id: "msg_1002",
      sessionId: "sess_001",
      content: "Hi John! I'm sorry to hear you're having issues with your subscription. Let me check your account details. Could you confirm when you made the payment for the premium plan?",
      sender: "ai",
      timestamp: "2025-05-04T15:17:00Z",
      read: true
    },
    {
      id: "msg_1003",
      sessionId: "sess_001",
      content: "I paid yesterday using my credit card. I got a confirmation email too.",
      sender: "user",
      timestamp: "2025-05-04T15:20:00Z",
      read: true
    },
    {
      id: "msg_1004",
      sessionId: "sess_001",
      content: "Thank you for confirming. Sometimes it takes up to 24 hours for the system to reflect subscription changes. However, I can manually activate your premium features right now. Please give me a moment.",
      sender: "ai",
      timestamp: "2025-05-04T15:22:00Z",
      read: true
    },
    {
      id: "msg_1005",
      sessionId: "sess_001",
      content: "Great, I appreciate that. Can you help me with my subscription?",
      sender: "user",
      timestamp: "2025-05-04T15:30:00Z",
      read: false
    }
  ],
  "sess_002": [
    {
      id: "msg_2001",
      sessionId: "sess_002",
      content: "Hi, I'm looking for information about your enterprise plan pricing.",
      sender: "user",
      timestamp: "2025-05-04T14:30:00Z",
      read: true
    },
    {
      id: "msg_2002",
      sessionId: "sess_002",
      content: "Hello Sarah! I'd be happy to provide information about our enterprise plan. Our enterprise pricing starts at $499/month and includes unlimited users, advanced analytics, priority support, and custom integrations. Would you like me to send you a detailed PDF with all features?",
      sender: "ai",
      timestamp: "2025-05-04T14:32:00Z",
      read: true
    },
    {
      id: "msg_2003",
      sessionId: "sess_002",
      content: "Yes please, that would be great. Also, do you offer any trial period for the enterprise plan?",
      sender: "user",
      timestamp: "2025-05-04T14:35:00Z",
      read: true
    },
    {
      id: "msg_2004",
      sessionId: "sess_002",
      content: "Absolutely! We offer a 14-day free trial for our enterprise plan. I've just sent the detailed pricing PDF to your email. You should receive it shortly. Is there anything specific about the enterprise features you're most interested in?",
      sender: "ai",
      timestamp: "2025-05-04T14:38:00Z",
      read: true
    },
    {
      id: "msg_2005",
      sessionId: "sess_002",
      content: "Thanks for the information!",
      sender: "user",
      timestamp: "2025-05-04T14:45:00Z",
      read: true
    }
  ],
  "sess_003": [
    {
      id: "msg_3001",
      sessionId: "sess_003",
      content: "I can't login to my account. I keep getting an 'invalid credentials' error.",
      sender: "user",
      timestamp: "2025-05-04T13:00:00Z",
      read: true
    },
    {
      id: "msg_3002",
      sessionId: "sess_003",
      content: "I'm sorry to hear you're having login issues, Michael. Have you tried resetting your password?",
      sender: "agent",
      agentName: "Alex",
      timestamp: "2025-05-04T13:05:00Z",
      read: true
    },
    {
      id: "msg_3003",
      sessionId: "sess_003",
      content: "Yes, I tried that but I'm not receiving the password reset email.",
      sender: "user",
      timestamp: "2025-05-04T13:10:00Z",
      read: true
    },
    {
      id: "msg_3004",
      sessionId: "sess_003",
      content: "Let me check your account. It appears there might be an issue with your email address. The system shows your email as m****@example.com - is that correct? Also, please check your spam folder for the reset email.",
      sender: "agent",
      agentName: "Alex",
      timestamp: "2025-05-04T13:15:00Z",
      read: true
    },
    {
      id: "msg_3005",
      sessionId: "sess_003",
      content: "I still have an issue with login...",
      sender: "user",
      timestamp: "2025-05-04T13:20:00Z",
      read: false
    }
  ]
};

export const getMessagesBySessionId = (sessionId: string): Message[] => {
  return mockChatMessages[sessionId] || [];
};

export const addMessage = (message: Message): void => {
  if (!mockChatMessages[message.sessionId]) {
    mockChatMessages[message.sessionId] = [];
  }
  mockChatMessages[message.sessionId].push(message);
};
