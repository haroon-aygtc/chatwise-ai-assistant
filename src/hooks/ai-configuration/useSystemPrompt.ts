
import { useState } from "react";
import { SystemPrompt } from "@/types/ai-configuration";

export function useSystemPrompt() {
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSystemPrompt = async (content: string) => {
    // Implementation would save the system prompt
    console.log("Saving system prompt...", content);
    return true;
  };

  return {
    systemPrompt,
    isLoading,
    saveSystemPromptMutation: {
      isPending: false,
    },
    handleSaveSystemPrompt,
  };
}
