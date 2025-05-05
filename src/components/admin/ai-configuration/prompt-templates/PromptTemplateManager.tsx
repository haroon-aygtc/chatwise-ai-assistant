
import { useState, useEffect } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { PromptTemplate } from "@/types/ai-configuration";
import promptTemplateService from "@/services/prompt-template/promptTemplateService";

// Import components
import { AddTemplateDialog } from "./AddTemplateDialog";
import { EditTemplateDialog } from "./EditTemplateDialog";
import { TemplateCard } from "./TemplateCard";
import { SystemPromptCard } from "./SystemPromptCard";
import { TemplateSearch } from "./TemplateSearch";
import { EmptyTemplateState } from "./EmptyTemplateState";

export interface PromptTemplateManagerProps {
  standalone?: boolean;
}

const PromptTemplateManager = ({
  standalone = false,
}: PromptTemplateManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(
    null,
  );
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant for our company. Your goal is to provide accurate, helpful information to users in a friendly and professional tone."
  );

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

  // Save system prompt mutation (this would be in a separate service in a real app)
  const saveSystemPromptMutation = useMutation({
    mutationFn: (prompt: string) => {
      // This would call an API endpoint in a real app
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System prompt saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save system prompt",
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

  const handleSaveSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    saveSystemPromptMutation.mutate(prompt);
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

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prompt Templates</h1>
            <p className="text-muted-foreground">
              Create and manage reusable prompt templates for your AI
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleAddTemplate}>
              <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
          </div>
        </div>
      )}

      <TemplateSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryOptions={categoryOptions}
        onAddTemplate={handleAddTemplate}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : templates.length === 0 ? (
        <EmptyTemplateState 
          hasFilters={!!(searchQuery || selectedCategory !== "all")}
          onAddTemplate={handleAddTemplate}
        />
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              categoryName={categoryOptions.find((c) => c.id === template.category)?.name || "General"}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onClone={handleCloneTemplate}
            />
          ))}
        </div>
      )}

      <SystemPromptCard 
        systemPrompt={systemPrompt}
        onSave={handleSaveSystemPrompt}
        isSaving={saveSystemPromptMutation.isPending}
      />

      <AddTemplateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveNewTemplate}
        categoryOptions={categoryOptions}
        isSaving={createTemplateMutation.isPending}
      />

      <EditTemplateDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        template={currentTemplate}
        onSave={handleSaveEditedTemplate}
        categoryOptions={categoryOptions}
        isSaving={updateTemplateMutation.isPending}
      />
    </div>
  );
};

export default PromptTemplateManager;
