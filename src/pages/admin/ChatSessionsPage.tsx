
import { useState } from "react";
import { Session } from "@/types/chat";
import { SessionList } from "@/components/admin/SessionList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { mockChatSessions } from "@/mock/chatSessions";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatSessionsPage() {
  const isMobile = useIsMobile();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
  };

  const handleBackClick = () => {
    setSelectedSession(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-card">
        <h1 className="text-2xl font-bold">Chat Sessions</h1>
        <p className="text-muted-foreground">Manage and respond to your user conversations</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {/* Sessions list - always visible on desktop, conditional on mobile */}
          <div className={cn(
            "border-r md:col-span-1 h-full",
            isMobile && selectedSession ? "hidden" : "block"
          )}>
            <SessionList 
              sessions={mockChatSessions}
              onSelectSession={handleSelectSession}
              selectedSessionId={selectedSession?.id}
            />
          </div>
          
          {/* Chat window - always visible on desktop, conditional on mobile */}
          <div className={cn(
            "md:col-span-2 lg:col-span-3 h-full",
            isMobile && !selectedSession ? "hidden" : "block"
          )}>
            {selectedSession ? (
              <ChatWindow 
                session={selectedSession}
                onBack={isMobile ? handleBackClick : undefined}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-card/50">
                <div className="text-center">
                  <h2 className="text-xl font-medium">No conversation selected</h2>
                  <p className="text-muted-foreground">Select a chat session from the list to start the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
