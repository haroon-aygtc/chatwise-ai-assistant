
import { useState } from "react";
import { PromptTemplate, PromptTemplateCategory } from "@/types/ai-configuration";

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [categories, setCategories] = useState<PromptTemplateCategory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    // Implementation would fetch templates from an API
    console.log("Refreshing templates...");
  };

  const handleAddTemplate = () => {
    setShowAddDialog(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    // Implementation would delete the template
    console.log(`Deleting template ${id}...`);
  };

  const handleSaveNewTemplate = (template: Omit<PromptTemplate, "id">) => {
    // Implementation would save the new template
    console.log("Saving new template...", template);
    setShowAddDialog(false);
  };

  const handleSaveEditedTemplate = (template: PromptTemplate) => {
    // Implementation would save the edited template
    console.log("Saving edited template...", template);
    setShowEditDialog(false);
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    // Implementation would clone the template
    console.log("Cloning template...", template);
  };

  return {
    templates,
    categories,
    selectedTemplate,
    setSelectedTemplate,
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
    handleRefresh,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveNewTemplate,
    handleSaveEditedTemplate,
    handleCloneTemplate,
    createTemplateMutation: {
      isPending: false,
    },
    updateTemplateMutation: {
      isPending: false,
    },
    refetchTemplates: async () => {
      // Implementation would refetch templates
      console.log("Refetching templates...");
    }
  };
}
