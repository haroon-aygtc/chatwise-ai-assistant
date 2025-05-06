
import { useState } from 'react';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  isDefault?: boolean;
  variables?: string[];
}

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<PromptTemplate | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['General', 'Customer Support', 'Sales']);

  // Mock functions that would normally interact with an API
  const fetchTemplates = async () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTemplates([
        {
          id: '1',
          name: 'General Introduction',
          description: 'A friendly introduction for general inquiries',
          template: 'Hello! I\'m an AI assistant here to help with {{topic}}. How can I assist you today?',
          category: 'General',
          isDefault: true,
          variables: ['topic']
        },
        {
          id: '2',
          name: 'Support Greeting',
          description: 'Introduction for customer support inquiries',
          template: 'Hello {{name}}, welcome to our support! I\'ll help you resolve your issue with {{product}}.',
          category: 'Customer Support',
          variables: ['name', 'product']
        },
        {
          id: '3',
          name: 'Sales Follow-up',
          description: 'Template for sales follow-up conversations',
          template: 'Hi {{name}}, I noticed you were interested in {{product}}. Would you like more information about its {{feature}} capabilities?',
          category: 'Sales',
          variables: ['name', 'product', 'feature']
        }
      ]);
      setIsLoading(false);
    }, 800);
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setCurrentTemplate(template);
    setShowEditDialog(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    // Mock delete operation
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleSaveTemplate = async (templateData: Partial<PromptTemplate>) => {
    if (currentTemplate) {
      // Edit existing template
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? { ...t, ...templateData } as PromptTemplate : t
      ));
      setShowEditDialog(false);
      setCurrentTemplate(null);
    } else {
      // Add new template
      const newTemplate = {
        id: Date.now().toString(),
        ...templateData,
      } as PromptTemplate;
      
      setTemplates([...templates, newTemplate]);
      setShowAddDialog(false);
    }
  };

  const extractVariables = (template: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(template)) !== null) {
      variables.push(match[1].trim());
    }
    
    return [...new Set(variables)]; // Remove duplicates
  };

  return {
    templates,
    isLoading,
    currentTemplate,
    showAddDialog,
    showEditDialog,
    searchQuery,
    selectedCategory,
    categories,
    setShowAddDialog,
    setShowEditDialog,
    setSearchQuery,
    setSelectedCategory,
    handleEditTemplate,
    handleDeleteTemplate,
    handleSaveTemplate,
    fetchTemplates,
    extractVariables,
  };
}
