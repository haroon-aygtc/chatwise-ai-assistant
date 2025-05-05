
import { useState, useEffect } from "react";
import { Message, Session } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatList } from "./ChatList";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { getMessagesBySessionId, addMessage } from "@/mock/chatMessages";

interface ChatWindowProps {
  session: Session;
  onClose?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ChatWindow({ session, onClose, onBack, className }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load messages for this session
    const sessionMessages = getMessagesBySessionId(session.id);
    setMessages(sessionMessages);
  }, [session.id]);

  const handleSendMessage = async (content: string) => {
    // Create user message
    const newUserMessage: Message = {
      id: `msg_${Date.now()}`,
      sessionId: session.id,
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      read: true
    };
    
    // Add to messages and mock API
    setMessages(prev => [...prev, newUserMessage]);
    addMessage(newUserMessage);
    
    // Simulate AI response
    setIsLoading(true);
    
    // Random delay to simulate API call
    const delay = 1000 + Math.random() * 2000;
    
    setTimeout(() => {
      // Generate AI response based on user input
      let aiResponse: Message;
      
      if (content.toLowerCase().includes("pricing") || content.toLowerCase().includes("subscription")) {
        aiResponse = {
          id: `msg_${Date.now() + 1}`,
          sessionId: session.id,
          content: "We offer several pricing plans to suit different needs. Our Basic plan starts at $9.99/month, the Pro plan at $19.99/month, and the Business plan at $49.99/month. Each plan offers different features. Would you like me to explain the differences in more detail?",
          sender: session.isAiActive ? "ai" : "agent",
          agentName: session.isAiActive ? undefined : "Support Agent",
          timestamp: new Date().toISOString(),
          read: true,
          followUpQuestions: [
            "Tell me about the Basic plan",
            "What features are in the Pro plan?",
            "I need Business plan details"
          ]
        };
      } else if (content.toLowerCase().includes("help") || content.toLowerCase().includes("support")) {
        aiResponse = {
          id: `msg_${Date.now() + 1}`,
          sessionId: session.id,
          content: "I'm here to help! Could you please provide more details about what you need assistance with? I can help with account issues, technical problems, or general questions about our services.",
          sender: session.isAiActive ? "ai" : "agent",
          agentName: session.isAiActive ? undefined : "Support Agent",
          timestamp: new Date().toISOString(),
          read: true
        };
      } else {
        aiResponse = {
          id: `msg_${Date.now() + 1}`,
          sessionId: session.id,
          content: "Thank you for your message. I understand you're interested in " + content.split(" ").slice(0, 3).join(" ") + "... Could you provide more details so I can better assist you?",
          sender: session.isAiActive ? "ai" : "agent",
          agentName: session.isAiActive ? undefined : "Support Agent",
          timestamp: new Date().toISOString(),
          read: true
        };
      }
      
      // Add to messages and mock API
      setMessages(prev => [...prev, aiResponse]);
      addMessage(aiResponse);
      setIsLoading(false);
    }, delay);
  };

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <Card className={`flex flex-col h-full shadow-none border-0 md:border ${className}`}>
      <ChatHeader
        title={session.name}
        subtitle={session.email}
        onClose={onClose}
        onBack={onBack}
      />
      
      <ChatList 
        messages={messages} 
        isLoading={isLoading}
        onFollowUpClick={handleFollowUpClick}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Type your message..."
      />
    </Card>
  );
}
