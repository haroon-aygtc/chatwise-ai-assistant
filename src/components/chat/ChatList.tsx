
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
  messages: Message[];
  isLoading?: boolean;
  showAvatars?: boolean;
  onFollowUpClick?: (question: string) => void;
}

export function ChatList({ 
  messages, 
  isLoading = false, 
  showAvatars = true,
  onFollowUpClick
}: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && !isLoading ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              showAvatar={showAvatars}
              onFollowUpClick={onFollowUpClick}
            />
          ))}
          
          {isLoading && (
            <div className="flex gap-3 mb-4 animate-slide-in">
              <div className="h-8 w-8 shrink-0">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="flex-1 max-w-[80%]">
                <Skeleton className="h-10 w-40 rounded-lg" />
                <div className="flex gap-1 mt-2">
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <div className="h-2 w-2 rounded-full bg-muted animate-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
