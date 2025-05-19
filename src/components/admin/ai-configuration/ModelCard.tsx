import { Card } from "@/components/ui/card";
import { AIModel, ModelConfiguration } from "@/types/ai-configuration";
import { useState, useEffect } from "react";
import {
  ModelCardHeader,
  ModelCardContent,
  ModelCardFooter,
} from "./components/model-card";
import { useModelCardState } from "./hooks/useModelCardState";

interface ModelCardProps {
  model: AIModel;
  onUpdate: (id: string, updates: Partial<AIModel>) => Promise<any>;
  isUpdating?: boolean;
}

export const ModelCard = ({
  model,
  onUpdate,
  isUpdating = false,
}: ModelCardProps) => {
  const {
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
  } = useModelCardState(model);

  const handleTemperatureChange = (values: number[]) => {
    setTemperature(values[0]);
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setMaxTokens(value);
    }
  };

  const handleActiveChange = (value: boolean) => {
    setIsActive(value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleModelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelId(e.target.value);
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl(e.target.value);
  };

  const createUpdatedConfiguration = (): ModelConfiguration => {
    // Start with the base configuration properties
    const updatedConfig: any = {
      ...model.configuration,
      temperature,
      maxTokens,
    };

    // Add the model ID if it exists
    if (modelId) {
      updatedConfig.model = modelId;
    }

    // Add provider-specific properties
    switch (model.provider) {
      case "OpenAI":
        if (providerSpecificState.organization) {
          updatedConfig.organization = providerSpecificState.organization;
        }
        break;
      case "Google":
        if (providerSpecificState.safetySettings) {
          updatedConfig.safetySettings = providerSpecificState.safetySettings;
        }
        break;
      case "Anthropic":
        if (providerSpecificState.topK) {
          updatedConfig.topK = providerSpecificState.topK;
        }
        break;
      case "HuggingFace":
        if (providerSpecificState.task) {
          updatedConfig.task = providerSpecificState.task;
        }
        if (providerSpecificState.waitForModel !== undefined) {
          updatedConfig.waitForModel = providerSpecificState.waitForModel;
        }
        break;
      case "OpenRouter":
        if (providerSpecificState.routeType) {
          updatedConfig.routeType = providerSpecificState.routeType;
        }
        break;
      case "Mistral":
        if (providerSpecificState.safePrompt !== undefined) {
          updatedConfig.safePrompt = providerSpecificState.safePrompt;
        }
        break;
      case "TogetherAI":
        if (providerSpecificState.repetitionPenalty) {
          updatedConfig.repetitionPenalty =
            providerSpecificState.repetitionPenalty;
        }
        break;
    }

    return updatedConfig;
  };

  const handleApply = async () => {
    const updatedConfiguration = createUpdatedConfiguration();

    await onUpdate(model.id, {
      isActive,
      apiKey: apiKey || undefined,
      baseUrl: baseUrl || undefined,
      configuration: updatedConfiguration,
    });
  };

  return (
    <Card className={isActive ? "border-primary/50" : ""}>
      <ModelCardHeader
        model={model}
        isActive={isActive}
        onActiveChange={handleActiveChange}
      />
      <ModelCardContent
        model={model}
        temperature={temperature}
        maxTokens={maxTokens}
        apiKey={apiKey}
        modelId={modelId}
        baseUrl={baseUrl}
        providerSpecificState={providerSpecificState}
        onTemperatureChange={handleTemperatureChange}
        onMaxTokensChange={handleMaxTokensChange}
        onApiKeyChange={handleApiKeyChange}
        onModelIdChange={handleModelIdChange}
        onBaseUrlChange={handleBaseUrlChange}
        updateProviderSpecificState={updateProviderSpecificState}
      />
      <ModelCardFooter
        hasChanges={hasChanges}
        isUpdating={isUpdating}
        onReset={handleReset}
        onApply={handleApply}
      />
    </Card>
  );
};
