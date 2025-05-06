
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { PromptTemplate } from "@/types/ai-configuration";
import { promptTemplateService } from "@/services/ai-configuration";

export const usePromptTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);

  // Fetch templates
  const { 
    data: templatesData, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['promptTemplates', { search: searchQuery, category: selectedCategory }],
    queryFn: () => promptTemplateService.getAllTemplates({
      search: searchQuery || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
    }),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['promptTemplateCategories'],
    queryFn: () => promptTemplateService.getCategories(),
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: (template: any) => promptTemplateService.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['promptTemplateCategories'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      promptTemplateService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      setShowEditDialog(false);
      setCurrentTemplate(null);
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update template",
        variant: "destructive",
      });
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => promptTemplateService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promptTemplates'] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const templates = templatesData?.data || [];
  const categories = categoriesData || [];

  // Map categories to format expected by component
  const categoryOptions = [
    { id: "general", name: "General" },
    { id: "products", name: "Products" },
    { id: "support", name: "Support" },
    { id: "sales", name: "Sales" },
    ...categories
      .filter((cat) => !["general", "products", "support", "sales"].includes(cat))
      .map((cat) => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) })),
  ];

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
    deleteTemplateMutation.mutate(id);
  };

  const handleSaveNewTemplate = (templateData: Partial<PromptTemplate>) => {
    createTemplateMutation.mutate(templateData);
  };

  const handleSaveEditedTemplate = (id: string, templateData: Partial<PromptTemplate>) => {
    updateTemplateMutation.mutate({
      id,
      data: templateData,
    });
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    const clonedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      isDefault: false,
    };
    // Remove the id property for create operation
    const { id, ...templateToCreate } = clonedTemplate;
    createTemplateMutation.mutate(templateToCreate);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentTemplate,
    setCurrentTemplate,
    templates,
    categories: categoryOptions,
    isLoading,
    handleRefresh,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveNewTemplate,
    handleSaveEditedTemplate,
    handleCloneTemplate,
    createTemplateMutation,
    updateTemplateMutation,
  };
};
