import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wand2, BookOpen, Zap } from "lucide-react";
import { usePromptTemplates } from "@/hooks/ai-configuration/usePromptTemplates";
import { useToast } from "@/components/ui/use-toast";
import { PromptTemplate } from "@/types/ai-configuration";
import { TemplateCard } from "./TemplateCard";
import { SystemPromptCard } from "./SystemPromptCard";
import { AddTemplateDialog } from "./AddTemplateDialog";
import { EditTemplateDialog } from "./EditTemplateDialog";
import { EmptyTemplateState } from "./EmptyTemplateState";
import { TemplateSearch } from "./TemplateSearch";
import { TemplateManagerHeader } from "./components/TemplateManagerHeader";
import { TemplatesContent } from "./components/TemplatesContent";
import VisualTemplateBuilder from "./VisualTemplateBuilder";
import TemplateWizard from "./TemplateWizard";
import TemplateLibrary from "./TemplateLibrary";
import OneClickTesting from "./OneClickTesting";
import { useAIModels } from "@/hooks/ai-configuration/useAIModels";

/**
 * PromptTemplateManager - Main component for prompt template management
 * 
 * Features:
 * - View, create, edit, clone, and delete templates
 * - Filter and search templates
 * - Template testing functionality
 * - Visual template builder
 * - Template library
 * - System prompt management
 */
const PromptTemplateManager = () => {
  const { toast } = useToast();
  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    systemPrompt,
    updateSystemPrompt,
    trackTemplateUsage,
    handleCloneTemplate,
    updateFilters,
    filters,
  } = usePromptTemplates();

  const { models } = useAIModels();

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isVisualBuilderOpen, setIsVisualBuilderOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isTestingOpen, setIsTestingOpen] = useState(false);

  // Handle UI error states
  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Failed to load templates</h3>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  // Handle template creation
  const handleCreateTemplate = async (template: Partial<PromptTemplate>) => {
    try {
      await createTemplate(template);
      toast({
        title: "Template created",
        description: "Your template has been successfully created.",
      });
      setIsAddDialogOpen(false);
      setIsWizardOpen(false);
      setIsVisualBuilderOpen(false);
    } catch (error) {
      toast({
        title: "Error creating template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle template update
  const handleUpdateTemplate = async (template: Partial<PromptTemplate>) => {
    if (!selectedTemplate) return;

    try {
      await updateTemplate(selectedTemplate.id, template);
      toast({
        title: "Template updated",
        description: "Your template has been successfully updated.",
      });
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      toast({
        title: "Error updating template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast({
        title: "Template deleted",
        description: "Your template has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error deleting template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEditClick = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  // Handle test button click
  const handleTestClick = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setIsTestingOpen(true);
  };

  // Handle setting a template as default
  const handleSetDefault = async (template: PromptTemplate) => {
    try {
      await updateTemplate(template.id, { isDefault: true });
      toast({
        title: "Default template set",
        description: `"${template.name}" is now the default template.`,
      });
    } catch (error) {
      toast({
        title: "Error setting default template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle cloning a template
  const handleCloneClick = async (template: PromptTemplate) => {
    try {
      const clonedTemplate = await handleCloneTemplate(template);
      toast({
        title: "Template cloned",
        description: `"${template.name}" has been cloned.`,
      });
      return clonedTemplate;
    } catch (error) {
      toast({
        title: "Error cloning template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle template use in testing
  const handleTemplateUse = async (templateId: string) => {
    try {
      await trackTemplateUsage(templateId);
    } catch (error) {
      console.error("Error tracking template usage:", error);
    }
  };

  // Handle system prompt update
  const handleSystemPromptUpdate = async (content: string) => {
    try {
      await updateSystemPrompt(content);
      toast({
        title: "System prompt updated",
        description: "The system prompt has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error updating system prompt",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle search and filter changes
  const handleSearchChange = (search: string) => {
    updateFilters({ search });
  };

  const handleCategoryChange = (category: string | null) => {
    updateFilters({ category });
  };

  // Main render function
  return (
    <div className="space-y-6">
      <TemplateManagerHeader onAddTemplate={() => setIsAddDialogOpen(true)} />

      {!isWizardOpen && !isVisualBuilderOpen && !isLibraryOpen && !isTestingOpen ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => setIsWizardOpen(true)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Template Wizard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create a new template using our step-by-step wizard with
                  pre-built templates
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => setIsVisualBuilderOpen(true)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M3 3h18v18H3z" />
                    <path d="M9 3v18" />
                    <path d="M3 9h18" />
                  </svg>
                  Visual Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build templates visually with drag-and-drop blocks and
                  variable management
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => setIsLibraryOpen(true)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Template Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse and use pre-built templates for common use cases
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="templates">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="system">System Prompt</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <div className="flex justify-between items-center">
                <TemplateSearch
                  searchQuery={filters.search || ""}
                  onSearchChange={handleSearchChange}
                  categories={[...new Set(templates.map(t => t.category).filter(Boolean))]}
                  selectedCategory={filters.category || null}
                  onCategoryChange={handleCategoryChange}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsLibraryOpen(true)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> Browse Library
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Template
                  </Button>
                </div>
              </div>

              <TemplatesContent
                templates={templates}
                isLoading={isLoading}
                onEdit={handleEditClick}
                onDelete={handleDeleteTemplate}
                onTest={handleTestClick}
                onClone={handleCloneClick}
                onSetDefault={handleSetDefault}
              />
            </TabsContent>

            <TabsContent value="system">
              <SystemPromptCard
                systemPrompt={systemPrompt}
                onUpdate={handleSystemPromptUpdate}
              />
            </TabsContent>
          </Tabs>

          <AddTemplateDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleCreateTemplate}
          />

          {selectedTemplate && (
            <EditTemplateDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              template={selectedTemplate}
              onSubmit={handleUpdateTemplate}
            />
          )}
        </>
      ) : isWizardOpen ? (
        <TemplateWizard
          onClose={() => setIsWizardOpen(false)}
          onCreateTemplate={handleCreateTemplate}
        />
      ) : isVisualBuilderOpen ? (
        <VisualTemplateBuilder
          onClose={() => setIsVisualBuilderOpen(false)}
          onCreateTemplate={handleCreateTemplate}
        />
      ) : isLibraryOpen ? (
        <TemplateLibrary
          onClose={() => setIsLibraryOpen(false)}
          onSelectTemplate={handleCreateTemplate}
        />
      ) : isTestingOpen && selectedTemplate ? (
        <OneClickTesting
          template={selectedTemplate}
          models={models}
          onClose={() => {
            setIsTestingOpen(false);
            setSelectedTemplate(null);
          }}
          onUse={() => handleTemplateUse(selectedTemplate.id)}
        />
      ) : null}
    </div>
  );
};

export default PromptTemplateManager;
export { PromptTemplateManager };
