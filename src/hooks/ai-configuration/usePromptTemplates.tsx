
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PromptTemplateService, { CreatePromptTemplateRequest, UpdatePromptTemplateRequest } from "@/services/ai-configuration/promptTemplateService";
import { PromptTemplate } from "@/types/ai-configuration";

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
    data: templatesData = { data: [], total: 0 },
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['promptTemplates', filters],
    queryFn: () => PromptTemplateService.getTemplates(filters),
  });

  // Fetch categories
  const { 
    data: categories = [],
  } = useQuery({
    queryKey: ['promptTemplateCategories'],
    queryFn: PromptTemplateService.getCategories,
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: PromptTemplateService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowAddDialog(false);
      toast.success("Template created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create template: ${error.message || "Unknown error"}`);
    }
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdatePromptTemplateRequest }) => 
      PromptTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowEditDialog(false);
      toast.success("Template updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update template: ${error.message || "Unknown error"}`);
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: PromptTemplateService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      toast.success("Template deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete template: ${error.message || "Unknown error"}`);
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
    updateTemplateMutation.mutate({ id: currentTemplate.id, data: templateData });
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    const clonedTemplate: CreatePromptTemplateRequest = {
      name: `${template.name} (Copy)`,
      description: template.description,
      template: template.template,
      variables: template.variables,
      category: template.category,
      is_active: template.isActive,
      is_default: false, // Clone should never be default
    };
    createTemplateMutation.mutate(clonedTemplate);
  };

  return {
    templates: templatesData.data,
    totalTemplates: templatesData.total,
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
