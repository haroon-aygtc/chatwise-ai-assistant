
import { useState, useEffect } from "react";
import { Outlet, NavLink, useMatch } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Settings, 
  Code, 
  UserCog,
  BookOpen,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
}

function NavItem({ to, icon, label, end = false, onClick }: NavItemProps) {
  const isActive = useMatch({ path: to, end });
  
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground hover:bg-background/80"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export function AdminLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle responsive behavior
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r w-64 flex flex-col transition-all duration-300 z-30",
        isMobile && "fixed inset-y-0 left-0 h-full",
        isMobile && !sidebarOpen && "-translate-x-full"
      )}>
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl">ChatWise Admin</h1>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItem 
            to="/admin/chat-sessions" 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Chat Sessions"
            onClick={closeSidebarIfMobile}
          />
          <NavItem 
            to="/admin/knowledge-base" 
            icon={<BookOpen className="h-5 w-5" />} 
            label="Knowledge Base"
            onClick={closeSidebarIfMobile}
          />
          <NavItem 
            to="/admin/ai-configuration" 
            icon={<Code className="h-5 w-5" />} 
            label="AI Configuration"
            onClick={closeSidebarIfMobile}
          />
          <NavItem 
            to="/admin/user-management" 
            icon={<UserCog className="h-5 w-5" />} 
            label="User Management"
            onClick={closeSidebarIfMobile}
          />
          <NavItem 
            to="/admin/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings"
            onClick={closeSidebarIfMobile}
          />
        </nav>
        
        <div className="p-3 border-t mt-auto">
          <Button variant="outline" className="w-full justify-start" asChild>
            <NavLink to="/login">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </NavLink>
          </Button>
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={closeSidebarIfMobile}
        />
      )}
      
      {/* Main content */}
      <main className={cn(
        "flex-1 overflow-hidden transition-all duration-300",
        isMobile && sidebarOpen && "opacity-50"
      )}>
        <Outlet />
      </main>
    </div>
  );
}
