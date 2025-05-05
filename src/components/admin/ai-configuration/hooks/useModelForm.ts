
import { useState } from "react";
import { AIModel } from "@/types/ai-configuration";

export const useModelForm = (onSuccess: (model: AIModel) => void, onOpenChange: (open: boolean) => void) => {
  const [provider, setProvider] = useState("OpenAI");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setProvider("OpenAI");
    setName("");
    setDescription("");
    setVersion("");
    setApiKey("");
    setTemperature(0.7);
    setMaxTokens(1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new model
    const newModel: AIModel = {
      id: `model-${Date.now()}`,
      name,
      description,
      provider,
      version,
      maxTokens: maxTokens,
      temperature: temperature,
      isActive: true,
      apiKey: apiKey || undefined,
      configuration: {
        temperature: temperature,
        maxTokens: maxTokens,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    };

    // Simulate API delay
    setTimeout(() => {
      onSuccess(newModel);
      setIsSubmitting(false);
      onOpenChange(false);
      resetForm();
    }, 1000);
  };

  const isFormValid = Boolean(name && version);

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
    isSubmitting,
    handleSubmit,
    resetForm,
    isFormValid,
  };
};
