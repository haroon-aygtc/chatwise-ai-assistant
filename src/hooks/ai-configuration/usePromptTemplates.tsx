import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as promptTemplateService from "@/services/ai-configuration/promptTemplateService";
import type { PromptTemplate, PromptTemplateCategory } from "../../../types/ai-configuration";
import { useState } from "react";

// Type definitions for request payloads
export interface CreatePromptTemplateRequest {
  name: string;
  description: string;
  template: string;
  variables: Array<{
    name: string;
    description?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
  }>;
  content?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdatePromptTemplateRequest {
  name?: string;
  description?: string;
  template?: string;
  variables?: Array<{
    name: string;
    description?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
  }>;
  content?: string;
  category?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export function usePromptTemplates() {
  const queryClient = useQueryClient();

  // Filters state for template queries
  const [filters, setFilters] = useState({
    search: undefined as string | undefined,
    category: undefined as string | undefined,
  });

  // Current template being edited
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);

  // System prompt state (separate from regular templates)
  const [systemPrompt, setSystemPrompt] = useState({
    content: "",
    version: 1,
    isActive: true,
  });

  // Query for fetching templates with filters
  const {
    data: templates = [],
    isLoading: isLoadingTemplates,
    error: templatesError,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ['promptTemplates', filters],
    queryFn: () => promptTemplateService.getAllTemplates(filters),
  });

  // Query for fetching template categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['promptTemplateCategories'],
    queryFn: promptTemplateService.getCategories,
  });

  // Mutation for creating a new template
  const createTemplateMutation = useMutation({
    mutationFn: (templateData: CreatePromptTemplateRequest) =>
      promptTemplateService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
    },
    onError: (error) => {
      console.error("Error creating template:", error);
      throw error;
    },
  });

  // Mutation for updating an existing template
  const updateTemplateMutation = useMutation({
    mutationFn: (params: { id: string, data: UpdatePromptTemplateRequest }) =>
      promptTemplateService.updateTemplate(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
    },
    onError: (error) => {
      console.error("Error updating template:", error);
      throw error;
    },
  });

  // Mutation for deleting a template
  const deleteTemplateMutation = useMutation({
    mutationFn: promptTemplateService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
    },
    onError: (error) => {
      console.error("Error deleting template:", error);
      throw error;
    },
  });

  // Mutation for tracking template usage
  const incrementUsageMutation = useMutation({
    mutationFn: promptTemplateService.incrementUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
    },
  });

  // Update the system prompt
  const updateSystemPrompt = async (content: string) => {
    setSystemPrompt({
      ...systemPrompt,
      content,
      version: systemPrompt.version + 1,
    });

    // TODO: Replace with actual API call when endpoint is available
    return true;
  };

  // Handler functions for template operations
  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
  };

  const createTemplate = async (templateData: CreatePromptTemplateRequest) => {
    return createTemplateMutation.mutateAsync(templateData);
  };

  const updateTemplate = async (id: string, templateData: UpdatePromptTemplateRequest) => {
    return updateTemplateMutation.mutateAsync({ id, data: templateData });
  };

  const deleteTemplate = async (id: string) => {
    return deleteTemplateMutation.mutateAsync(id);
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    // Remove ID to create a new template
    const { id, createdAt, updatedAt, usageCount, ...rest } = template;

    // Create clone with slightly modified name
    const clonedTemplate: CreatePromptTemplateRequest = {
      ...rest,
      name: `${template.name} (Copy)`,
    };

    return createTemplate(clonedTemplate);
  };

  // Update filters for searching and filtering templates
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Track template usage
  const trackTemplateUsage = async (id: string) => {
    return incrementUsageMutation.mutateAsync(id);
  };

  return {
    // Data
    templates,
    categories,
    systemPrompt,
    currentTemplate,
    filters,

    // Loading states
    isLoading: isLoadingTemplates || isLoadingCategories,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,

    // Error states
    error: templatesError || categoriesError,

    // Actions
    createTemplate,
    updateTemplate,
    deleteTemplate,
    updateSystemPrompt,
    handleEditTemplate,
    handleCloneTemplate,
    updateFilters,
    trackTemplateUsage,
    setCurrentTemplate,
    refetchTemplates,
  };
}
