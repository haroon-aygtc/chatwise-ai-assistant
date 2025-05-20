import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AIModel, AIProvider } from "@/types/ai-configuration";
import { TemperatureControl } from "./TemperatureControl";
import { FormField } from "./FormField";
import { ProviderSpecificFields } from "./ProviderSpecificFields";

interface ModelFormProps {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  version: string;
  setVersion: (version: string) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  maxTokens: number;
  setMaxTokens: (maxTokens: number) => void;
  modelId: string;
  setModelId: (modelId: string) => void;
  organization?: string;
  setOrganization?: (organization: string) => void;
  topP?: number;
  setTopP?: (topP: number) => void;
  topK?: number;
  setTopK?: (topK: number) => void;
  frequencyPenalty?: number;
  setFrequencyPenalty?: (frequencyPenalty: number) => void;
  presencePenalty?: number;
  setPresencePenalty?: (presencePenalty: number) => void;
  repetitionPenalty?: number;
  setRepetitionPenalty?: (repetitionPenalty: number) => void;
  task?: string;
  setTask?: (task: string) => void;
  waitForModel?: boolean;
  setWaitForModel?: (waitForModel: boolean) => void;
  routeType?: "fallback" | "fastest" | "lowest-cost";
  setRouteType?: (routeType: "fallback" | "fastest" | "lowest-cost") => void;
  safePrompt?: boolean;
  setSafePrompt?: (safePrompt: boolean) => void;
  baseUrl?: string;
  setBaseUrl?: (baseUrl: string) => void;
}

export const ModelForm = ({
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
  baseUrl,
  setBaseUrl,
}: ModelFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <FormField
        id="provider"
        label="Provider"
        render={() => (
          <Select
            value={provider}
            onValueChange={(value) => setProvider(value as AIProvider)}
            required
          >
            <SelectTrigger className="col-span-3" id="provider">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OpenAI">OpenAI</SelectItem>
              <SelectItem value="Google">Google (Gemini)</SelectItem>
              <SelectItem value="Gemini">Gemini AI</SelectItem>
              <SelectItem value="Anthropic">Anthropic (Claude)</SelectItem>
              <SelectItem value="HuggingFace">Hugging Face</SelectItem>
              <SelectItem value="OpenRouter">OpenRouter</SelectItem>
              <SelectItem value="Groq">Groq</SelectItem>
              <SelectItem value="Mistral">Mistral</SelectItem>
              <SelectItem value="TogetherAI">Together AI</SelectItem>
              <SelectItem value="Custom">Custom Provider</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <FormField
        id="name"
        label="Name"
        render={() => (
          <Input
            id="name"
            placeholder="e.g., GPT-4 Turbo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
      />

      <FormField
        id="description"
        label="Description"
        render={() => (
          <Input
            id="description"
            placeholder="Description of the model"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        )}
      />

      <FormField
        id="version"
        label="Version"
        render={() => (
          <Input
            id="version"
            placeholder="Model version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />
        )}
      />

      <FormField
        id="api-key"
        label="API Key"
        render={() => (
          <Input
            id="api-key"
            type="password"
            placeholder="Enter API key (optional)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        )}
      />

      {/* Provider-specific configuration fields */}
      <ProviderSpecificFields
        provider={provider}
        modelId={modelId}
        setModelId={setModelId}
        organization={organization}
        setOrganization={setOrganization}
        topP={topP}
        setTopP={setTopP}
        topK={topK}
        setTopK={setTopK}
        frequencyPenalty={frequencyPenalty}
        setFrequencyPenalty={setFrequencyPenalty}
        presencePenalty={presencePenalty}
        setPresencePenalty={setPresencePenalty}
        repetitionPenalty={repetitionPenalty}
        setRepetitionPenalty={setRepetitionPenalty}
        task={task}
        setTask={setTask}
        waitForModel={waitForModel}
        setWaitForModel={setWaitForModel}
        routeType={routeType}
        setRouteType={setRouteType}
        safePrompt={safePrompt}
        setSafePrompt={setSafePrompt}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
      />

      <TemperatureControl
        temperature={temperature}
        setTemperature={setTemperature}
      />

      <FormField
        id="max-tokens"
        label="Max Tokens"
        render={() => (
          <Input
            id="max-tokens"
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            min={1}
            max={32000}
          />
        )}
      />
    </div>
  );
};
