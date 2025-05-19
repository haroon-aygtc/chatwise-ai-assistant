import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "./FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIProvider } from "@/types/ai-configuration";

interface ProviderSpecificFieldsProps {
  provider: AIProvider;
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

export const ProviderSpecificFields = ({
  provider,
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
}: ProviderSpecificFieldsProps) => {
  // Common model ID field for all providers
  const renderModelIdField = () => (
    <FormField
      id="model-id"
      label="Model ID"
      render={() => (
        <Input
          id="model-id"
          placeholder="Enter model ID"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          required
        />
      )}
    />
  );

  // Provider-specific model ID suggestions
  const renderModelSuggestions = () => {
    switch (provider) {
      case "OpenAI":
        return (
          <FormField
            id="model-id"
            label="Model ID"
            render={() => (
              <Select value={modelId} onValueChange={setModelId} required>
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo-16k">
                    GPT-3.5 Turbo 16k
                  </SelectItem>
                  <SelectItem value="text-embedding-3-large">
                    Text Embedding 3 Large
                  </SelectItem>
                  <SelectItem value="text-embedding-3-small">
                    Text Embedding 3 Small
                  </SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  <SelectItem value="tts-1">TTS-1</SelectItem>
                  <SelectItem value="whisper-1">Whisper-1</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        );
      case "Google":
        return (
          <FormField
            id="model-id"
            label="Model ID"
            render={() => (
              <Select value={modelId} onValueChange={setModelId} required>
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
                  <SelectItem value="text-embedding-gecko">
                    Text Embedding Gecko
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        );
      case "Anthropic":
        return (
          <FormField
            id="model-id"
            label="Model ID"
            render={() => (
              <Select value={modelId} onValueChange={setModelId} required>
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
                  <SelectItem value="claude-2.1">Claude 2.1</SelectItem>
                  <SelectItem value="claude-2.0">Claude 2.0</SelectItem>
                  <SelectItem value="claude-instant-1.2">
                    Claude Instant 1.2
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        );
      case "Mistral":
        return (
          <FormField
            id="model-id"
            label="Model ID"
            render={() => (
              <Select value={modelId} onValueChange={setModelId} required>
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
                  <SelectItem value="open-mistral-7b">
                    Open Mistral 7B
                  </SelectItem>
                  <SelectItem value="open-mixtral-8x7b">
                    Open Mixtral 8x7B
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        );
      case "Groq":
        return (
          <FormField
            id="model-id"
            label="Model ID"
            render={() => (
              <Select value={modelId} onValueChange={setModelId} required>
                <SelectTrigger className="col-span-3" id="model-id">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3-70b-8192">Llama 3 70B</SelectItem>
                  <SelectItem value="llama3-8b-8192">Llama 3 8B</SelectItem>
                  <SelectItem value="mixtral-8x7b-32768">
                    Mixtral 8x7B
                  </SelectItem>
                  <SelectItem value="gemma-7b-it">Gemma 7B</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        );
      default:
        return renderModelIdField();
    }
  };

  // Render provider-specific fields
  const renderProviderFields = () => {
    switch (provider) {
      case "OpenAI":
        return (
          <>
            {renderModelSuggestions()}
            <FormField
              id="organization"
              label="Organization ID (Optional)"
              render={() => (
                <Input
                  id="organization"
                  placeholder="OpenAI organization ID"
                  value={organization || ""}
                  onChange={(e) =>
                    setOrganization && setOrganization(e.target.value)
                  }
                />
              )}
            />
            <FormField
              id="base-url"
              label="Base URL (Optional)"
              render={() => (
                <Input
                  id="base-url"
                  placeholder="Custom API endpoint URL"
                  value={baseUrl || ""}
                  onChange={(e) => setBaseUrl && setBaseUrl(e.target.value)}
                />
              )}
            />
          </>
        );
      case "Google":
        return (
          <>
            {renderModelSuggestions()}
            <FormField
              id="base-url"
              label="Base URL (Optional)"
              render={() => (
                <Input
                  id="base-url"
                  placeholder="Custom API endpoint URL"
                  value={baseUrl || ""}
                  onChange={(e) => setBaseUrl && setBaseUrl(e.target.value)}
                />
              )}
            />
          </>
        );
      case "Anthropic":
        return (
          <>
            {renderModelSuggestions()}
            <FormField
              id="top-k"
              label="Top K"
              render={() => (
                <Input
                  id="top-k"
                  type="number"
                  placeholder="Top K sampling parameter"
                  value={topK || 40}
                  onChange={(e) => setTopK && setTopK(parseInt(e.target.value))}
                  min={1}
                  max={100}
                />
              )}
            />
            <FormField
              id="base-url"
              label="Base URL (Optional)"
              render={() => (
                <Input
                  id="base-url"
                  placeholder="Custom API endpoint URL"
                  value={baseUrl || ""}
                  onChange={(e) => setBaseUrl && setBaseUrl(e.target.value)}
                />
              )}
            />
          </>
        );
      case "HuggingFace":
        return (
          <>
            {renderModelIdField()}
            <FormField
              id="task"
              label="Task"
              render={() => (
                <Select
                  value={task || "text-generation"}
                  onValueChange={(value) => setTask && setTask(value)}
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
                    <SelectItem value="feature-extraction">
                      Feature Extraction
                    </SelectItem>
                    <SelectItem value="text-classification">
                      Text Classification
                    </SelectItem>
                    <SelectItem value="token-classification">
                      Token Classification
                    </SelectItem>
                    <SelectItem value="question-answering">
                      Question Answering
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormField
              id="wait-for-model"
              label="Wait for Model"
              render={() => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wait-for-model"
                    checked={waitForModel || false}
                    onCheckedChange={(checked) =>
                      setWaitForModel && setWaitForModel(checked)
                    }
                  />
                  <Label htmlFor="wait-for-model">Wait for model to load</Label>
                </div>
              )}
            />
          </>
        );
      case "OpenRouter":
        return (
          <>
            {renderModelIdField()}
            <FormField
              id="route-type"
              label="Routing Strategy"
              render={() => (
                <Select
                  value={routeType || "lowest-cost"}
                  onValueChange={(
                    value: "fallback" | "fastest" | "lowest-cost",
                  ) => setRouteType && setRouteType(value)}
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
              )}
            />
          </>
        );
      case "Mistral":
        return (
          <>
            {renderModelSuggestions()}
            <FormField
              id="safe-prompt"
              label="Safe Prompt"
              render={() => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="safe-prompt"
                    checked={safePrompt || false}
                    onCheckedChange={(checked) =>
                      setSafePrompt && setSafePrompt(checked)
                    }
                  />
                  <Label htmlFor="safe-prompt">Enable content filtering</Label>
                </div>
              )}
            />
          </>
        );
      case "TogetherAI":
        return (
          <>
            {renderModelIdField()}
            <FormField
              id="repetition-penalty"
              label="Repetition Penalty"
              render={() => (
                <Input
                  id="repetition-penalty"
                  type="number"
                  step="0.1"
                  placeholder="Repetition penalty"
                  value={repetitionPenalty || 1.1}
                  onChange={(e) =>
                    setRepetitionPenalty &&
                    setRepetitionPenalty(parseFloat(e.target.value))
                  }
                  min={1.0}
                  max={2.0}
                />
              )}
            />
          </>
        );
      case "Groq":
        return renderModelSuggestions();
      default:
        return (
          <>
            {renderModelIdField()}
            <FormField
              id="base-url"
              label="Base URL"
              render={() => (
                <Input
                  id="base-url"
                  placeholder="API endpoint URL"
                  value={baseUrl || ""}
                  onChange={(e) => setBaseUrl && setBaseUrl(e.target.value)}
                  required
                />
              )}
            />
          </>
        );
    }
  };

  return <div className="space-y-4">{renderProviderFields()}</div>;
};
