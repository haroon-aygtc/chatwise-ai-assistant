import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Wand2, BookOpen, Zap } from "lucide-react";
import { usePromptTemplates } from "@/hooks/ai-configuration/usePromptTemplates";
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

const PromptTemplateManager = () => {
  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    systemPrompt,
    updateSystemPrompt,
  } = usePromptTemplates();

  const { models } = useAIModels();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<PromptTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isVisualBuilderOpen, setIsVisualBuilderOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isTestingOpen, setIsTestingOpen] = useState(false);

  // Filter templates based on search query and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from templates
  const categories = [
    ...new Set(templates.map((template) => template.category).filter(Boolean)),
  ];

  // Handle template creation
  const handleCreateTemplate = async (template: Partial<PromptTemplate>) => {
    await createTemplate(template);
    setIsAddDialogOpen(false);
    setIsWizardOpen(false);
    setIsVisualBuilderOpen(false);
  };

  // Handle template update
  const handleUpdateTemplate = async (template: Partial<PromptTemplate>) => {
    if (selectedTemplate) {
      await updateTemplate(selectedTemplate.id, template);
      setIsEditDialogOpen(false);
      setSelectedTemplate(null);
    }
  };

  // Handle template deletion
  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplate(id);
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

  // Handle library template selection
  const handleLibraryTemplateSelect = (template: PromptTemplate) => {
    // Create a copy without the id to treat it as a new template
    const templateCopy = {
      ...template,
      name: `${template.name} (Copy)`,
    };
    delete templateCopy.id;

    setIsLibraryOpen(false);
    setIsAddDialogOpen(true);
    // You would typically pre-fill the add dialog with this template
  };

  return (
    <div className="space-y-6">
      <TemplateManagerHeader onAddTemplate={() => setIsAddDialogOpen(true)} />

      {!isWizardOpen &&
      !isVisualBuilderOpen &&
      !isLibraryOpen &&
      !isTestingOpen ? (
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
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
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
                templates={filteredTemplates}
                isLoading={isLoading}
                onEdit={handleEditClick}
                onDelete={handleDeleteTemplate}
                onTest={handleTestClick}
              />
            </TabsContent>

            <TabsContent value="system">
              <SystemPromptCard
                systemPrompt={systemPrompt}
                onUpdate={updateSystemPrompt}
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
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Create Template with Wizard</h2>
            <Button variant="outline" onClick={() => setIsWizardOpen(false)}>
              Cancel
            </Button>
          </div>
          <TemplateWizard
            onComplete={handleCreateTemplate}
            onCancel={() => setIsWizardOpen(false)}
          />
        </div>
      ) : isVisualBuilderOpen ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Visual Template Builder</h2>
            <Button
              variant="outline"
              onClick={() => setIsVisualBuilderOpen(false)}
            >
              Cancel
            </Button>
          </div>
          <VisualTemplateBuilder onSave={handleCreateTemplate} />
        </div>
      ) : isLibraryOpen ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Template Library</h2>
            <Button variant="outline" onClick={() => setIsLibraryOpen(false)}>
              Back to Templates
            </Button>
          </div>
          <TemplateLibrary onSelectTemplate={handleLibraryTemplateSelect} />
        </div>
      ) : isTestingOpen && selectedTemplate ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Test Template</h2>
            <Button
              variant="outline"
              onClick={() => {
                setIsTestingOpen(false);
                setSelectedTemplate(null);
              }}
            >
              Back to Templates
            </Button>
          </div>
          <OneClickTesting
            template={selectedTemplate}
            aiModels={models}
            onSaveAsTemplate={(content) => {
              // Handle saving response as a new template
              const newTemplate: Partial<PromptTemplate> = {
                name: `${selectedTemplate.name} Response`,
                description: `Generated from testing ${selectedTemplate.name}`,
                template: content,
                category: selectedTemplate.category,
                variables: [],
              };
              handleCreateTemplate(newTemplate);
              setIsTestingOpen(false);
              setSelectedTemplate(null);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PromptTemplateManager;
export { PromptTemplateManager };
