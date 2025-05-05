import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatWidget from "./chat/ChatWidget";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import AIConfiguration from "./admin/AIConfiguration";
import WidgetBuilder from "./admin/WidgetBuilder";
import KnowledgeBase from "./admin/KnowledgeBase";
import UserManagement from "./admin/user-management";
import ThemeBuilder from "./admin/ThemeBuilder";
import ApiTester from "./api-tester/ApiTester";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Home as HomeIcon,
  Code,
  BarChart3,
  Webhook,
  Settings,
  ServerCog,
} from "lucide-react";

function Home() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      setIsTransitioning(false);
    }, 300); // Match the duration-300 in the transition class
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "conversations":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Conversations</h1>
                <p className="text-muted-foreground">
                  View and manage all chat conversations
                </p>
              </div>
            </div>
            <div className="border rounded-md p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Conversations Module
              </h2>
              <p className="text-muted-foreground mb-4">
                This module is under development. It will allow you to view and
                manage all chat conversations.
              </p>
            </div>
          </div>
        );
      case "ai-config":
        return <AIConfiguration />;
      case "widget-builder":
        return <WidgetBuilder />;
      case "knowledge-base":
        return <KnowledgeBase />;
      case "user-management":
        return <UserManagement />;
      case "api-tester":
        return <ApiTester />;
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                  Monitor and analyze conversation metrics
                </p>
              </div>
            </div>
            <div className="border rounded-md p-8 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Analytics Module</h2>
              <p className="text-muted-foreground mb-4">
                This module is under development. It will provide detailed
                analytics and reporting.
              </p>
            </div>
          </div>
        );
      case "embedding":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Embedding</h1>
                <p className="text-muted-foreground">
                  Manage embedding models and configurations
                </p>
              </div>
            </div>
            <div className="border rounded-md p-8 text-center">
              <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Embedding Module</h2>
              <p className="text-muted-foreground mb-4">
                This module is under development. It will allow you to manage
                embedding models and configurations.
              </p>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Integrations</h1>
                <p className="text-muted-foreground">
                  Connect with external services and APIs
                </p>
              </div>
            </div>
            <div className="border rounded-md p-8 text-center">
              <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Integrations Module
              </h2>
              <p className="text-muted-foreground mb-4">
                This module is under development. It will allow you to connect
                with external services and APIs.
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Configure system settings and preferences
                </p>
              </div>
            </div>
            <div className="border rounded-md p-8 text-center">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Settings Module</h2>
              <p className="text-muted-foreground mb-4">
                This module is under development. It will allow you to configure
                system settings and preferences.
              </p>
            </div>
          </div>
        );
      case "api-tester":
        return <ApiTester />;
      default:
        return <Dashboard />;
    }
  };

  const getActivePageName = () => {
    switch (activeView) {
      case "dashboard":
        return "Dashboard";
      case "conversations":
        return "Conversations";
      case "ai-config":
        return "AI Configuration";
      case "widget-builder":
        return "Widget Builder";
      case "knowledge-base":
        return "Knowledge Base";
      case "user-management":
        return "User Management";
      case "analytics":
        return "Analytics";
      case "embedding":
        return "Embedding";
      case "integrations":
        return "Integrations";
      case "settings":
        return "Settings";
      case "api-tester":
        return "API Tester";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-card border-r h-screen sticky top-0">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-bold">AI Chat Admin</h2>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                General
              </h3>
              <div className="space-y-1 mt-2">
                <Button
                  variant={activeView === "dashboard" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleViewChange("dashboard")}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={
                    activeView === "conversations" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleViewChange("conversations")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Conversations
                </Button>
                <Button
                  variant={activeView === "analytics" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleViewChange("analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                Configuration
              </h3>
              <div className="space-y-1 mt-2">
                <Button
                  variant={activeView === "ai-config" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleViewChange("ai-config")}
                >
                  <ServerCog className="mr-2 h-4 w-4" />
                  AI Configuration
                </Button>
                <Button
                  variant={
                    activeView === "widget-builder" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleViewChange("widget-builder")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Widget Builder
                </Button>
                <Button
                  variant={
                    activeView === "knowledge-base" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleViewChange("knowledge-base")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Knowledge Base
                </Button>
                <Button
                  variant={activeView === "embedding" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleViewChange("embedding")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Embedding
                </Button>
                <Button
                  variant={
                    activeView === "user-management" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleViewChange("user-management")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button
                  variant={
                    activeView === "integrations" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => handleViewChange("integrations")}
                >
                  <Webhook className="mr-2 h-4 w-4" />
                  Integrations
                </Button>
                <Button
                  variant={activeView === "api-tester" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate("/api-tester")}
                >
                  <Code className="mr-2 h-4 w-4" />
                  API Tester
                </Button>
                <Button
                  variant={activeView === "settings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleViewChange("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/csrf-debug")}
                >
                  <ServerCog className="mr-2 h-4 w-4" />
                  CSRF Debugger
                </Button>
              </div>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="ml-2 text-sm">
                <p className="font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@example.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Header */}
          <div className="md:hidden border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-xl font-bold">AI Chat Admin</h2>
              <Button variant="outline" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div
            className={`p-6 ${isTransitioning ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
