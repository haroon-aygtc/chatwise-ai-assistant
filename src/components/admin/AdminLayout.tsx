import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
  FileBarChart2,
  Workflow,
  Bot,
  PanelTop,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth/useAuth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import AdminNotFound from "./AdminNotFound";

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
};

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if the current location is one of our defined routes
  const isKnownRoute = [
    "/admin/dashboard",
    "/admin/analytics",
    "/admin/users",
    "/admin/ai-config",
    "/admin/widget-builder",
    "/admin/settings",
    "/admin/knowledge-base", // Added knowledge base route
  ].includes(location.pathname);

  const sidebarItems: SidebarItem[] = [
    {
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      path: "/admin/dashboard",
      active: location.pathname === "/admin/dashboard",
    },
    {
      icon: <FileBarChart2 size={18} />,
      label: "Analytics",
      path: "/admin/analytics",
      active: location.pathname === "/admin/analytics",
    },
    {
      icon: <Users size={18} />,
      label: "User Management",
      path: "/admin/users",
      active: location.pathname === "/admin/users",
    },
    {
      icon: <Bot size={18} />,
      label: "AI Configuration",
      path: "/admin/ai-config",
      active: location.pathname === "/admin/ai-config",
    },
    {
      icon: <Database size={18} />,
      label: "Knowledge Base",
      path: "/admin/knowledge-base",
      active: location.pathname === "/admin/knowledge-base",
    },
    {
      icon: <PanelTop size={18} />,
      label: "Widget Builder",
      path: "/admin/widget-builder",
      active: location.pathname === "/admin/widget-builder",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/admin/settings",
      active: location.pathname === "/admin/settings",
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // If the route is not defined, show the NotFound component
  if (!isKnownRoute) {
    return <AdminNotFound />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "border-r bg-card text-card-foreground transition-all duration-300 flex flex-col",
          isSidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex justify-between items-center">
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </Button>
        </div>
        <Separator />

        {/* Sidebar Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      item.active ? "bg-secondary" : ""
                    )}
                  >
                    {item.icon}
                    {!isSidebarCollapsed && (
                      <span className="ml-2">{item.label}</span>
                    )}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto p-4">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!isSidebarCollapsed && (
                <div className="ml-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-1">
              {!isSidebarCollapsed && <ModeToggle />}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
