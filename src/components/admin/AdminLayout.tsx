import { ReactNode, useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  MessageSquare,
  PanelLeft,
  Settings,
  Users,
  Database,
  BarChart3,
  Code,
  Webhook,
  Bot,
  Palette,
  Menu,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  HelpCircle,
  Building2,
  User,
  Home,
} from "lucide-react";

interface AdminLayoutProps {
  children?: ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const AdminLayout = ({
  children,
  activePage: propActivePage,
  onNavigate: propOnNavigate,
}: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTenant, setActiveTenant] = useState("Company Name");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Determine active page from URL path
  const getActivePageFromPath = () => {
    const path = location.pathname.split('/').pop() || '';
    if (path === 'admin' || path === '') return 'Dashboard';
    if (path === 'chat-sessions') return 'Conversations';
    if (path === 'knowledge-base') return 'Knowledge Base';
    if (path === 'ai-configuration') return 'AI Configuration';
    if (path === 'user-management') return 'User Management';
    if (path === 'settings') return 'Settings';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const activePage = propActivePage || getActivePageFromPath();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/admin",
      active: activePage === "Dashboard",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Conversations",
      href: "/admin/chat-sessions",
      active: activePage === "Conversations",
    },
    {
      icon: <Bot size={20} />,
      label: "AI Configuration",
      href: "/admin/ai-configuration",
      active: activePage === "AI Configuration",
    },
    {
      icon: <Palette size={20} />,
      label: "Widget Builder",
      href: "/admin/widget-builder",
      active: activePage === "Widget Builder",
    },
    {
      icon: <Database size={20} />,
      label: "Knowledge Base",
      href: "/admin/knowledge-base",
      active: activePage === "Knowledge Base",
    },
    {
      icon: <Users size={20} />,
      label: "User Management",
      href: "/admin/user-management",
      active: activePage === "User Management",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      href: "/admin/analytics",
      active: activePage === "Analytics",
    },
    {
      icon: <Code size={20} />,
      label: "Embedding",
      href: "/admin/embedding",
      active: activePage === "Embedding",
    },
    {
      icon: <Webhook size={20} />,
      label: "Integrations",
      href: "/admin/integrations",
      active: activePage === "Integrations",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/admin/settings",
      active: activePage === "Settings",
    },
  ];

  const tenants = [
    {
      name: "Company Name",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=CN",
    },
    {
      name: "Acme Corp",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
    },
    {
      name: "Globex Industries",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=GI",
    },
    {
      name: "Stark Enterprises",
      logo: "https://api.dicebear.com/7.x/initials/svg?seed=SE",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"} bg-white dark:bg-card border-r flex flex-col transition-all duration-300 ${collapsed && !isMobile ? "w-16" : "w-64"} ${mobileMenuOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : ""}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b bg-white dark:bg-card">
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                CS
              </div>
              <h1 className="font-bold text-lg">ChatSystem</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              isMobile ? setMobileMenuOpen(false) : setCollapsed(!collapsed)
            }
            className="h-8 w-8"
          >
            <PanelLeft size={18} />
          </Button>
        </div>

        {/* Tenant Selector */}
        {(!collapsed || isMobile) && (
          <div className="px-3 py-3 border-b">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-9"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <img
                        src={
                          tenants.find((t) => t.name === activeTenant)?.logo ||
                          "https://api.dicebear.com/7.x/initials/svg?seed=CN"
                        }
                        alt={activeTenant}
                      />
                    </Avatar>
                    <span className="truncate text-sm">{activeTenant}</span>
                  </div>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="right">
                <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tenants.map((tenant, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer"
                    onClick={() => setActiveTenant(tenant.name)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Avatar className="h-5 w-5">
                        <img src={tenant.logo} alt={tenant.name} />
                      </Avatar>
                      <span>{tenant.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Add Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="px-3 py-2">
            {mainNavItems.map((item, index) => (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className={`w-full justify-start mb-0.5 ${collapsed && !isMobile ? "px-2" : ""} ${
                        item.active ? "bg-amber-50 dark:bg-amber-950/30 font-medium" : ""
                      } h-10 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400`}
                      onClick={() => {
                        if (typeof propOnNavigate === "function") {
                          propOnNavigate(item.label);
                        }
                        navigate(item.href);
                      }}
                    >
                      <span
                        className={`${item.active ? "text-amber-500" : "text-muted-foreground"} mr-3`}
                      >
                        {item.icon}
                      </span>
                      {(!collapsed || isMobile) && (
                        <span className={item.active ? "text-amber-500" : ""}>
                          {item.label}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && !isMobile && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                      alt="User"
                    />
                  </Avatar>
                  {(!collapsed || isMobile) && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">Admin User</p>
                      <p className="text-xs text-muted-foreground truncate">
                        admin@example.com
                      </p>
                    </div>
                  )}
                  {(!collapsed || isMobile) && <ChevronDown size={16} />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-white dark:bg-card sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </Button>
            )}

            <div
              className={`relative ${searchFocused ? "w-72 md:w-96" : "w-56 md:w-72"} transition-all duration-300`}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 rounded-md pl-10 bg-background border border-input focus:border-ring focus:ring-1 focus:ring-ring focus-visible:outline-none text-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />

            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
            </Button>

            <Button variant="ghost" size="icon">
              <HelpCircle size={20} />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                      alt="User"
                    />
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">Admin User</p>
                  </div>
                  <ChevronDown size={16} className="hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="px-6 py-3 border-b bg-background">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activePage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
