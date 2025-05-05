
import { cn } from "@/lib/utils";
import { Session } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onClick: () => void;
}

export function SessionItem({ session, isActive, onClick }: SessionItemProps) {
  const formattedTime = formatDistanceToNow(new Date(session.lastMessageTime), { addSuffix: true });
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent rounded-md transition-colors",
        isActive && "bg-accent"
      )}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <div className="font-medium text-primary-foreground">
          {session.name.charAt(0).toUpperCase()}
        </div>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm truncate">{session.name}</div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{formattedTime}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {session.lastMessage}
          </p>
          
          {session.unread > 0 && (
            <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {session.unread}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <Badge variant={session.status === "active" ? "default" : "outline"} className="text-[10px] py-0 h-4">
            {session.status}
          </Badge>
          
          {session.isAiActive && (
            <Badge variant="secondary" className="text-[10px] py-0 h-4">
              AI
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
