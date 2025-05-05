import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Database,
  MessageSquare,
  Wand2,
  Sparkles,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIConfigSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const AIConfigSidebar = ({
  activeModule,
  onModuleChange,
}: AIConfigSidebarProps) => {
  const modules = [
    {
      id: "models",
      name: "AI Models",
      icon: <Bot className="h-5 w-5" />,
      description: "Configure AI models and providers",
    },
    {
      id: "knowledge-base",
      name: "Knowledge Base",
      icon: <Database className="h-5 w-5" />,
      description: "Connect your AI to knowledge sources",
    },
    {
      id: "prompts",
      name: "Prompt Templates",
      icon: <MessageSquare className="h-5 w-5" />,
      description: "Create and manage prompt templates",
    },
    {
      id: "formatting",
      name: "Response Formatting",
      icon: <Wand2 className="h-5 w-5" />,
      description: "Configure how AI responses are structured",
    },
    {
      id: "branding",
      name: "Branding Engine",
      icon: <Sparkles className="h-5 w-5" />,
      description: "Apply brand voice and styling to responses",
    },
    {
      id: "follow-up",
      name: "Follow-Up Engine",
      icon: <MessageCircle className="h-5 w-5" />,
      description: "Configure follow-up suggestions",
    },
  ];

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
              variant={activeModule === module.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1 text-left",
                activeModule === module.id
                  ? "bg-secondary"
                  : "hover:bg-secondary/50",
              )}
              onClick={() => onModuleChange(module.id)}
            >
              <div className="flex items-center w-full">
                <div className="mr-2">{module.icon}</div>
                <span>{module.name}</span>
                {activeModule === module.id && (
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
