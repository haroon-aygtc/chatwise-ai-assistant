
import { useState } from "react";
import { Session } from "@/types/chat";
import { SessionItem } from "./SessionItem";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  selectedSessionId?: string;
}

export function SessionList({ sessions, onSelectSession, selectedSessionId }: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">("all");

  // Filter sessions based on search query and active tab
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "active" && session.status === "active") ||
      (activeTab === "closed" && session.status === "closed");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={value => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3 mx-3 mt-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="flex-1 overflow-y-auto p-2">
          <SessionContent 
            sessions={filteredSessions} 
            onSelectSession={onSelectSession}
            selectedSessionId={selectedSessionId}
          />
        </TabsContent>
        
        <TabsContent value="active" className="flex-1 overflow-y-auto p-2">
          <SessionContent 
            sessions={filteredSessions} 
            onSelectSession={onSelectSession}
            selectedSessionId={selectedSessionId}
          />
        </TabsContent>
        
        <TabsContent value="closed" className="flex-1 overflow-y-auto p-2">
          <SessionContent 
            sessions={filteredSessions} 
            onSelectSession={onSelectSession}
            selectedSessionId={selectedSessionId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SessionContent({ sessions, onSelectSession, selectedSessionId }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>No sessions found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {sessions.map(session => (
        <SessionItem
          key={session.id}
          session={session}
          isActive={session.id === selectedSessionId}
          onClick={() => onSelectSession(session)}
        />
      ))}
    </div>
  );
}
