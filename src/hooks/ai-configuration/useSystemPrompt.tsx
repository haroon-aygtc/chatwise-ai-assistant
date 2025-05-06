
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ApiService from "@/services/api/base";

interface SystemPrompt {
  id: string;
  content: string;
  updatedAt: string;
}

export function useSystemPrompt() {
  const queryClient = useQueryClient();

  // Fetch system prompt
  const { 
    data: systemPrompt,
    isLoading,
  } = useQuery({
    queryKey: ['systemPrompt'],
    queryFn: async () => {
      return await ApiService.get<SystemPrompt>("/ai-configuration/system-prompt");
    },
  });

  // Save system prompt mutation
  const saveSystemPromptMutation = useMutation({
    mutationFn: async (content: string) => {
      return await ApiService.put<SystemPrompt>("/ai-configuration/system-prompt", { content });
    },
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
