import { Card } from "@/components/ui/card";
import { AIModel, ModelConfiguration } from "@/types/ai-configuration";
import { useState, useEffect } from "react";
import {
  ModelCardHeader,
  ModelCardContent,
  ModelCardFooter,
} from "./components/model-card";
import { useModelCardState } from "./hooks/useModelCardState";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModelCardProps {
  model: AIModel;
  onUpdate: (updatedModel: Partial<AIModel>) => Promise<any>;
  isUpdating?: boolean;
  onTest?: (model: AIModel) => void;
}

export const ModelCard = ({
  model,
  onUpdate,
  isUpdating = false,
  onTest,
}: ModelCardProps) => {
  const { toast } = useToast();
  const [showTestButton, setShowTestButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate model before rendering
  if (!model || !model.id) {
    return (
      <Card className="border border-red-300 bg-red-50 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Invalid Model</AlertTitle>
          <AlertDescription>
            The model data is incomplete or invalid. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  // Clear any previous errors
  useEffect(() => {
    setError(null);
  }, [model.id]);

  try {
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

    // Show test button on hover
    useEffect(() => {
      // Only show test button if isActive is true and we have an apiKey
      const canTest = isActive && Boolean(apiKey || model.apiKey);
      setShowTestButton(canTest);
    }, [isActive, apiKey, model.apiKey]);

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
      // Ensure we have a valid starting configuration
      const config = model.configuration || {
        temperature: 0.7,
        maxTokens: 2048
      };

      // Start with the base configuration properties
      const updatedConfig: any = {
        ...config,
        temperature,
        maxTokens,
      };

      // Add the model ID if it exists
      if (modelId) {
        updatedConfig.model = modelId;
      }

      // Add provider-specific properties
      if (model.provider) {
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
      }

      return updatedConfig;
    };

    const handleApply = async () => {
      try {
        const updatedConfiguration = createUpdatedConfiguration();

        await onUpdate({
          id: model.id,
          isActive,
          apiKey: apiKey || undefined,
          baseUrl: baseUrl || undefined,
          configuration: updatedConfiguration,
        });

        toast({
          title: "Model updated",
          description: `${model.name} configuration has been saved`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating model:", error);
        toast({
          title: "Error updating model",
          description: "There was a problem saving your changes",
          variant: "destructive",
        });
      }
    };

    const handleTest = () => {
      if (!isActive) {
        toast({
          title: "Model inactive",
          description: "Please activate the model before testing",
          variant: "destructive",
        });
        return;
      }

      if (!apiKey && !model.apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please add an API key before testing",
          variant: "destructive",
        });
        return;
      }

      // Create a test model with current settings
      const testModel = {
        ...model,
        isActive,
        apiKey: apiKey || model.apiKey,
        baseUrl: baseUrl || model.baseUrl,
        configuration: createUpdatedConfiguration(),
      };

      // Call the onTest handler with the updated model
      if (onTest) {
        onTest(testModel);
      }
    };

    return (
      <Card className={`border ${isActive ? "border-primary/50 shadow-md" : "border-muted/60"} transition-all hover:shadow-lg`}>
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
          onTest={handleTest}
          showTestButton={showTestButton && !!onTest}
        />
      </Card>
    );
  } catch (err) {
    // Handle any rendering errors
    console.error("Error rendering model card:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);

    return (
      <Card className="border border-red-300 bg-red-50 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error displaying model</AlertTitle>
          <AlertDescription>
            There was a problem rendering this model card: {errorMessage}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }
};
