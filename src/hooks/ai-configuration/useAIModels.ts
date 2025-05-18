
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIModel, ModelProvider } from "@/types/ai-configuration";
import * as AIModelService from "@/services/ai-configuration/aiModelService";
import { useToast } from "@/components/ui/use-toast";

export function useAIModels() {
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all models
  const { 
    data: models = [], 
    isLoading: isLoadingModelsQuery, 
    error: modelsError,
    refetch: refetchModels 
  } = useQuery({
    queryKey: ["aiModels"],
    queryFn: AIModelService.getAllModels,
  });

  // Fetch all providers
  const { 
    data: providers = [], 
    isLoading: isLoadingProviders,
    error: providersError,
    refetch: refetchProviders 
  } = useQuery({
    queryKey: ["modelProviders"],
    queryFn: AIModelService.getAllProviders,
  });

  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: AIModelService.createModel,
    onSuccess: () => {
      toast({
        title: "Model created",
        description: "The AI model has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create model: ${error.message}`,
      });
    },
  });

  // Update model mutation
  const updateModelMutation = useMutation({
    mutationFn: ({ id, model }: { id: string; model: Partial<AIModel> }) => 
      AIModelService.updateModel(id, model),
    onSuccess: () => {
      toast({
        title: "Model updated",
        description: "The AI model has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update model: ${error.message}`,
      });
    },
  });

  // Delete model mutation
  const deleteModelMutation = useMutation({
    mutationFn: AIModelService.deleteModel,
    onSuccess: () => {
      toast({
        title: "Model deleted",
        description: "The AI model has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete model: ${error.message}`,
      });
    },
  });

  // Set default model mutation
  const setDefaultModelMutation = useMutation({
    mutationFn: AIModelService.setDefaultModel,
    onSuccess: () => {
      toast({
        title: "Default model updated",
        description: "The default AI model has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["aiModels"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to set default model: ${error.message}`,
      });
    },
  });

  // Provider mutations
  const createProviderMutation = useMutation({
    mutationFn: AIModelService.createProvider,
    onSuccess: () => {
      toast({
        title: "Provider created",
        description: "The model provider has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["modelProviders"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create provider: ${error.message}`,
      });
    },
  });

  const updateProviderMutation = useMutation({
    mutationFn: ({ id, provider }: { id: string; provider: Partial<ModelProvider> }) => 
      AIModelService.updateProvider(id, provider),
    onSuccess: () => {
      toast({
        title: "Provider updated",
        description: "The model provider has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["modelProviders"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update provider: ${error.message}`,
      });
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: AIModelService.deleteProvider,
    onSuccess: () => {
      toast({
        title: "Provider deleted",
        description: "The model provider has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["modelProviders"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete provider: ${error.message}`,
      });
    },
  });

  // Test model mutation
  const testModelMutation = useMutation({
    mutationFn: ({ id, prompt, options }: { id: string; prompt: string; options?: Record<string, any> }) => 
      AIModelService.testModel(id, prompt, options),
  });

  // Helper functions
  const createModel = async (model: Omit<AIModel, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSavingModel(true);
    try {
      await createModelMutation.mutateAsync(model);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSavingModel(false);
    }
  };

  const updateModel = async (id: string, model: Partial<AIModel>) => {
    setIsSavingModel(true);
    try {
      await updateModelMutation.mutateAsync({ id, model });
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSavingModel(false);
    }
  };

  const deleteModel = async (id: string) => {
    try {
      await deleteModelMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const setDefaultModel = async (id: string) => {
    try {
      await setDefaultModelMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  const testModel = async (id: string, prompt: string, options?: Record<string, any>) => {
    try {
      return await testModelMutation.mutateAsync({ id, prompt, options });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Test failed",
          description: error.message,
        });
      }
      return null;
    }
  };

  return {
    models,
    providers,
    selectedModel,
    setSelectedModel,
    isLoadingModels: isLoadingModels || isLoadingModelsQuery,
    isLoadingProviders,
    isSavingModel,
    isTestingModel: testModelMutation.isPending,
    modelsError,
    providersError,
    createModel,
    updateModel,
    deleteModel,
    setDefaultModel,
    testModel,
    createProvider: createProviderMutation.mutateAsync,
    updateProvider: (id: string, provider: Partial<ModelProvider>) => 
      updateProviderMutation.mutateAsync({ id, provider }),
    deleteProvider: deleteProviderMutation.mutateAsync,
    refetchModels,
    refetchProviders,
  };
}
