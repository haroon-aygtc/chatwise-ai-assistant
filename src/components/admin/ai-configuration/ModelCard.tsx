
import { Card } from "@/components/ui/card";
import { AIModel } from "@/types/ai-configuration";
import { useState, useEffect } from "react";
import { 
  ModelCardHeader, 
  ModelCardContent, 
  ModelCardFooter 
} from "./components/model-card";

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
  // Cast configuration values to numbers to ensure proper typing
  const initialTemperature = Number(model.configuration.temperature) || 0.7;
  const initialMaxTokens = Number(model.configuration.maxTokens) || 2048;
  
  const [temperature, setTemperature] = useState<number>(initialTemperature);
  const [maxTokens, setMaxTokens] = useState<number>(initialMaxTokens);
  const [isActive, setIsActive] = useState(model.isActive);
  const [apiKey, setApiKey] = useState(model.apiKey || "");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if any values have changed from their initial state
    const temperatureChanged = temperature !== initialTemperature;
    const maxTokensChanged = maxTokens !== initialMaxTokens;
    const activeChanged = isActive !== model.isActive;
    const apiKeyChanged = 
      (apiKey !== "" && apiKey !== model.apiKey) || 
      (apiKey === "" && model.apiKey !== undefined);

    setHasChanges(temperatureChanged || maxTokensChanged || activeChanged || apiKeyChanged);
  }, [temperature, maxTokens, isActive, apiKey, model, initialTemperature, initialMaxTokens]);

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

  const handleApply = async () => {
    await onUpdate(model.id, {
      isActive,
      apiKey: apiKey || undefined,
      configuration: {
        ...model.configuration,
        temperature,
        maxTokens,
      },
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setTemperature(initialTemperature);
    setMaxTokens(initialMaxTokens);
    setIsActive(model.isActive);
    setApiKey(model.apiKey || "");
    setHasChanges(false);
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
        onTemperatureChange={handleTemperatureChange}
        onMaxTokensChange={handleMaxTokensChange}
        onApiKeyChange={handleApiKeyChange}
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
