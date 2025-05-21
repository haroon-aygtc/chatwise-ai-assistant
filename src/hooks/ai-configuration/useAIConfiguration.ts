import { useState } from "react";
import { useAIModels } from "./useAIModels";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

/**
 * A central hook for managing AI configuration across the application.
 * This hook combines functionality from various AI configuration modules
 * and provides a unified API for components to interact with.
 */
export function useAIConfiguration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Import functionality from other AI configuration hooks
  const {
    models,
    routingRules,
    isLoading: isLoadingModels,
    error: modelError,
    updateModel,
    updateRoutingRules,
    addRoutingRule,
    deleteRoutingRule,
    refreshData: refreshModelData,
    hasChanges: hasModelChanges,
  } = useAIModels();

  /**
   * Redirects to a specific AI configuration section
   * @param section The section to navigate to
   */
  const navigateToSection = (section: string) => {
    navigate(`/admin/ai-configuration/${section}`);
  };

  /**
   * Handles redirection for components that don't exist yet
   * @param componentName Name of the component to show in the redirect message
   */
  const handleRedirect = (componentName: string) => {
    toast({
      title: `${componentName} Not Available`,
      description: `The ${componentName} component is being redirected to the main AI Configuration page.`,
      duration: 5000,
    });
    navigate("/admin/ai-configuration");
  };

  /**
   * Check if a configuration component exists
   * @param componentKey The component identifier to check
   * @returns Boolean indicating if the component is implemented
   */
  const isComponentImplemented = (componentKey: string): boolean => {
    const implementedComponents = ["models", "response-formats", "follow-up"];
    return implementedComponents.includes(componentKey);
  };

  /**
   * Get component path from a friendly name
   * @param componentName The friendly name of the component
   * @returns The URL path for the component
   */
  const getComponentPath = (componentName: string): string => {
    const componentMap: Record<string, string> = {
      "AI Models": "models",
      "Response Formats": "response-formats",
      "Follow-Up Suggestions": "follow-up",
      "Branching Flows": "branching-flows",
      Settings: "settings",
    };

    return componentMap[componentName] || "";
  };

  return {
    // Data states
    models,
    routingRules,
    isLoading: isLoading || isLoadingModels,
    error: modelError,

    // General functionality
    navigateToSection,
    handleRedirect,
    isComponentImplemented,
    getComponentPath,

    // Model-specific functions
    updateModel,
    updateRoutingRules,
    addRoutingRule,
    deleteRoutingRule,
    refreshModelData,
    hasModelChanges,
  };
}

export default useAIConfiguration;
