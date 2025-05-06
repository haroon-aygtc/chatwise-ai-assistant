
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as promptTemplateService from '@/services/ai-configuration/promptTemplateService';
import { PromptTemplate, PromptTemplateCategory } from '@/types/ai-configuration';

export const usePromptTemplates = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [categories, setCategories] = useState<PromptTemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await promptTemplateService.getAllTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prompt templates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await promptTemplateService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const createTemplate = useCallback(async (template: Omit<PromptTemplate, 'id'>) => {
    try {
      setIsSubmitting(true);
      await promptTemplateService.createTemplate(template);
      toast({
        title: 'Success',
        description: 'Prompt template created successfully',
      });
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create prompt template',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchTemplates, toast]);

  const updateTemplate = useCallback(async (id: string, template: Partial<PromptTemplate>) => {
    try {
      setIsSubmitting(true);
      await promptTemplateService.updateTemplate(id, template);
      toast({
        title: 'Success',
        description: 'Prompt template updated successfully',
      });
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prompt template',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchTemplates, toast]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setIsSubmitting(true);
      await promptTemplateService.deleteTemplate(id);
      toast({
        title: 'Success',
        description: 'Prompt template deleted successfully',
      });
      await fetchTemplates();
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prompt template',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchTemplates, toast]);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [fetchTemplates, fetchCategories]);

  return {
    templates,
    categories,
    isLoading,
    isSubmitting,
    currentTemplate,
    setCurrentTemplate,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
