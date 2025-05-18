
import { useState } from "react";
import { SystemPrompt } from "@/types/ai-configuration";

export function useSystemPrompt() {
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPrompt, setIsUpdatingPrompt] = useState(false);

  const handleSaveSystemPrompt = async (content: string) => {
    setIsUpdatingPrompt(true);
    // Implementation would save the system prompt
    console.log("Saving system prompt...", content);
    setIsUpdatingPrompt(false);
    return true;
  };

  const updatePrompt = handleSaveSystemPrompt;

  return {
    systemPrompt,
    isLoading,
    isLoadingPrompt: isLoading,
    isUpdatingPrompt,
    updatePrompt,
    saveSystemPromptMutation: {
      isPending: isUpdatingPrompt,
    },
    handleSaveSystemPrompt,
  };
}
