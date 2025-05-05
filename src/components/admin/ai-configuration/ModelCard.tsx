
import { Card } from "@/components/ui/card";
import { AIModel } from "@/types/ai-configuration";
import { useModelCardState } from "./hooks/useModelCardState";
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
  const {
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
  } = useModelCardState(model);

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
    // Reset all values to their original state from the model
    handleTemperatureChange([model.configuration.temperature]);
    handleMaxTokensChange({ target: { value: model.configuration.maxTokens.toString() } } as React.ChangeEvent<HTMLInputElement>);
    handleActiveChange(model.isActive);
    handleApiKeyChange({ target: { value: model.apiKey || "" } } as React.ChangeEvent<HTMLInputElement>);
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
