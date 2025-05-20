import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bot,
    MessageSquarePlus,
    FileText,
    Settings,
    GitBranch,
    Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIConfiguration } from "@/hooks/ai-configuration/useAIConfiguration";

export const ConfigurationManager = () => {
    const location = useLocation();
    const {
        navigateToSection,
        isComponentImplemented,
        handleRedirect
    } = useAIConfiguration();
    const currentPath = location.pathname;

    const navigationItems = [
        {
            icon: Cpu,
            name: "AI Models",
            description: "Configure AI models and providers",
            path: "/admin/ai-configuration/models",
            key: "models"
        },
        {
            icon: FileText,
            name: "Response Formats",
            description: "Configure response structures and templates",
            path: "/admin/ai-configuration/response-formats",
            key: "response-formats"
        },
        {
            icon: MessageSquarePlus,
            name: "Follow-Up Suggestions",
            description: "Configure AI-powered follow-up suggestions",
            path: "/admin/ai-configuration/follow-up",
            key: "follow-up"
        },
        {
            icon: GitBranch,
            name: "Branching Flows",
            description: "Create conversation paths with multiple branches",
            path: "/admin/ai-configuration/branching-flows",
            key: "branching-flows"
        },
        {
            icon: Settings,
            name: "General Settings",
            description: "Configure global AI behavior settings",
            path: "/admin/ai-configuration/settings",
            key: "settings"
        }
    ];

    // Handle navigation with component availability check
    const handleNavigate = (item: typeof navigationItems[0]) => {
        if (isComponentImplemented(item.key)) {
            navigateToSection(item.key);
        } else {
            handleRedirect(item.name);
        }
    };

    // If we're at a specific route, show the corresponding component
    if (currentPath !== "/admin/ai-configuration") {
        return <Outlet />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Configuration</h1>
                <p className="text-muted-foreground mt-2">
                    Configure AI models, response formats, and follow-up suggestions
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {navigationItems.map((item) => (
                    <Card
                        key={item.path}
                        className={cn(
                            "cursor-pointer transition-all hover:border-primary",
                            currentPath === item.path && "border-primary",
                            !isComponentImplemented(item.key) && "opacity-80"
                        )}
                        onClick={() => handleNavigate(item)}
                    >
                        <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                            <div className="flex flex-col space-y-1.5">
                                <CardTitle className="text-xl">{item.name}</CardTitle>
                                <CardDescription>{item.description}</CardDescription>
                            </div>
                            <div className="ml-auto bg-muted rounded-md w-10 h-10 flex items-center justify-center">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="default"
                                className="w-full"
                                onClick={() => handleNavigate(item)}
                            >
                                Configure {item.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ConfigurationManager; 