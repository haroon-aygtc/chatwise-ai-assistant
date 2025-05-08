
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as systemPromptService from "@/services/ai-configuration/systemPromptService";
import type { SystemPrompt } from "@/types/ai-configuration";

export function useSystemPrompt() {
  const queryClient = useQueryClient();

  // Fetch system prompt
  const { 
    data: systemPrompt = { id: "default", content: "" },
    isLoading: isLoadingPrompt, 
    error: promptError,
    refetch: refetchPrompt
  } = useQuery({
    queryKey: ["systemPrompt"],
    queryFn: systemPromptService.getSystemPrompt,
  });

  // Update system prompt mutation
  const saveSystemPromptMutation = useMutation({
    mutationFn: (content: string) => systemPromptService.updateSystemPrompt(content),
    onSuccess: () => {
      toast.success("System prompt updated successfully");
      queryClient.invalidateQueries({ queryKey: ["systemPrompt"] });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update system prompt: ${errorMessage}`);
    },
  });

  // Handler for saving system prompt
  const handleSaveSystemPrompt = async (content: string) => {
    try {
      await saveSystemPromptMutation.mutateAsync(content);
      return true;
    } catch {
      return false;
    }
  };

  return {
    systemPrompt,
    isLoadingPrompt,
    isUpdatingPrompt: saveSystemPromptMutation.isPending,
    promptError,
    updatePrompt: handleSaveSystemPrompt,
    refetchPrompt,
    saveSystemPromptMutation,
    handleSaveSystemPrompt
  };
}
