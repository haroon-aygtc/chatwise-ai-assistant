import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelSelect } from "./ModelSelect";
import { AIModel, ModelProvider } from "@/types/ai-configuration";
import { RefreshCw, Save, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import * as aiModelService from "@/services/ai-configuration/aiModelService";

interface ModelFetcherProps {
  providers: ModelProvider[];
  onModelSave: (model: AIModel) => void;
  existingModels: AIModel[];
}

export function ModelFetcher({ providers, onModelSave, existingModels }: ModelFetcherProps) {
  const [activeProvider, setActiveProvider] = useState<string | null>(
    providers.length > 0 ? providers[0].id : null
  );
  const [fetchedModels, setFetchedModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [highlightedModels, setHighlightedModels] = useState<string[]>([]);

  // Reset selected model when provider changes
  useEffect(() => {
    setSelectedModel(null);
  }, [activeProvider]);

  const handleFetchModels = async () => {
    if (!activeProvider) return;
    
    setIsFetching(true);
    try {
      const provider = providers.find(p => p.id === activeProvider);
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
      const existingModelIds = existingModels.map(m => m.modelId);
      const newModels = models.filter(m => !existingModelIds.includes(m.modelId));
      
      setFetchedModels(newModels);
      
      // Highlight newly fetched models
      setHighlightedModels(newModels.map(m => m.id));
      setTimeout(() => setHighlightedModels([]), 3000);
      
      toast({
        title: "Models fetched",
        description: `Found ${newModels.length} new models from ${provider.name}`,
      });
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
    
    const modelToSave = fetchedModels.find(m => m.id === selectedModel);
    if (!modelToSave) return;
    
    setIsSaving(true);
    try {
      // Call API to save the model
      const savedModel = await aiModelService.createModel(modelToSave);
      
      // Notify parent component
      onModelSave(savedModel);
      
      // Remove from fetched models
      setFetchedModels(fetchedModels.filter(m => m.id !== selectedModel));
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fetch Models from Providers</CardTitle>
        <CardDescription>
          Select a provider to fetch available models. Models will only be saved to your database when you explicitly choose to save them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeProvider || ""} 
          onValueChange={setActiveProvider}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap h-auto p-1">
            {providers.map((provider) => (
              <TabsTrigger 
                key={provider.id} 
                value={provider.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {provider.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {providers.map((provider) => (
            <TabsContent key={provider.id} value={provider.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                <Button 
                  onClick={handleFetchModels} 
                  disabled={isFetching}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                  {isFetching ? 'Fetching...' : 'Fetch Models'}
                </Button>
              </div>
              
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
                        {isSaving ? 'Saving...' : 'Save Model'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
