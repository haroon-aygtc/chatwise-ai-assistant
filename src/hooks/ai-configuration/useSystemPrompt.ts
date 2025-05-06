
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemPrompt } from "@/types/ai-configuration";
import * as SystemPromptService from "@/services/ai-configuration/systemPromptService";
import { useToast } from "@/components/ui/use-toast";

export function useSystemPrompt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch system prompt
  const { 
    data: systemPrompt, 
    isLoading: isLoadingPrompt,
    error: promptError,
    refetch: refetchPrompt
  } = useQuery({
    queryKey: ["systemPrompt"],
    queryFn: SystemPromptService.getSystemPrompt,
  });

  // Update system prompt mutation
  const updatePromptMutation = useMutation({
    mutationFn: SystemPromptService.updateSystemPrompt,
    onSuccess: () => {
      toast({
        title: "System prompt updated",
        description: "The system prompt has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["systemPrompt"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update system prompt: ${error.message}`,
      });
    },
  });

  // Helper function
  const updatePrompt = async (content: string) => {
    try {
      await updatePromptMutation.mutateAsync(content);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    systemPrompt,
    isLoadingPrompt,
    isUpdatingPrompt: updatePromptMutation.isPending,
    promptError,
    updatePrompt,
    refetchPrompt,
  };
}
