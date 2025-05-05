
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Bot, Database, BarChart, Settings } from "lucide-react";

interface HomeProps {
  navigate: (path: string) => void;
}

export const Home = ({ navigate }: HomeProps) => {
  const [activeModule, setActiveModule] = useState("dashboard");

  const modules = [
    { id: "dashboard", name: "Dashboard", icon: <BarChart className="h-5 w-5" /> },
    { id: "users", name: "User Management", icon: <Users className="h-5 w-5" /> },
    { id: "ai", name: "AI Configuration", icon: <Bot className="h-5 w-5" /> },
    { id: "knowledge", name: "Knowledge Base", icon: <Database className="h-5 w-5" /> },
    { id: "settings", name: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    
    // Navigate to the appropriate route
    switch (moduleId) {
      case "dashboard":
        navigate("/admin/dashboard");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "ai":
        navigate("/admin/ai-config");
        break;
      case "knowledge":
        navigate("/admin/knowledge-base");
        break;
      case "settings":
        navigate("/admin/settings");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <Button
          key={module.id}
          variant="outline"
          className={`h-24 justify-start p-4 ${
            activeModule === module.id ? "border-primary" : ""
          }`}
          onClick={() => handleModuleClick(module.id)}
        >
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-2 text-primary">
              {module.icon}
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold">{module.name}</div>
              <div className="text-sm text-muted-foreground">
                Manage {module.name.toLowerCase()}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};
