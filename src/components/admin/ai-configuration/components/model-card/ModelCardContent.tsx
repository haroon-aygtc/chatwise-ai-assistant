
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIModel } from "@/types/ai-configuration";

interface ModelCardContentProps {
  model: AIModel;
  temperature: number;
  maxTokens: number;
  apiKey: string;
  onTemperatureChange: (value: number[]) => void;
  onMaxTokensChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ModelCardContent: React.FC<ModelCardContentProps> = ({
  model,
  temperature,
  maxTokens,
  apiKey,
  onTemperatureChange,
  onMaxTokensChange,
  onApiKeyChange,
}) => {
  return (
    <CardContent>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>API Key</Label>
          <Input
            type="password"
            value={apiKey ? "••••••••••••••••" : ""}
            placeholder="Enter API key"
            onChange={onApiKeyChange}
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
            onValueChange={onTemperatureChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Tokens</Label>
          <Input
            type="number"
            value={maxTokens}
            onChange={onMaxTokensChange}
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
  );
};
