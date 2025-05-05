import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { AIModel } from "@/types/ai-configuration";

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
  const [temperature, setTemperature] = useState(
    model.configuration.temperature,
  );
  const [maxTokens, setMaxTokens] = useState(model.configuration.maxTokens);
  const [isActive, setIsActive] = useState(model.isActive);
  const [apiKey, setApiKey] = useState(model.apiKey || "");

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
    setHasChanges(true);
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxTokens(value);
    setHasChanges(true);
  };

  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
    setHasChanges(true);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setHasChanges(true);
  };

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
    setTemperature(model.configuration.temperature);
    setMaxTokens(model.configuration.maxTokens);
    setIsActive(model.isActive);
    setApiKey(model.apiKey || "");
    setHasChanges(false);
  };

  // Determine icon color based on provider
  const getIconColor = () => {
    switch (model.provider.toLowerCase()) {
      case "google":
        return "text-blue-500";
      case "hugging face":
        return "text-yellow-500";
      case "openai":
        return "text-green-500";
      case "anthropic":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className={isActive ? "border-primary/50" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Sparkles className={`mr-2 h-5 w-5 ${getIconColor()}`} />
            {model.name}
          </CardTitle>
          <Switch checked={isActive} onCheckedChange={handleActiveChange} />
        </div>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={apiKey ? "••••••••••••••••" : ""}
              placeholder="Enter API key"
              onChange={handleApiKeyChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Temperature: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              value={[temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleTemperatureChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={maxTokens}
              onChange={handleMaxTokensChange}
              min={1}
              max={8192}
            />
          </div>
          {model.provider === "Hugging Face" && (
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input placeholder="e.g., mistralai/Mistral-7B-v0.1" />
            </div>
          )}
          {model.version && (
            <div className="space-y-2">
              <Label>Model Version</Label>
              <Select defaultValue={model.version}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model version" />
                </SelectTrigger>
                <SelectContent>
                  {model.provider === "Google" ? (
                    <>
                      <SelectItem value="Pro">Gemini Pro</SelectItem>
                      <SelectItem value="Pro Vision">
                        Gemini Pro Vision
                      </SelectItem>
                    </>
                  ) : (
                    <SelectItem value={model.version}>
                      {model.version}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges || isUpdating}
        >
          Reset
        </Button>
        <Button onClick={handleApply} disabled={!hasChanges || isUpdating}>
          {isUpdating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Applying...
            </>
          ) : (
            "Apply"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
