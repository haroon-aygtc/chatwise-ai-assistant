
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AIModel } from "@/types/ai-configuration";
import { TemperatureControl } from "./TemperatureControl";
import { FormField } from "./FormField";

interface ModelFormProps {
  provider: string;
  setProvider: (provider: string) => void;
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
}: ModelFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <FormField
        id="provider"
        label="Provider"
        render={() => (
          <Select
            value={provider}
            onValueChange={setProvider}
            required
          >
            <SelectTrigger className="col-span-3" id="provider">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OpenAI">OpenAI</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Anthropic">Anthropic</SelectItem>
              <SelectItem value="Hugging Face">Hugging Face</SelectItem>
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
