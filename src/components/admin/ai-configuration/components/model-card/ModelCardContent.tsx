import { CardContent } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { InfoIcon, Thermometer, TextIcon, Key, Globe, Server } from "lucide-react";
import { cn } from "@/lib/utils";

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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier (e.g., gpt-4-turbo-preview, gpt-3.5-turbo)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., gpt-4-turbo-preview"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="organization" className="text-sm font-medium">
                  Organization
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Optional organization ID for OpenAI API usage tracking</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for Google</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for Anthropic</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="top-k" className="text-sm font-medium">
                  Top K
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Controls the number of top tokens to consider for each step of the generation process</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for Hugging Face</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., mistralai/Mistral-7B-Instruct-v0.2"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="task" className="text-sm font-medium">
                  Task
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The type of generation task to perform</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="wait-for-model" className="text-sm font-medium">
                  Wait for Model
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Controls whether the model waits for the entire input to be processed before generating a response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for Mistral</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="safe-prompt" className="text-sm font-medium">
                  Safe Prompt
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Controls whether the model uses a safe prompt for generation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for Groq</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for TogetherAI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., meta-llama/Llama-3-70b-chat"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="repetition-penalty" className="text-sm font-medium">
                  Repetition Penalty
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Controls the penalty for repeating the same text in the generated response</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for OpenRouter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="model-id"
                value={modelId}
                onChange={onModelIdChange}
                className="col-span-3"
                placeholder="e.g., openai/gpt-4o"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="route-type" className="text-sm font-medium">
                  Routing Strategy
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Controls the routing strategy for OpenRouter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="text-right flex justify-end items-center gap-2">
                <Label htmlFor="model-id" className="text-sm font-medium">
                  Model ID
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>The specific model identifier for this provider</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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

  // Render temperature control with improved visual feedback
  const renderTemperatureControl = () => {
    // Determine color gradient based on temperature value
    const getTemperatureColor = () => {
      if (temperature < 0.3) return "bg-blue-500";
      if (temperature < 0.7) return "bg-green-500";
      if (temperature < 1.0) return "bg-yellow-500";
      return "bg-red-500";
    };

    // Generate temperature description based on value
    const getTemperatureDescription = () => {
      if (temperature < 0.3) return "More deterministic, consistent outputs";
      if (temperature < 0.7) return "Balanced creativity and consistency";
      if (temperature < 1.0) return "Increased creativity and variation";
      return "Maximum creativity and randomness";
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="temperature" className="text-sm font-medium">Temperature</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>Controls randomness: lower values are more deterministic, higher values more creative</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-md text-xs font-medium text-white",
              getTemperatureColor()
            )}>
              {temperature.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="py-2">
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.01}
            value={[temperature]}
            onValueChange={onTemperatureChange}
            className={cn("cursor-pointer")}
          />
        </div>

        <p className="text-xs text-muted-foreground italic">
          {getTemperatureDescription()}
        </p>
      </div>
    );
  };

  // Render max tokens control with improved visual feedback
  const renderMaxTokensControl = () => {
    const maxPossibleTokens = model.contextSize || 8192;
    const tokenPercentage = (maxTokens / maxPossibleTokens) * 100;

    // Visual indicator of token usage
    const getTokenUsageClass = () => {
      if (tokenPercentage < 30) return "text-green-500";
      if (tokenPercentage < 70) return "text-yellow-500";
      return "text-red-500";
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TextIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="max-tokens" className="text-sm font-medium">Max Tokens</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>Maximum tokens to generate in the response. One token is roughly 4 characters or 0.75 words.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium",
              getTokenUsageClass()
            )}>
              {maxTokens.toLocaleString()}
            </span>
            {model.contextSize && (
              <span className="text-xs text-muted-foreground">
                /{model.contextSize.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="relative pt-1">
          <Input
            id="max-tokens"
            type="range"
            min={1}
            max={model.contextSize || 8192}
            value={maxTokens}
            onChange={onMaxTokensChange}
            className="w-full cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced API key input with masking
  const renderApiKeyInput = () => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>Your API key for authentication with this provider. Stored securely.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={onApiKeyChange}
          className="font-mono"
          placeholder={`Enter your ${model.provider} API key`}
        />

        <p className="text-xs text-muted-foreground">
          Securely stored and never exposed to frontend clients
        </p>
      </div>
    );
  };

  const renderBaseUrlField = () => {
    if (!model.baseUrl && !baseUrl) return null;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="base-url" className="text-sm font-medium">Base URL</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>Custom endpoint URL for API requests (e.g., for proxy servers or self-hosted models)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Input
          id="base-url"
          type="url"
          value={baseUrl || ""}
          onChange={onBaseUrlChange}
          className="font-mono text-sm"
          placeholder={`https://api.${model.provider.toLowerCase()}.com/v1`}
        />
      </div>
    );
  };

  return (
    <CardContent className="p-4 space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg space-y-6">
        {renderTemperatureControl()}
        {renderMaxTokensControl()}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg space-y-6">
        {renderApiKeyInput()}
        {renderProviderSpecificFields()}
      </div>
    </CardContent>
  );
};
