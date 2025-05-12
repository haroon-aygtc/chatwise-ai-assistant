
import { useState } from "react";
import { PromptTemplate, PromptTemplateCategory } from "@/types/ai-configuration";

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [categories, setCategories] = useState<PromptTemplateCategory[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>({} as PromptTemplate);
  const [isLoading, setIsLoading] = useState(false);
  
  // Additional states required by PromptTemplateManager
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  
  const handleRefresh = () => {
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
    console.log("Deleting template:", id);
  };
  
  const handleSaveNewTemplate = (template: PromptTemplate) => {
    console.log("Saving new template:", template);
    setShowAddDialog(false);
  };
  
  const handleSaveEditedTemplate = (template: PromptTemplate) => {
    console.log("Updating template:", template);
    setShowEditDialog(false);
  };
  
  const handleCloneTemplate = (template: PromptTemplate) => {
    console.log("Cloning template:", template);
  };
  
  const refetchTemplates = async () => {
    console.log("Refetching templates...");
  };

  return {
    templates,
    categories,
    selectedTemplate,
    setSelectedTemplate,
    isLoading,
    createTemplateMutation: {
      isPending: false
    },
    updateTemplateMutation: {
      isPending: false
    },
    refetchTemplates,
    
    // Additional props required by PromptTemplateManager
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    currentTemplate,
    handleRefresh,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveNewTemplate,
    handleSaveEditedTemplate,
    handleCloneTemplate
  };
}
