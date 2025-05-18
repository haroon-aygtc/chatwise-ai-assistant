
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PromptTemplate } from "@/types/ai-configuration";
import * as PromptTemplateService from "@/services/ai-configuration/promptTemplateService";
import { useToast } from "@/components/ui/use-toast";

export function usePromptTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all templates
  const { 
    data: templates = [], 
    isLoading: isLoadingTemplates,
    error: templatesError,
    refetch: refetchTemplates
  } = useQuery({
    queryKey: ["promptTemplates"],
    queryFn: PromptTemplateService.getAllTemplates,
  });

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ["promptTemplateCategories"],
    queryFn: PromptTemplateService.getCategories,
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: PromptTemplateService.createTemplate,
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "The prompt template has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["promptTemplates"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create template: ${error.message}`,
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, template }: { id: string; template: Partial<PromptTemplate> }) => 
      PromptTemplateService.updateTemplate(id, template),
    onSuccess: () => {
      toast({
        title: "Template updated",
        description: "The prompt template has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["promptTemplates"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update template: ${error.message}`,
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: PromptTemplateService.deleteTemplate,
    onSuccess: () => {
      toast({
        title: "Template deleted",
        description: "The prompt template has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["promptTemplates"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete template: ${error.message}`,
      });
    },
  });

  // Helper functions
  const createTemplate = async (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      await createTemplateMutation.mutateAsync(template);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateTemplate = async (id: string, template: Partial<PromptTemplate>) => {
    try {
      await updateTemplateMutation.mutateAsync({ id, template });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await deleteTemplateMutation.mutateAsync(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    templates,
    categories,
    selectedTemplate,
    setSelectedTemplate,
    isLoadingTemplates,
    isLoadingCategories,
    isSaving: createTemplateMutation.isPending || updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    templatesError,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetchTemplates,
  };
}
