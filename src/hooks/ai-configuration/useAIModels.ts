import { useState, useEffect, useRef } from "react";
import { AIModel, RoutingRule } from "@/types/ai-configuration";
import * as aiModelService from "@/services/ai-configuration/aiModelService";

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const isMounted = useRef(false);
  const fetchInProgress = useRef(false);

  // Fetch models and routing rules
  const fetchData = async (force = false) => {
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current && !force) return;

    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedModels, fetchedRules] = await Promise.all([
        aiModelService.getAllModels(),
        aiModelService.getRoutingRules()
      ]);

      // Only update state if component is still mounted
      if (isMounted.current) {
        setModels(fetchedModels);
        setRoutingRules(fetchedRules);
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error fetching AI models and routing rules:", err);
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error("Failed to load AI models and routing rules"));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
      fetchInProgress.current = false;
    }
  };

  // Initial fetch
  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update model
  const updateModel = async (updatedModel: Partial<AIModel>) => {
    try {
      if (!updatedModel.id) {
        throw new Error("Model ID is required for update");
      }

      // Update the model in the backend
      await aiModelService.updateModel(updatedModel.id, updatedModel);

      // Update local state
      setModels(prevModels =>
        prevModels.map(model =>
          model.id === updatedModel.id ? { ...model, ...updatedModel } : model
        )
      );

      setHasChanges(true);
      return true;
    } catch (err) {
      console.error("Error updating model:", err);
      setError(err instanceof Error ? err : new Error("Failed to update model"));
      return false;
    }
  };

  // Update routing rules
  const updateRoutingRules = async (rules: RoutingRule[]) => {
    try {
      // Process each rule that needs updating
      await Promise.all(
        rules.map(rule => aiModelService.updateRoutingRule(rule.id, rule))
      );

      setRoutingRules(rules);
      setHasChanges(true);
      return true;
    } catch (err) {
      console.error("Error updating routing rules:", err);
      setError(err instanceof Error ? err : new Error("Failed to update routing rules"));
      return false;
    }
  };

  // Add routing rule
  const addRoutingRule = async (rule: Omit<RoutingRule, "id">) => {
    try {
      const newRule = await aiModelService.createRoutingRule(rule);
      setRoutingRules(prevRules => [...prevRules, newRule]);
      setHasChanges(true);
      return newRule;
    } catch (err) {
      console.error("Error adding routing rule:", err);
      setError(err instanceof Error ? err : new Error("Failed to add routing rule"));
      throw err;
    }
  };

  // Delete routing rule
  const deleteRoutingRule = async (id: string) => {
    try {
      await aiModelService.deleteRoutingRule(id);
      setRoutingRules(prevRules => prevRules.filter(rule => rule.id !== id));
      setHasChanges(true);
    } catch (err) {
      console.error("Error deleting routing rule:", err);
      setError(err instanceof Error ? err : new Error("Failed to delete routing rule"));
      throw err;
    }
  };

  // Save all changes
  const saveAllChanges = async () => {
    try {
      setIsSaving(true);
      // Here you could implement a batch save operation if your API supports it
      // For now, we'll just mark as saved
      setHasChanges(false);
      return true;
    } catch (err) {
      console.error("Error saving changes:", err);
      setError(err instanceof Error ? err : new Error("Failed to save changes"));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Reset error state
  const clearError = () => {
    setError(null);
  };

  return {
    models,
    routingRules,
    isLoading,
    isSaving,
    error,
    updateModel,
    updateRoutingRules,
    addRoutingRule,
    deleteRoutingRule,
    saveAllChanges,
    refreshData: (force = true) => fetchData(force),
    hasChanges,
    clearError,
  };
}
