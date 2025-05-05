
import { useState } from "react";
import { AIModel } from "@/types/ai-configuration";

export const useModelCardState = (model: AIModel) => {
  const [temperature, setTemperature] = useState(
    model.configuration.temperature,
  );
  const [maxTokens, setMaxTokens] = useState(model.configuration.maxTokens);
  const [isActive, setIsActive] = useState(model.isActive);
  const [apiKey, setApiKey] = useState(model.apiKey || "");
  const [hasChanges, setHasChanges] = useState(false);

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
    setHasChanges(true);
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxTokens(value);
    setHasChanges(true);
  };

  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
    setHasChanges(true);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setHasChanges(true);
  };

  return {
    temperature,
    maxTokens,
    isActive,
    apiKey,
    hasChanges,
    handleTemperatureChange,
    handleMaxTokensChange,
    handleActiveChange,
    handleApiKeyChange,
    setHasChanges,
  };
};
