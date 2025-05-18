
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as systemPromptService from "@/services/ai-configuration/systemPromptService";
import { SystemPrompt } from "@/types/ai-configuration";

export function useSystemPrompt() {
  const queryClient = useQueryClient();

  // Fetch system prompt
  const { 
    data: systemPrompt,
    isLoading,
  } = useQuery({
    queryKey: ['systemPrompt'],
    queryFn: systemPromptService.getSystemPrompt,
  });

  // Save system prompt mutation
  const saveSystemPromptMutation = useMutation({
    mutationFn: (content: string) => 
      systemPromptService.updateSystemPrompt(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemPrompt'] });
      toast.success("System prompt saved successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to save system prompt: ${error.message || "Unknown error"}`);
    }
  });

  // Handle save system prompt
  const handleSaveSystemPrompt = (content: string) => {
    saveSystemPromptMutation.mutate(content);
  };

  return {
    systemPrompt,
    isLoading,
    saveSystemPromptMutation,
    handleSaveSystemPrompt,
  };
}
