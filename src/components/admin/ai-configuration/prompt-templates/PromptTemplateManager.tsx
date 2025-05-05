
import { TemplateSearch } from "./TemplateSearch";
import { SystemPromptCard } from "./SystemPromptCard";
import { AddTemplateDialog } from "./AddTemplateDialog";
import { EditTemplateDialog } from "./EditTemplateDialog";
import { TemplateManagerHeader, TemplatesContent } from "./components";
import { usePromptTemplates, useSystemPrompt } from "./hooks";

export interface PromptTemplateManagerProps {
  standalone?: boolean;
}

const PromptTemplateManager = ({
  standalone = false,
}: PromptTemplateManagerProps) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentTemplate,
    templates,
    categories,
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
  } = usePromptTemplates();

  const {
    systemPrompt,
    saveSystemPromptMutation,
    handleSaveSystemPrompt,
  } = useSystemPrompt();

  const hasFilters = !!(searchQuery || selectedCategory !== "all");

  return (
    <div className="space-y-6">
      <TemplateManagerHeader
        standalone={standalone}
        onRefresh={handleRefresh}
        onAddTemplate={handleAddTemplate}
        isLoading={isLoading}
      />

      <TemplateSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryOptions={categories}
        onAddTemplate={handleAddTemplate}
      />

      <TemplatesContent
        templates={templates}
        categoryOptions={categories}
        isLoading={isLoading}
        hasFilters={hasFilters}
        onAddTemplate={handleAddTemplate}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onCloneTemplate={handleCloneTemplate}
      />

      <SystemPromptCard 
        systemPrompt={systemPrompt}
        onSave={handleSaveSystemPrompt}
        isSaving={saveSystemPromptMutation.isPending}
      />

      <AddTemplateDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveNewTemplate}
        categoryOptions={categories}
        isSaving={createTemplateMutation.isPending}
      />

      <EditTemplateDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        template={currentTemplate}
        onSave={handleSaveEditedTemplate}
        categoryOptions={categories}
        isSaving={updateTemplateMutation.isPending}
      />
    </div>
  );
};

export default PromptTemplateManager;
