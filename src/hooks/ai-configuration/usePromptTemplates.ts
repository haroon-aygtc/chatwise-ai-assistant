
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as promptTemplateService from '@/services/ai-configuration/promptTemplateService';
import { PromptTemplate, PromptTemplateCategory } from '@/types/ai-configuration';

export const usePromptTemplates = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [categories, setCategories] = useState<PromptTemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  
  // Create mutations state for React Query compatibility
  const createTemplateMutation = { isPending: isSubmitting };
  const updateTemplateMutation = { isPending: isSubmitting };
  
  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const templatesData = await promptTemplateService.getAllTemplates();
      setTemplates(templatesData);
      
      const categoriesData = await promptTemplateService.getCategories();
      setCategories(categoriesData);
      
      return templatesData;
    } catch (error) {
      console.error('Error fetching prompt templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prompt templates',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const createTemplate = useCallback(async (template: Omit<PromptTemplate, 'id'>) => {
    try {
      setIsSubmitting(true);
      const newTemplate = await promptTemplateService.createTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
      return newTemplate;
    } catch (error) {
      console.error('Error creating prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create template',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);
  
  const updateTemplate = useCallback(async (id: string, templateData: Partial<PromptTemplate>) => {
    try {
      setIsSubmitting(true);
      const updatedTemplate = await promptTemplateService.updateTemplate(id, templateData);
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);
  
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setIsSubmitting(true);
      await promptTemplateService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      return true;
    } catch (error) {
      console.error('Error deleting prompt template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  // Handler functions for the PromptTemplateManager component
  const handleRefresh = () => {
    fetchTemplates();
  };

  const handleAddTemplate = () => {
    setShowAddDialog(true);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
  };

  const handleSaveNewTemplate = (templateData: Omit<PromptTemplate, 'id'>) => {
    createTemplate(templateData);
    setShowAddDialog(false);
  };

  const handleSaveEditedTemplate = (templateData: Partial<PromptTemplate>) => {
    if (currentTemplate) {
      updateTemplate(currentTemplate.id, templateData);
      setShowEditDialog(false);
    }
  };

  const handleCloneTemplate = (template: PromptTemplate) => {
    const clonedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      isDefault: false
    };
    delete clonedTemplate.id;
    createTemplate(clonedTemplate as Omit<PromptTemplate, 'id'>);
  };

  return {
    templates,
    categories,
    isLoading,
    isSubmitting,
    currentTemplate,
    setCurrentTemplate,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAddDialog, 
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
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
