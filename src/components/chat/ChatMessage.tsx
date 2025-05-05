
import { useState } from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
  onFollowUpClick?: (question: string) => void;
}

export function ChatMessage({ message, showAvatar = true, onFollowUpClick }: ChatMessageProps) {
  const [showMore, setShowMore] = useState(false);

  const isAiOrAgent = message.sender === 'ai' || message.sender === 'agent';
  const content = message.content;
  const needsShowMore = content.length > 300;
  
  const displayContent = needsShowMore && !showMore 
    ? content.slice(0, 300) + '...' 
    : content;

  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-slide-in",
      isAiOrAgent ? "justify-start" : "justify-end"
    )}>
      {isAiOrAgent && showAvatar && (
        <Avatar className="h-8 w-8 bg-primary text-white">
          <div className="text-xs font-semibold">{message.sender === 'agent' ? message.agentName?.[0] : 'AI'}</div>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        <div className={cn(
          "px-4 py-2 rounded-lg",
          isAiOrAgent 
            ? "bg-chat-ai text-foreground rounded-tl-none" 
            : "bg-primary/10 text-foreground rounded-tr-none"
        )}>
          {isAiOrAgent && message.sender === 'agent' && (
            <div className="font-semibold text-sm mb-1">{message.agentName || 'Agent'}</div>
          )}
          <div className="whitespace-pre-line text-sm">{displayContent}</div>
          {needsShowMore && (
            <button 
              onClick={() => setShowMore(!showMore)} 
              className="text-xs text-primary mt-1 hover:underline"
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          )}
          
          {message.followUpQuestions && message.followUpQuestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.followUpQuestions.map((question, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  onClick={() => onFollowUpClick?.(question)}
                  className="text-xs py-1 h-auto"
                >
                  {question}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-chat-timestamp mt-1 px-2">
          {message.sender === 'agent' && message.agentName 
            ? `${message.agentName} • ${formattedTime}` 
            : formattedTime}
        </div>
      </div>
      
      {!isAiOrAgent && showAvatar && (
        <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground">
          <div className="text-xs font-semibold">U</div>
        </Avatar>
      )}
    </div>
  );
}
