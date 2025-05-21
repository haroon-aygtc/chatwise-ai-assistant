import { useState, useEffect } from "react";
import { AIModel, AIProvider, ModelConfiguration } from "@/types/ai-configuration";

export const useModelCardState = (model: AIModel) => {
  // Ensure we have a valid configuration object even if it's missing
  const config = model?.configuration || {
    temperature: 0.7,
    maxTokens: 2048,
    model: "",
  };

  // Extract initial values from the model with proper fallbacks
  const initialTemperature = config.temperature !== undefined ? Number(config.temperature) : 0.7;
  const initialMaxTokens = config.maxTokens !== undefined ? Number(config.maxTokens) : 2048;
  const initialModelId = (config.model as string) || model?.modelId || "";
  const initialBaseUrl = model?.baseUrl || "";

  // Basic state
  const [temperature, setTemperature] = useState<number>(initialTemperature);
  const [maxTokens, setMaxTokens] = useState<number>(initialMaxTokens);
  const [isActive, setIsActive] = useState(model?.isActive !== undefined ? model.isActive : true);
  const [apiKey, setApiKey] = useState(model?.apiKey || "");
  const [modelId, setModelId] = useState(initialModelId);
  const [baseUrl, setBaseUrl] = useState(initialBaseUrl);
  const [hasChanges, setHasChanges] = useState(false);

  // Use a more flexible approach to handle provider-specific properties
  const getConfigValue = <T,>(key: string, defaultValue: T): T => {
    return (config as any)[key] !== undefined ? (config as any)[key] : defaultValue;
  };

  // Provider-specific state
  const [providerSpecificState, setProviderSpecificState] = useState<
    Record<string, any>
  >(() => {
    // Initialize with provider-specific values from the model configuration
    const state: Record<string, any> = {};

    if (!model?.provider) {
      return state;
    }

    switch (model.provider) {
      case "OpenAI":
        state.organization = getConfigValue("organization", "");
        break;
      case "Google":
        state.safetySettings = getConfigValue("safetySettings", {});
        break;
      case "Anthropic":
        state.topK = getConfigValue("topK", 40);
        break;
      case "HuggingFace":
        state.task = getConfigValue("task", "text-generation");
        state.waitForModel = getConfigValue("waitForModel", false);
        break;
      case "OpenRouter":
        state.routeType = getConfigValue("routeType", "lowest-cost");
        break;
      case "Mistral":
        state.safePrompt = getConfigValue("safePrompt", false);
        break;
      case "TogetherAI":
        state.repetitionPenalty = getConfigValue("repetitionPenalty", 1.1);
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
    if (!model) {
      setHasChanges(false);
      return;
    }

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

    if (model.provider) {
      switch (model.provider) {
        case "OpenAI":
          providerSpecificChanged =
            providerSpecificState.organization !==
            getConfigValue("organization", "");
          break;
        case "Google":
          providerSpecificChanged =
            JSON.stringify(providerSpecificState.safetySettings) !==
            JSON.stringify(getConfigValue("safetySettings", {}));
          break;
        case "Anthropic":
          providerSpecificChanged =
            providerSpecificState.topK !== getConfigValue("topK", 40);
          break;
        case "HuggingFace":
          providerSpecificChanged =
            providerSpecificState.task !==
            getConfigValue("task", "text-generation") ||
            providerSpecificState.waitForModel !==
            getConfigValue("waitForModel", false);
          break;
        case "OpenRouter":
          providerSpecificChanged =
            providerSpecificState.routeType !==
            getConfigValue("routeType", "lowest-cost");
          break;
        case "Mistral":
          providerSpecificChanged =
            providerSpecificState.safePrompt !==
            getConfigValue("safePrompt", false);
          break;
        case "TogetherAI":
          providerSpecificChanged =
            providerSpecificState.repetitionPenalty !==
            getConfigValue("repetitionPenalty", 1.1);
          break;
      }
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
    config,
  ]);

  // Reset all state values to their initial values
  const handleReset = () => {
    setTemperature(initialTemperature);
    setMaxTokens(initialMaxTokens);
    setIsActive(model?.isActive !== undefined ? model.isActive : true);
    setApiKey(model?.apiKey || "");
    setModelId(initialModelId);
    setBaseUrl(initialBaseUrl);

    // Reset provider-specific state
    const resetState: Record<string, any> = {};

    if (model?.provider) {
      switch (model.provider) {
        case "OpenAI":
          resetState.organization = getConfigValue("organization", "");
          break;
        case "Google":
          resetState.safetySettings = getConfigValue("safetySettings", {});
          break;
        case "Anthropic":
          resetState.topK = getConfigValue("topK", 40);
          break;
        case "HuggingFace":
          resetState.task = getConfigValue("task", "text-generation");
          resetState.waitForModel = getConfigValue("waitForModel", false);
          break;
        case "OpenRouter":
          resetState.routeType = getConfigValue("routeType", "lowest-cost");
          break;
        case "Mistral":
          resetState.safePrompt = getConfigValue("safePrompt", false);
          break;
        case "TogetherAI":
          resetState.repetitionPenalty =
            getConfigValue("repetitionPenalty", 1.1);
          break;
      }
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
