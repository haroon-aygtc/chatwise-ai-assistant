import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
    Database,
    Home,
    MessageSquare,
    Shield,
    Cpu,
    FileText,
    MessageSquarePlus,
    GitBranch,
    LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/auth/useAuth";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Add type for nested navigation
type NavigationItem = {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    requiredRole?: string;
    requiredPermission?: string | string[];
    children?: NavigationSubItem[];
};

type NavigationSubItem = {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    requiredRole?: string;
    requiredPermission?: string | string[];
};

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, hasRole, hasPermission } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const navigationItems: NavigationItem[] = [
        {
            icon: <Home size={18} />,
            label: "Home",
            path: "/home",
            active: location.pathname === "/home",
        },
        {
            icon: <LayoutDashboard size={18} />,
            label: "Dashboard",
            path: "/dashboard",
            active: location.pathname === "/dashboard",
        },
        {
            icon: <MessageSquare size={18} />,
            label: "Chat Sessions",
            path: "/chat-sessions",
            active: location.pathname === "/chat-sessions",
        },
        {
            icon: <Shield size={18} />,
            label: "Admin Dashboard",
            path: "/admin/dashboard",
            active: location.pathname === "/admin/dashboard",
            requiredRole: "admin",
        },
        {
            icon: <FileBarChart2 size={18} />,
            label: "Analytics",
            path: "/admin/analytics",
            active: location.pathname === "/admin/analytics",
            requiredRole: "admin",
        },
        {
            icon: <Users size={18} />,
            label: "User Management",
            path: "/admin/users",
            active: location.pathname === "/admin/users",
            requiredRole: "admin",
            requiredPermission: "manage users",
        },
        {
            icon: <Bot size={18} />,
            label: "AI Configuration",
            path: "/admin/ai-configuration",
            active: location.pathname.startsWith("/admin/ai-configuration"),
            requiredRole: "admin",
            children: [
                {
                    icon: <Cpu size={16} />,
                    label: "AI Models",
                    path: "/admin/ai-configuration/models",
                    active: location.pathname === "/admin/ai-configuration/models",
                },
                {
                    icon: <FileText size={16} />,
                    label: "Response Formats",
                    path: "/admin/ai-configuration/response-formats",
                    active: location.pathname === "/admin/ai-configuration/response-formats",
                },
                {
                    icon: <MessageSquarePlus size={16} />,
                    label: "Follow-Up Suggestions",
                    path: "/admin/ai-configuration/follow-up",
                    active: location.pathname === "/admin/ai-configuration/follow-up",
                },
                {
                    icon: <GitBranch size={16} />,
                    label: "Branching Flows",
                    path: "/admin/ai-configuration/branching-flows",
                    active: location.pathname === "/admin/ai-configuration/branching-flows",
                }
            ]
        },
        {
            icon: <Database size={18} />,
            label: "Knowledge Base",
            path: "/admin/knowledge-base",
            active: location.pathname === "/admin/knowledge-base",
            requiredRole: "admin",
        },
        {
            icon: <PanelTop size={18} />,
            label: "Widget Builder",
            path: "/admin/widget-builder",
            active: location.pathname === "/admin/widget-builder",
            requiredRole: "admin",
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

    // Filter navigation items based on user roles and permissions
    const filteredNavItems = navigationItems.filter(item => {
        if (item.requiredRole && !hasRole(item.requiredRole)) {
            return false;
        }
        if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
            return false;
        }
        return true;
    });

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <div
                className={cn(
                    "border-r bg-card text-card-foreground transition-all duration-300 flex flex-col h-screen fixed z-30",
                    isSidebarCollapsed ? "w-[60px]" : "w-[240px]"
                )}
            >
                {/* Sidebar Header */}
                <div className="p-4 flex justify-between items-center">
                    {!isSidebarCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">CS</div>
                            <h2 className="text-lg font-semibold">ChatSystem</h2>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className={cn("ml-auto", isSidebarCollapsed && "mx-auto")}
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
                <nav className="flex-1 py-4 overflow-y-auto">
                    <ul className="space-y-1 px-2">
                        {filteredNavItems.map((item, index) => (
                            <li key={index}>
                                {item.children ? (
                                    <div className="space-y-1">
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

                                        {item.active && !isSidebarCollapsed && (
                                            <ul className="pl-6 space-y-1">
                                                {item.children.map((child, childIndex) => (
                                                    <li key={`${index}-${childIndex}`}>
                                                        <Link to={child.path}>
                                                            <Button
                                                                variant={child.active ? "secondary" : "ghost"}
                                                                className={cn(
                                                                    "w-full justify-start",
                                                                    child.active ? "bg-secondary" : ""
                                                                )}
                                                                size="sm"
                                                            >
                                                                {child.icon}
                                                                <span className="ml-2">{child.label}</span>
                                                            </Button>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
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
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Sidebar Footer */}
                <div className="mt-auto p-4">
                    <Separator className="mb-4" />
                    <div className="flex items-center justify-between">
                        {!isSidebarCollapsed ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium truncate max-w-[120px]">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <ModeToggle />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLogout}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <LogOut size={18} />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 w-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleLogout}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <LogOut size={18} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    isSidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
                )}
            >
                {/* Header */}
                <header className="border-b py-2 px-6 bg-background sticky top-0 z-20">
                    <div className="flex items-center justify-between h-12">
                        <h1 className="font-semibold text-lg">
                            {filteredNavItems.find(item => item.active)?.label || "Dashboard"}
                        </h1>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t py-4 px-6">
                    <div className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ChatSystem. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout; 