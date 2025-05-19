import { useState, useEffect } from "react";
import {
  AIModel,
  AIProvider,
  ModelConfiguration,
} from "@/types/ai-configuration";

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

  // Update modelId when provider changes to set a default value
  useEffect(() => {
    switch (provider) {
      case "OpenAI":
        setModelId("gpt-4o");
        break;
      case "Google":
        setModelId("gemini-pro");
        break;
      case "Anthropic":
        setModelId("claude-3-opus-20240229");
        break;
      case "HuggingFace":
        setModelId("mistralai/Mistral-7B-Instruct-v0.2");
        break;
      case "OpenRouter":
        setModelId("openai/gpt-4o");
        break;
      case "Groq":
        setModelId("llama3-70b-8192");
        break;
      case "Mistral":
        setModelId("mistral-large-latest");
        break;
      case "TogetherAI":
        setModelId("meta-llama/Llama-3-70b-chat");
        break;
      default:
        setModelId("");
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const configuration = createProviderSpecificConfig();

    // Create new model
    const newModel: AIModel = {
      id: `model-${Date.now()}`,
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

    // Simulate API delay
    setTimeout(() => {
      onSuccess(newModel);
      setIsSubmitting(false);
      onOpenChange(false);
      resetForm();
    }, 1000);
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
    handleSubmit,
    resetForm,
    isFormValid,
  };
};
