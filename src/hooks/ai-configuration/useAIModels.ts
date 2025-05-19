import { useState, useEffect, useCallback } from 'react';
import { AIModel, AIProvider } from '@/types/ai-configuration';
import * as aiModelService from '@/services/ai-configuration/aiModelService';
import { toast } from '@/components/ui/use-toast';

export const useAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all models
  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiModelService.getAllModels();
      setModels(data);
    } catch (err) {
      setError('Failed to fetch AI models');
      toast({
        title: 'Error',
        description: 'Failed to fetch AI models. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch models by provider
  const fetchModelsByProvider = useCallback(async (provider: AIProvider) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiModelService.getModelsByProvider(provider);
      setModels(data);
    } catch (err) {
      setError(`Failed to fetch ${provider} models`);
      toast({
        title: 'Error',
        description: `Failed to fetch ${provider} models. Please try again.`,
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new model
  const createModel = useCallback(async (model: Omit<AIModel, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsUpdating(true);
    try {
      const newModel = await aiModelService.createModel(model);
      setModels(prev => [...prev, newModel]);
      toast({
        title: 'Success',
        description: `${model.name} has been added successfully.`,
      });
      return newModel;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create AI model. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Update an existing model
  const updateModel = useCallback(async (id: string, updates: Partial<AIModel>) => {
    setIsUpdating(true);
    try {
      const updatedModel = await aiModelService.updateModel(id, updates);
      setModels(prev => prev.map(model => model.id === id ? updatedModel : model));
      toast({
        title: 'Success',
        description: 'Model updated successfully.',
      });
      return updatedModel;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update AI model. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete a model
  const deleteModel = useCallback(async (id: string) => {
    setIsUpdating(true);
    try {
      await aiModelService.deleteModel(id);
      setModels(prev => prev.filter(model => model.id !== id));
      toast({
        title: 'Success',
        description: 'Model deleted successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete AI model. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Set a model as default
  const setDefaultModel = useCallback(async (id: string) => {
    setIsUpdating(true);
    try {
      const updatedModel = await aiModelService.setDefaultModel(id);
      setModels(prev => prev.map(model => ({
        ...model,
        isDefault: model.id === id
      })));
      toast({
        title: 'Success',
        description: 'Default model set successfully.',
      });
      return updatedModel;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to set default model. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Test a model with a prompt
  const testModel = useCallback(async (id: string, prompt: string, options?: Record<string, unknown>) => {
    try {
      return await aiModelService.testModel(id, prompt, options);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to test AI model. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      throw err;
    }
  }, []);

  // Validate API key for a provider
  const validateApiKey = useCallback(async (provider: AIProvider, apiKey: string, baseUrl?: string) => {
    try {
      return await aiModelService.validateProviderApiKey(provider, apiKey, baseUrl);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to validate API key. Please try again.',
        variant: 'destructive',
      });
      console.error(err);
      return false;
    }
  }, []);

  // Load models on component mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    isLoading,
    error,
    isUpdating,
    fetchModels,
    fetchModelsByProvider,
    createModel,
    updateModel,
    deleteModel,
    setDefaultModel,
    testModel,
    validateApiKey
  };
};
