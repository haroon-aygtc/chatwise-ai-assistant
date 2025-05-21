import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModelSelect } from "./ModelSelect";
import { AIModel, ModelProvider } from "@/types/ai-configuration";
import { RefreshCw, Save, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import * as aiModelService from "@/services/ai-configuration/aiModelService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelFetcherProps {
  providers: ModelProvider[];
  onModelSave: (model: AIModel) => void;
  existingModels: AIModel[];
}

export function ModelFetcher({
  providers,
  onModelSave,
  existingModels,
}: ModelFetcherProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    providers.length > 0 ? providers[0].id : null,
  );
  const [fetchedModels, setFetchedModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [highlightedModels, setHighlightedModels] = useState<string[]>([]);

  // Fetch models automatically when provider changes
  useEffect(() => {
    setSelectedModel(null);
    if (selectedProvider) {
      fetchModels(selectedProvider);
    }
  }, [selectedProvider]);

  const fetchModels = async (providerId: string) => {
    setIsFetching(true);
    try {
      const provider = providers.find((p) => p.id === providerId);
      if (!provider) {
        toast({
          title: "Provider not found",
          description: "Could not find the selected provider",
          variant: "destructive",
        });
        return;
      }

      // Call API to fetch models for this provider
      const models = await aiModelService.fetchProviderModels(provider.slug);

      // Filter out models that are already saved in the database
      const existingModelIds = existingModels.map((m) => m.modelId);
      const newModels = models.filter(
        (m) => !existingModelIds.includes(m.modelId),
      );

      setFetchedModels(newModels);

      // Highlight newly fetched models
      setHighlightedModels(newModels.map((m) => m.id));
      setTimeout(() => setHighlightedModels([]), 3000);

      if (newModels.length > 0) {
        toast({
          title: "Models fetched",
          description: `Found ${newModels.length} new models from ${provider.name}`,
        });
      } else if (models.length > 0 && newModels.length === 0) {
        toast({
          title: "No new models",
          description: `All ${models.length} models from ${provider.name} are already saved`,
        });
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Error",
        description: "Failed to fetch models from provider",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveModel = async () => {
    if (!selectedModel) return;

    const modelToSave = fetchedModels.find((m) => m.id === selectedModel);
    if (!modelToSave) return;

    setIsSaving(true);
    try {
      // Call API to save the model
      const savedModel = await aiModelService.createModel(modelToSave);

      // Notify parent component
      onModelSave(savedModel);

      // Remove from fetched models
      setFetchedModels(fetchedModels.filter((m) => m.id !== selectedModel));
      setSelectedModel(null);

      toast({
        title: "Model saved",
        description: `${modelToSave.name} has been saved successfully`,
      });
    } catch (error) {
      console.error("Error saving model:", error);
      toast({
        title: "Error",
        description: "Failed to save model",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get the current provider
  const currentProvider = providers.find((p) => p.id === selectedProvider);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fetch Models from Providers</CardTitle>
        <CardDescription>
          Select a provider to fetch available models. Models will only be saved
          to your database when you explicitly choose to save them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Select Provider
              </label>
              <Select
                value={selectedProvider || ""}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isFetching ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading models...
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedProvider && fetchModels(selectedProvider)
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {currentProvider && (
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="text-lg font-medium">{currentProvider.name}</h3>
            <p className="text-sm text-muted-foreground">
              {currentProvider.description}
            </p>
          </div>
        )}

        {fetchedModels.length > 0 && (
          <div className="space-y-4 mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Available Models</h4>
                <Badge variant="outline">
                  {fetchedModels.length} models available
                </Badge>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <ModelSelect
                    models={fetchedModels}
                    value={selectedModel || undefined}
                    onChange={setSelectedModel}
                    placeholder="Select a model to save"
                    width="w-full"
                    highlightFetched={true}
                  />
                </div>
                <Button
                  onClick={handleSaveModel}
                  disabled={!selectedModel || isSaving}
                  size="sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Model"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
