
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/services/api/base';

interface SystemPrompt {
  id: string;
  content: string;
  isDefault: boolean;
  lastUpdated: string;
}

export const useSystemPrompt = () => {
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Create a mock mutation state
  const saveSystemPromptMutation = { isPending: false };
  
  const fetchSystemPrompt = useCallback(async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call when backend is ready
      const response = await ApiService.get<SystemPrompt>('/ai-configuration/system-prompt');
      setSystemPrompt(response);
      return response;
    } catch (error) {
      console.error('Error fetching system prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system prompt',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const saveSystemPrompt = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      // Replace with actual API call when backend is ready
      const response = await ApiService.put<SystemPrompt>('/ai-configuration/system-prompt', { content });
      setSystemPrompt(response);
      toast({
        title: 'Success',
        description: 'System prompt saved successfully',
      });
      return response;
    } catch (error) {
      console.error('Error saving system prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to save system prompt',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Handler for component
  const handleSaveSystemPrompt = (content: string) => {
    saveSystemPrompt(content);
  };
  
  return {
    systemPrompt,
    isLoading,
    saveSystemPromptMutation,
    fetchSystemPrompt,
    saveSystemPrompt,
    handleSaveSystemPrompt
  };
};
