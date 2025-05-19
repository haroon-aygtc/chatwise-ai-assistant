import { useState, useEffect } from "react";
import { AIModel } from "@/types/ai-configuration";

export const useModelCardState = (model: AIModel) => {
  // Extract initial values from the model
  const initialTemperature = Number(model.configuration.temperature) || 0.7;
  const initialMaxTokens = Number(model.configuration.maxTokens) || 2048;
  const initialModelId =
    (model.configuration.model as string) || model.modelId || "";
  const initialBaseUrl = model.baseUrl || "";

  // Basic state
  const [temperature, setTemperature] = useState<number>(initialTemperature);
  const [maxTokens, setMaxTokens] = useState<number>(initialMaxTokens);
  const [isActive, setIsActive] = useState(model.isActive);
  const [apiKey, setApiKey] = useState(model.apiKey || "");
  const [modelId, setModelId] = useState(initialModelId);
  const [baseUrl, setBaseUrl] = useState(initialBaseUrl);
  const [hasChanges, setHasChanges] = useState(false);

  // Provider-specific state
  const [providerSpecificState, setProviderSpecificState] = useState<
    Record<string, any>
  >(() => {
    // Initialize with provider-specific values from the model configuration
    const state: Record<string, any> = {};

    switch (model.provider) {
      case "OpenAI":
        state.organization = model.configuration.organization || "";
        break;
      case "Google":
        state.safetySettings = model.configuration.safetySettings || {};
        break;
      case "Anthropic":
        state.topK = model.configuration.topK || 40;
        break;
      case "HuggingFace":
        state.task = model.configuration.task || "text-generation";
        state.waitForModel = model.configuration.waitForModel || false;
        break;
      case "OpenRouter":
        state.routeType = model.configuration.routeType || "lowest-cost";
        break;
      case "Mistral":
        state.safePrompt = model.configuration.safePrompt || false;
        break;
      case "TogetherAI":
        state.repetitionPenalty = model.configuration.repetitionPenalty || 1.1;
        break;
    }

    return state;
  });

  // Update a specific property in the provider-specific state
  const updateProviderSpecificState = (key: string, value: any) => {
    setProviderSpecificState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Check for changes in any state values
  useEffect(() => {
    const temperatureChanged = temperature !== initialTemperature;
    const maxTokensChanged = maxTokens !== initialMaxTokens;
    const activeChanged = isActive !== model.isActive;
    const apiKeyChanged =
      (apiKey !== "" && apiKey !== model.apiKey) ||
      (apiKey === "" && model.apiKey !== undefined);
    const modelIdChanged = modelId !== initialModelId;
    const baseUrlChanged = baseUrl !== initialBaseUrl;

    // Check for changes in provider-specific state
    let providerSpecificChanged = false;

    switch (model.provider) {
      case "OpenAI":
        providerSpecificChanged =
          providerSpecificState.organization !==
          (model.configuration.organization || "");
        break;
      case "Google":
        providerSpecificChanged =
          JSON.stringify(providerSpecificState.safetySettings) !==
          JSON.stringify(model.configuration.safetySettings || {});
        break;
      case "Anthropic":
        providerSpecificChanged =
          providerSpecificState.topK !== (model.configuration.topK || 40);
        break;
      case "HuggingFace":
        providerSpecificChanged =
          providerSpecificState.task !==
            (model.configuration.task || "text-generation") ||
          providerSpecificState.waitForModel !==
            (model.configuration.waitForModel || false);
        break;
      case "OpenRouter":
        providerSpecificChanged =
          providerSpecificState.routeType !==
          (model.configuration.routeType || "lowest-cost");
        break;
      case "Mistral":
        providerSpecificChanged =
          providerSpecificState.safePrompt !==
          (model.configuration.safePrompt || false);
        break;
      case "TogetherAI":
        providerSpecificChanged =
          providerSpecificState.repetitionPenalty !==
          (model.configuration.repetitionPenalty || 1.1);
        break;
    }

    setHasChanges(
      temperatureChanged ||
        maxTokensChanged ||
        activeChanged ||
        apiKeyChanged ||
        modelIdChanged ||
        baseUrlChanged ||
        providerSpecificChanged,
    );
  }, [
    temperature,
    maxTokens,
    isActive,
    apiKey,
    modelId,
    baseUrl,
    providerSpecificState,
    model,
    initialTemperature,
    initialMaxTokens,
    initialModelId,
    initialBaseUrl,
  ]);

  // Reset all state values to their initial values
  const handleReset = () => {
    setTemperature(initialTemperature);
    setMaxTokens(initialMaxTokens);
    setIsActive(model.isActive);
    setApiKey(model.apiKey || "");
    setModelId(initialModelId);
    setBaseUrl(initialBaseUrl);

    // Reset provider-specific state
    const resetState: Record<string, any> = {};

    switch (model.provider) {
      case "OpenAI":
        resetState.organization = model.configuration.organization || "";
        break;
      case "Google":
        resetState.safetySettings = model.configuration.safetySettings || {};
        break;
      case "Anthropic":
        resetState.topK = model.configuration.topK || 40;
        break;
      case "HuggingFace":
        resetState.task = model.configuration.task || "text-generation";
        resetState.waitForModel = model.configuration.waitForModel || false;
        break;
      case "OpenRouter":
        resetState.routeType = model.configuration.routeType || "lowest-cost";
        break;
      case "Mistral":
        resetState.safePrompt = model.configuration.safePrompt || false;
        break;
      case "TogetherAI":
        resetState.repetitionPenalty =
          model.configuration.repetitionPenalty || 1.1;
        break;
    }

    setProviderSpecificState(resetState);
    setHasChanges(false);
  };

  return {
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    isActive,
    setIsActive,
    apiKey,
    setApiKey,
    modelId,
    setModelId,
    baseUrl,
    setBaseUrl,
    providerSpecificState,
    updateProviderSpecificState,
    hasChanges,
    handleReset,
  };
};
