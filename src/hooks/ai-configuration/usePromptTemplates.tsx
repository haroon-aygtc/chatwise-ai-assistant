import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as promptTemplateService from "@/services/ai-configuration/promptTemplateService";
import type { PromptTemplate, PromptTemplateCategory } from "@/types/ai-configuration";

// Define request types
export interface CreatePromptTemplateRequest {
  name: string;
  description?: string;
  template: string;
  category: string;
  variables: string[];
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdatePromptTemplateRequest {
  name?: string;
  description?: string;
  template?: string;
  category?: string;
  variables?: string[];
  isActive?: boolean;
  isDefault?: boolean;
}

export function usePromptTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const queryClient = useQueryClient();

  // Filters for templates query
  const filters = {
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  };

  // Fetch templates
  const {
    data: templates = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['promptTemplates', filters],
    queryFn: () => promptTemplateService.getAllTemplates(filters),
  });

  // Fetch categories
  const {
    data: categories = [],
  } = useQuery({
    queryKey: ['promptTemplateCategories'],
    queryFn: promptTemplateService.getCategories,
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (templateData: CreatePromptTemplateRequest) =>
      promptTemplateService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowAddDialog(false);
      toast.success("Template created successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to create template: ${errorMessage}`);
    }
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: (params: { id: string, data: UpdatePromptTemplateRequest }) =>
      promptTemplateService.updateTemplate(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowEditDialog(false);
      toast.success("Template updated successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to update template: ${errorMessage}`);
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: promptTemplateService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      toast.success("Template deleted successfully");
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to delete template: ${errorMessage}`);
    }
  });

  // Handlers
  const handleRefresh = () => {
    refetch();
  };

  const handleAddTemplate = () => {
    setShowAddDialog(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const handleSaveNewTemplate = (templateData: CreatePromptTemplateRequest) => {
    createTemplateMutation.mutate(templateData);
  };

  const handleSaveEditedTemplate = (templateData: UpdatePromptTemplateRequest) => {
    if (!currentTemplate) return;
    updateTemplateMutation.mutate({
      id: currentTemplate.id,
      data: templateData
    });
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    // Extract variable names from PromptVariable objects
    const variableNames = template.variables ? template.variables.map(v => v.name) : [];

    const clonedTemplate: CreatePromptTemplateRequest = {
      name: `${template.name} (Copy)`,
      description: template.description,
      template: template.template,
      variables: variableNames, // Use the extracted variable names
      category: template.category || "General", // Provide a default category if undefined
      isActive: template.isActive,
      isDefault: false, // Clone should never be default
    };
    createTemplateMutation.mutate(clonedTemplate);
  };

  return {
    templates,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentTemplate,
    isLoading,
    isError,
    handleRefresh,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveNewTemplate,
    handleSaveEditedTemplate,
    handleCloneTemplate,
    createTemplateMutation,
    updateTemplateMutation,
    deleteTemplateMutation
  };
}