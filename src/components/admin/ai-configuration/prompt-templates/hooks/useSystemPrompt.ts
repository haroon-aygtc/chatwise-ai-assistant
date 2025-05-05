
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useSystemPrompt = () => {
  const { toast } = useToast();
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant for our company. Your goal is to provide accurate, helpful information to users in a friendly and professional tone."
  );

  // Save system prompt mutation (this would be in a separate service in a real app)
  const saveSystemPromptMutation = useMutation({
    mutationFn: (prompt: string) => {
      // This would call an API endpoint in a real app
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System prompt saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save system prompt",
        variant: "destructive",
      });
    },
  });

  const handleSaveSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    saveSystemPromptMutation.mutate(prompt);
  };

  return {
    systemPrompt,
    saveSystemPromptMutation,
    handleSaveSystemPrompt,
  };
};
