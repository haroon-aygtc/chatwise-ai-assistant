import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAiConfigs } from "@/mock/aiConfigs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Settings, Save } from "lucide-react";
import { format } from "date-fns";
import { ModelForm } from "@/components/admin/ai-configuration/components/add-model/ModelForm";
import { AIProvider } from "@/types/ai-configuration";

export default function AiConfigPage() {
  // State for the AI model form
  const [provider, setProvider] = useState<AIProvider>("OpenAI");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [modelId, setModelId] = useState("gpt-4o");

  // Handle form submissions
  const handleModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Model form submitted");
    // Implementation would call the actual API
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 bg-card">
        <h1 className="text-2xl font-bold">AI Models Configuration</h1>
        <p className="text-muted-foreground">Configure AI models and providers for your application</p>
      </div>

      <div className="p-6 overflow-auto flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New AI Model Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Add New AI Model</CardTitle>
              <CardDescription>Configure a new AI model for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleModelSubmit}>
                <ModelForm
                  provider={provider}
                  setProvider={setProvider}
                  name={name}
                  setName={setName}
                  description={description}
                  setDescription={setDescription}
                  version={version}
                  setVersion={setVersion}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  maxTokens={maxTokens}
                  setMaxTokens={setMaxTokens}
                  modelId={modelId}
                  setModelId={setModelId}
                />
                <div className="mt-4 flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Model
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Models - Span 2 columns for better layout */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">AI Model Configurations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockAiConfigs.map(config => (
                <Card key={config.id} className="overflow-hidden">
                  <CardHeader className="relative">
                    <div className="flex justify-between items-center">
                      <CardTitle>{config.name}</CardTitle>
                      {config.isDefault && (
                        <Badge className="bg-green-500">Default</Badge>
                      )}
                    </div>
                    <CardDescription>Model: {config.model}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">System Prompt</h4>
                      <div className="p-3 bg-muted rounded-md text-sm overflow-y-auto max-h-32">
                        {config.systemPrompt}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Temperature</h4>
                        <p className="text-sm">{config.temperature}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Max Tokens</h4>
                        <p className="text-sm">{config.maxTokens}</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Updated {format(new Date(config.updatedAt), "MMM d, yyyy")}
                      </span>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="mr-1 h-3 w-3" />
                          Edit
                        </Button>

                        {!config.isDefault && (
                          <Button variant="default" size="sm">
                            <Check className="mr-1 h-3 w-3" />
                            Set Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
