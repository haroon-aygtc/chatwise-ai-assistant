import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PromptTemplate } from '@/types/ai-configuration';

/**
 * A hook for managing AI prompt templates
 */
export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch templates (mock data for now)
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This would be replaced with an API call
        const mockTemplates: PromptTemplate[] = [
          {
            id: 'template-1',
            name: 'Customer Support',
            description: 'Template for customer support interactions',
            content: 'You are a helpful customer support assistant for {{company_name}}. Help the user with their inquiry about {{product_name}}.',
            variables: ['company_name', 'product_name'],
            category: 'support',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'template-2',
            name: 'Product Information',
            description: 'Template for product information requests',
            content: 'Provide detailed information about {{product_name}}, including features, pricing, and availability.',
            variables: ['product_name'],
            category: 'product',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        setTemplates(mockTemplates);
      } catch (err) {
        console.error('Error fetching prompt templates:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch prompt templates'));

        toast({
          title: 'Error',
          description: 'Failed to load prompt templates. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [toast]);

  // Create new template
  const createTemplate = async (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // This would be an API call in a real implementation
      const newTemplate: PromptTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTemplates(prev => [...prev, newTemplate]);

      toast({
        title: 'Success',
        description: 'Prompt template created successfully',
      });

      return newTemplate;
    } catch (err) {
      console.error('Error creating prompt template:', err);

      toast({
        title: 'Error',
        description: 'Failed to create prompt template',
        variant: 'destructive',
      });

      throw err;
    }
  };

  // Update template
  const updateTemplate = async (id: string, updates: Partial<PromptTemplate>) => {
    try {
      // This would be an API call in a real implementation
      setTemplates(prev =>
        prev.map(template =>
          template.id === id
            ? {
              ...template,
              ...updates,
              updatedAt: new Date().toISOString()
            }
            : template
        )
      );

      toast({
        title: 'Success',
        description: 'Prompt template updated successfully',
      });
    } catch (err) {
      console.error('Error updating prompt template:', err);

      toast({
        title: 'Error',
        description: 'Failed to update prompt template',
        variant: 'destructive',
      });

      throw err;
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    try {
      // This would be an API call in a real implementation
      setTemplates(prev => prev.filter(template => template.id !== id));

      toast({
        title: 'Success',
        description: 'Prompt template deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting prompt template:', err);

      toast({
        title: 'Error',
        description: 'Failed to delete prompt template',
        variant: 'destructive',
      });

      throw err;
    }
  };

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

export default usePromptTemplates;
