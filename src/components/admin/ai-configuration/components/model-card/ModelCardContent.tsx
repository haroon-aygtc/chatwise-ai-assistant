import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AIModel } from "@/types/ai-configuration";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelCardContentProps {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  apiKey: string;
  modelId: string;
  baseUrl?: string;
  providerSpecificState: Record<string, any>;
  onTemperatureChange: (values: number[]) => void;
  onMaxTokensChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onModelIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBaseUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateProviderSpecificState: (key: string, value: any) => void;
}

export const ModelCardContent = ({
  model,
  temperature,
  maxTokens,
  apiKey,
  modelId,
  baseUrl,
  providerSpecificState,
  onTemperatureChange,
  onMaxTokensChange,
  onApiKeyChange,
  onModelIdChange,
  onBaseUrlChange,
  updateProviderSpecificState,
}: ModelCardContentProps) => {
  // Render provider-specific fields
  const renderProviderSpecificFields = () => {
    switch (model.provider) {
      case "OpenAI":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organization" className="text-right">
                Organization
              </Label>
              <Input
                id="organization"
                value={providerSpecificState.organization || ""}
                onChange={(e) =>
                  updateProviderSpecificState("organization", e.target.value)
                }
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "Google":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Select
                value={modelId}
                onValueChange={(value) =>
                  onModelIdChange({ target: { value } } as any)
                }
              >
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">
                    Gemini Pro Vision
                  </SelectItem>
                  <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">
                    Gemini 1.5 Flash
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "Anthropic":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Select
                value={modelId}
                onValueChange={(value) =>
                  onModelIdChange({ target: { value } } as any)
                }
              >
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-opus-20240229">
                    Claude 3 Opus
                  </SelectItem>
                  <SelectItem value="claude-3-sonnet-20240229">
                    Claude 3 Sonnet
                  </SelectItem>
                  <SelectItem value="claude-3-haiku-20240307">
                    Claude 3 Haiku
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="top-k" className="text-right">
                Top K
              </Label>
              <Input
                id="top-k"
                type="number"
                value={providerSpecificState.topK || 40}
                onChange={(e) =>
                  updateProviderSpecificState("topK", parseInt(e.target.value))
                }
                className="col-span-3"
                min={1}
                max={100}
              />
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "HuggingFace":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., mistralai/Mistral-7B-Instruct-v0.2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task" className="text-right">
                Task
              </Label>
              <Select
                value={providerSpecificState.task || "text-generation"}
                onValueChange={(value) =>
                  updateProviderSpecificState("task", value)
                }
              >
                <SelectTrigger className="col-span-3" id="task">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-generation">
                    Text Generation
                  </SelectItem>
                  <SelectItem value="text2text-generation">
                    Text-to-Text Generation
                  </SelectItem>
                  <SelectItem value="summarization">Summarization</SelectItem>
                  <SelectItem value="translation">Translation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wait-for-model" className="text-right">
                Wait for Model
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="wait-for-model"
                  checked={providerSpecificState.waitForModel || false}
                  onCheckedChange={(checked) =>
                    updateProviderSpecificState("waitForModel", checked)
                  }
                />
                <Label htmlFor="wait-for-model" className="ml-2">
                  {providerSpecificState.waitForModel ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </div>
        );
      case "Mistral":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Select
                value={modelId}
                onValueChange={(value) =>
                  onModelIdChange({ target: { value } } as any)
                }
              >
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mistral-large-latest">
                    Mistral Large
                  </SelectItem>
                  <SelectItem value="mistral-medium-latest">
                    Mistral Medium
                  </SelectItem>
                  <SelectItem value="mistral-small-latest">
                    Mistral Small
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="safe-prompt" className="text-right">
                Safe Prompt
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="safe-prompt"
                  checked={providerSpecificState.safePrompt || false}
                  onCheckedChange={(checked) =>
                    updateProviderSpecificState("safePrompt", checked)
                  }
                />
                <Label htmlFor="safe-prompt" className="ml-2">
                  {providerSpecificState.safePrompt ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "Groq":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Select
                value={modelId}
                onValueChange={(value) =>
                  onModelIdChange({ target: { value } } as any)
                }
              >
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3-70b-8192">Llama 3 70B</SelectItem>
                  <SelectItem value="llama3-8b-8192">Llama 3 8B</SelectItem>
                  <SelectItem value="mixtral-8x7b-32768">
                    Mixtral 8x7B
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "TogetherAI":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., meta-llama/Llama-3-70b-chat"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="repetition-penalty" className="text-right">
                Repetition Penalty
              </Label>
              <Input
                id="repetition-penalty"
                type="number"
                step="0.1"
                value={providerSpecificState.repetitionPenalty || 1.1}
                onChange={(e) =>
                  updateProviderSpecificState(
                    "repetitionPenalty",
                    parseFloat(e.target.value),
                  )
                }
                className="col-span-3"
                min={1.0}
                max={2.0}
              />
            </div>
            {renderBaseUrlField()}
          </div>
        );
      case "OpenRouter":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., openai/gpt-4o"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="route-type" className="text-right">
                Routing Strategy
              </Label>
              <Select
                value={providerSpecificState.routeType || "lowest-cost"}
                onValueChange={(value) =>
                  updateProviderSpecificState("routeType", value)
                }
              >
                <SelectTrigger className="col-span-3" id="route-type">
                  <SelectValue placeholder="Select routing strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowest-cost">Lowest Cost</SelectItem>
                  <SelectItem value="fastest">Fastest</SelectItem>
                  <SelectItem value="fallback">Fallback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-id" className="text-right">
                Model ID
              </Label>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
              />
            </div>
            {renderBaseUrlField()}
          </div>
        );
    }
  };

  // Common base URL field for most providers
  const renderBaseUrlField = () => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="base-url" className="text-right">
        Base URL
      </Label>
      <Input
        id="base-url"
        value={baseUrl || ""}
        onChange={onBaseUrlChange}
        className="col-span-3"
        placeholder="Optional custom endpoint"
      />
    </div>
  );

  return (
    <div className="p-6 pt-0 space-y-6">
      {/* Provider-specific fields */}
      {renderProviderSpecificFields()}

      {/* Common fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="temperature" className="text-right">
            Temperature: {temperature.toFixed(1)}
          </Label>
          <div className="col-span-3">
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[temperature]}
              onValueChange={onTemperatureChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="max-tokens" className="text-right">
            Max Tokens
          </Label>
          <Input
            id="max-tokens"
            type="number"
            value={maxTokens}
            onChange={onMaxTokensChange}
            className="col-span-3"
            min={1}
            max={32000}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="api-key" className="text-right">
            API Key
          </Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={onApiKeyChange}
            className="col-span-3"
            placeholder="••••••••••••••••"
          />
        </div>
      </div>
    </div>
  );
};
