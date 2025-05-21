import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  FileText,
  MessageSquare,
  Wand2,
  Sparkles,
  MessageCircle,
  ChevronRight,
  GitBranch,
  Settings,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConfigSidebarProps {
  standalone?: boolean;
}

const AIConfigSidebar = ({ standalone = false }: AIConfigSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const modules = [
    {
      id: "models",
      name: "AI Models",
      icon: <Bot className="h-5 w-5" />,
      description: "Configure AI models and providers",
      path: "/admin/ai-configuration/models",
    },
    {
      id: "prompts",
      name: "Prompt Templates",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Create and manage prompt templates",
      path: "/admin/ai-configuration/prompts",
    },
    {
      id: "response-formats",
      name: "Response Formatting",
      icon: <FileText className="h-5 w-5" />,
      description: "Configure how AI responses are structured",
      path: "/admin/ai-configuration/response-formats",
    },
    {
      id: "follow-up",
      name: "Follow-Up Engine",
      icon: <MessageCircle className="h-5 w-5" />,
      description: "Configure follow-up suggestions",
      path: "/admin/ai-configuration/follow-up",
    },
    {
      id: "branching-flows",
      name: "Branching Flows",
      icon: <GitBranch className="h-5 w-5" />,
      description: "Create conversation paths with branches",
      path: "/admin/ai-configuration/branching-flows",
    },
    {
      id: "settings",
      name: "AI Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Configure global AI behavior settings",
      path: "/admin/ai-configuration/settings",
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 border-r bg-background h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage AI settings</p>
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="p-3">
          {modules.map((module) => (
            <Button
              key={module.id}
              variant={currentPath === module.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 text-left",
                currentPath === module.path
                  ? "bg-secondary"
                  : "hover:bg-secondary/50",
              )}
              onClick={() => handleNavigate(module.path)}
            >
              <div className="flex items-center w-full">
                <div className="mr-2">{module.icon}</div>
                <span>{module.name}</span>
                {currentPath === module.path && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AIConfigSidebar;
