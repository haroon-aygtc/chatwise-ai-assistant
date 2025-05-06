
import { useState, useEffect } from "react";
import { Message, Session } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatList } from "./ChatList";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useChat } from "@/hooks/chat/useChat";

interface ChatWindowProps {
  session: Session;
  onClose?: () => void;
  onBack?: () => void;
  className?: string;
}

export function ChatWindow({ session, onClose, onBack, className }: ChatWindowProps) {
  const {
    messages,
    isLoading,
    isSending,
    fetchMessages,
    sendMessage: sendChatMessage,
    markAsRead
  } = useChat();
  
  useEffect(() => {
    // Load messages for this session
    if (session?.id) {
      fetchMessages(session.id);
      
      // Mark messages as read when opening the chat
      if (session.unread > 0) {
        markAsRead(session.id);
      }
    }
  }, [session?.id, fetchMessages, markAsRead, session?.unread]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !session?.id) return;
    
    // Send the message
    await sendChatMessage(content, session.id);
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
        isLoading={isSending}
        placeholder="Type your message..."
      />
    </Card>
  );
}
