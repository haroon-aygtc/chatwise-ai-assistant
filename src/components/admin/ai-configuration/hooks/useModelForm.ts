import { useState, useEffect } from "react";
import {
  AIModel,
  AIProvider,
  ModelConfiguration,
} from "@/types/ai-configuration";
import * as aiModelService from "@/services/ai-configuration/aiModelService";
import { toast } from "@/components/ui/use-toast";

export const useModelForm = (
  onSuccess: (model: AIModel) => void,
  onOpenChange: (open: boolean) => void,
) => {
  const [provider, setProvider] = useState<AIProvider>("OpenAI");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [modelId, setModelId] = useState("");
  const [organization, setOrganization] = useState("");
  const [topP, setTopP] = useState(1);
  const [topK, setTopK] = useState(40);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.1);
  const [task, setTask] = useState("text-generation");
  const [waitForModel, setWaitForModel] = useState(false);
  const [routeType, setRouteType] = useState<
    "fallback" | "fastest" | "lowest-cost"
  >("lowest-cost");
  const [safePrompt, setSafePrompt] = useState(false);
  const [safetySettings, setSafetySettings] = useState({});
  const [baseUrl, setBaseUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);

  // Update modelId when provider changes to set a default value
  useEffect(() => {
    // Get default configuration for the selected provider
    const defaultConfig = aiModelService.getProviderDefaultConfiguration(provider);
    setModelId(defaultConfig.model as string || "");
    setTemperature(defaultConfig.temperature);
    setMaxTokens(defaultConfig.maxTokens);
    setTopP(defaultConfig.topP || 1);
    setFrequencyPenalty(defaultConfig.frequencyPenalty || 0);
    setPresencePenalty(defaultConfig.presencePenalty || 0);

    // Reset provider-specific fields
    setOrganization("");
    setTopK(40);
    setRepetitionPenalty(1.1);
    setTask("text-generation");
    setWaitForModel(false);
    setRouteType("lowest-cost");
    setSafePrompt(false);
    setSafetySettings({});
    setBaseUrl("");

    // Reset API key validation state
    setApiKeyValid(null);
  }, [provider]);

  const resetForm = () => {
    setProvider("OpenAI");
    setName("");
    setDescription("");
    setVersion("");
    setApiKey("");
    setTemperature(0.7);
    setMaxTokens(1000);
    setModelId("gpt-4o");
    setOrganization("");
    setTopP(1);
    setTopK(40);
    setFrequencyPenalty(0);
    setPresencePenalty(0);
    setRepetitionPenalty(1.1);
    setTask("text-generation");
    setWaitForModel(false);
    setRouteType("lowest-cost");
    setSafePrompt(false);
    setSafetySettings({});
    setBaseUrl("");
    setApiKeyValid(null);
  };

  const validateApiKey = async () => {
    if (!apiKey) {
      return false;
    }

    setIsValidatingApiKey(true);
    try {
      const isValid = await aiModelService.validateProviderApiKey(
        provider,
        apiKey,
        baseUrl || undefined
      );
      setApiKeyValid(isValid);
      return isValid;
    } catch (error) {
      console.error("Error validating API key:", error);
      setApiKeyValid(false);
      return false;
    } finally {
      setIsValidatingApiKey(false);
    }
  };

  const createProviderSpecificConfig = (): ModelConfiguration => {
    const baseConfig = {
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
    };

    switch (provider) {
      case "OpenAI":
        return {
          ...baseConfig,
          model: modelId,
          organization: organization || undefined,
        };
      case "Google":
        return {
          ...baseConfig,
          model: modelId,
          safetySettings:
            Object.keys(safetySettings).length > 0 ? safetySettings : undefined,
        };
      case "Anthropic":
        return {
          ...baseConfig,
          model: modelId,
          topK: topK,
        };
      case "HuggingFace":
        return {
          ...baseConfig,
          model: modelId,
          task,
          waitForModel,
        };
      case "OpenRouter":
        return {
          ...baseConfig,
          model: modelId,
          routeType,
        };
      case "Groq":
        return {
          ...baseConfig,
          model: modelId,
        };
      case "Mistral":
        return {
          ...baseConfig,
          model: modelId,
          safePrompt,
        };
      case "TogetherAI":
        return {
          ...baseConfig,
          model: modelId,
          repetitionPenalty,
        };
      default:
        return {
          ...baseConfig,
          model: modelId,
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate API key if provided
      if (apiKey) {
        const isValid = await validateApiKey();
        if (!isValid) {
          toast({
            title: "Invalid API Key",
            description: "The provided API key is invalid. Please check and try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const configuration = createProviderSpecificConfig();

      // Create new model
      const newModel: Omit<AIModel, "id" | "createdAt" | "updatedAt"> = {
        name,
        description,
        provider,
        version,
        maxTokens,
        temperature,
        isActive: true,
        status: "active",
        apiKey: apiKey || undefined,
        baseUrl: baseUrl || undefined,
        modelId,
        configuration,
      };

      // Call the API to create the model
      const createdModel = await aiModelService.createModel(newModel);
      onSuccess(createdModel);
      onOpenChange(false);
      resetForm();
      toast({
        title: "Success",
        description: `${name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error creating model:", error);
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(name && version && modelId);

  return {
    provider,
    setProvider,
    name,
    setName,
    description,
    setDescription,
    version,
    setVersion,
    apiKey,
    setApiKey,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    modelId,
    setModelId,
    organization,
    setOrganization,
    topP,
    setTopP,
    topK,
    setTopK,
    frequencyPenalty,
    setFrequencyPenalty,
    presencePenalty,
    setPresencePenalty,
    repetitionPenalty,
    setRepetitionPenalty,
    task,
    setTask,
    waitForModel,
    setWaitForModel,
    routeType,
    setRouteType,
    safePrompt,
    setSafePrompt,
    safetySettings,
    setSafetySettings,
    baseUrl,
    setBaseUrl,
    isSubmitting,
    isValidatingApiKey,
    apiKeyValid,
    validateApiKey,
    handleSubmit,
    resetForm,
    isFormValid,
  };
};
