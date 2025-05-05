
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  onBack?: () => void;
  avatarUrl?: string;
  className?: string;
}

export function ChatHeader({
  title,
  subtitle,
  onClose,
  onBack,
  avatarUrl,
  className
}: ChatHeaderProps) {
  const [isOnline] = useState(true);
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 border-b bg-card",
      className
    )}>
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      
      <Avatar className="h-9 w-9 shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={title} />
        ) : (
          <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-medium">
            {title.charAt(0).toUpperCase()}
          </div>
        )}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-1 ring-background" />
        )}
      </Avatar>
      
      <div className="flex-1 overflow-hidden">
        <h3 className="font-medium text-sm truncate">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      )}
    </div>
  );
}
