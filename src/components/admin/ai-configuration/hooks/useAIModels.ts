
import { useState } from "react";
import { AIModel, RoutingRule } from "@/types/ai-configuration";

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: "model-1",
      name: "ChatGPT-4",
      description: "OpenAI's GPT-4 Model",
      provider: "OpenAI",
      version: "4.0",
      maxTokens: 1000,
      temperature: 0.7,
      isActive: true,
      configuration: {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
    {
      id: "model-2",
      name: "Gemini-Pro",
      description: "Google's Gemini Pro Model",
      provider: "Google",
      version: "Pro",
      maxTokens: 1000,
      temperature: 0.6,
      isActive: true,
      configuration: {
        temperature: 0.6,
        maxTokens: 1000,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },
  ]);

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    {
      id: "rule-1",
      name: "Legal Routing",
      modelId: "model-1",
      description: "Route legal queries to ChatGPT-4",
      conditions: [
        {
          field: "message",
          operator: "contains",
          value: "legal",
        },
      ],
      priority: 1,
    },
  ]);

  return {
    models,
    routingRules,
    isLoading: false,
    isSaving: false,
    error: null,
    updateModel: (updatedModel: Partial<AIModel>) => {
      setModels((prev) =>
        prev.map((m) => (m.id === updatedModel.id ? { ...m, ...updatedModel } : m))
      );
      return Promise.resolve(true);
    },
    updateRoutingRules: (rules: RoutingRule[]) => {
      setRoutingRules(rules);
      return Promise.resolve(true);
    },
    addRoutingRule: (rule: Omit<RoutingRule, "id">) => {
      const newRule = {
        id: `rule-${routingRules.length + 1}`,
        ...rule,
      };
      setRoutingRules((prev) => [...prev, newRule]);
      return newRule;
    },
    deleteRoutingRule: (id: string) => {
      setRoutingRules((prev) => prev.filter((r) => r.id !== id));
      return Promise.resolve();
    },
    saveAllChanges: async () => {
      console.log("Saving models & rules...");
      return true;
    },
    refreshData: () => {
      console.log("Refreshing data...");
    },
    hasChanges: true,
  };
}
