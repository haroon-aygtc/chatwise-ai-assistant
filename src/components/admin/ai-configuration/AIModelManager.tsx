import { useState, useEffect } from "react";
import { useAIModels } from "@/hooks/ai-configuration/useAIModels";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
<<<<<<< HEAD
import {
  AlertCircle,
  Plus,
  Save,
  Settings,
  RefreshCw,
  PlusCircle,
  Check,
  X,
  Search,
} from "lucide-react";
=======
import { AlertCircle, Plus, Save, Settings, RefreshCw, PlusCircle, Check, X, Search, Loader2 } from "lucide-react";
>>>>>>> 079c50a5ca6b8dcc4cf3bba9905ada299e5ac98f
import { AIModel, AIProvider, ModelProvider } from "@/types/ai-configuration";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AddModelDialog } from "./AddModelDialog";
import { ModelSelect } from "./components/ModelSelect";
import { ModelFetcher } from "./components/ModelFetcher";
import { ModelTestDialog } from "./components/ModelTestDialog";
import { ModelCard } from "./ModelCard";
import { aiService } from "@/services/api/aiService";

export const AIModelManager = () => {
  const [activeTab, setActiveTab] = useState("models");
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [savingProvider, setSavingProvider] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<ModelProvider | null>(null);
  const [newProvider, setNewProvider] = useState<Partial<ModelProvider>>({
    name: "",
    slug: "",
    description: "",
    apiKeyName: "API_KEY",
    apiKeyRequired: true,
    baseUrlRequired: false,
    baseUrlName: "API_BASE_URL",
    isActive: true,
  });
  const [testModel, setTestModel] = useState<AIModel | null>(null);
  const [showTestDialog, setShowTestDialog] = useState<boolean>(false);

  const {
    models,
    routingRules,
    isLoading,
    isSaving,
    error,
    updateModel,
    updateRoutingRules,
    addRoutingRule,
    deleteRoutingRule,
    saveAllChanges,
    refreshData,
    hasChanges,
    clearError,
  } = useAIModels();

  const { toast } = useToast();

  useEffect(() => {
    // Load providers and models in parallel with error handling
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchProviders(), refreshData()]);
      } catch (error) {
        // Show error toast instead of console logging
        toast({
          title: "Error",
          description:
            "Failed to load initial data. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    loadInitialData();

    // Set up cleanup for any pending requests when component unmounts
    return () => {
      // Component cleanup logic
    };
  }, [refreshData, toast]);

  const fetchProviders = async () => {
    try {
      setIsLoadingProviders(true);
      const fetchedProviders = await aiService.getAllProviders();
      setProviders(fetchedProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI providers",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleCreateProvider = async () => {
    if (!newProvider.name || !newProvider.slug) {
      toast({
        title: "Validation Error",
        description: "Provider name and slug are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingProvider(true);
<<<<<<< HEAD
      const createdProvider = await aiModelService.createProvider(
        newProvider as Omit<
          ModelProvider,
          "id" | "createdAt" | "updatedAt" | "slug"
        >,
      );
=======
      const createdProvider = await aiService.createProvider(newProvider as Omit<ModelProvider, "id" | "createdAt" | "updatedAt" | "slug">);
>>>>>>> 079c50a5ca6b8dcc4cf3bba9905ada299e5ac98f
      setProviders([...providers, createdProvider]);
      setShowAddProvider(false);
      setNewProvider({
        name: "",
        slug: "",
        description: "",
        apiKeyName: "API_KEY",
        apiKeyRequired: true,
        baseUrlRequired: false,
        baseUrlName: "API_BASE_URL",
        isActive: true,
      });
      toast({
        title: "Success",
        description: "Provider created successfully",
      });
    } catch (error) {
      console.error("Error creating provider:", error);
      toast({
        title: "Error",
        description: "Failed to create provider",
        variant: "destructive",
      });
    } finally {
      setSavingProvider(false);
    }
  };

  const handleToggleModelStatus = async (model: AIModel) => {
    try {
      await updateModel({
        id: model.id,
        isActive: !model.isActive,
      });
      toast({
        title: "Success",
        description: `Model ${model.name} ${!model.isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling model status:", error);
      toast({
        title: "Error",
        description: "Failed to update model status",
        variant: "destructive",
      });
    }
  };

  const handleToggleProviderStatus = async (provider: ModelProvider) => {
    try {
      await aiService.updateProvider(provider.id, {
        ...provider,
        isActive: !provider.isActive,
      });

      // Update local state
      setProviders((prevProviders) =>
        prevProviders.map((p) =>
          p.id === provider.id ? { ...p, isActive: !p.isActive } : p,
        ),
      );

      toast({
        title: "Success",
        description: `Provider ${provider.name} ${!provider.isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling provider status:", error);
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      await saveAllChanges();
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    try {
      // Refresh data in parallel
      await Promise.all([refreshData(), fetchProviders()]);

      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    }
  };

  const handleConfigureProvider = (provider: ModelProvider) => {
    setSelectedProvider(provider);
    setShowAddModel(true);
  };

  const handleAddModel = (model: AIModel) => {
    // Add the new model to the list
    refreshData();
    toast({
      title: "Model Added",
      description: `${model.name} has been added successfully`,
    });
  };

<<<<<<< HEAD
  // Filter models based on search term
  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.description &&
        model.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Filter providers based on search term
  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.description &&
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())),
=======
  const handleTestModel = (model: AIModel) => {
    if (!model.isActive) {
      toast({
        title: "Model inactive",
        description: "Please activate the model before testing",
        variant: "destructive",
      });
      return;
    }

    if (!model.apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please add an API key before testing",
        variant: "destructive",
      });
      return;
    }

    setTestModel(model);
    setShowTestDialog(true);
  };

  // Filter models by search term
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (model.modelId && model.modelId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter providers by search term
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.description && provider.description.toLowerCase().includes(searchTerm.toLowerCase()))
>>>>>>> 079c50a5ca6b8dcc4cf3bba9905ada299e5ac98f
  );

  // Render a grid of model cards grouped by provider
  const renderModelCards = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 h-64 animate-pulse bg-muted/40"></div>
          ))}
        </div>
      );
    }

    // Filter out invalid models
    const validModels = filteredModels.filter(model => model && model.id && model.name);

    if (validModels.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No models found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ?
              `No models match "${searchTerm}". Try a different search term or clear the filter.` :
              "There are no models configured yet. Click 'Add Model' to create one."}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear Filter
            </Button>
          )}
        </div>
      );
    }

    // Group models by provider - safely handling null/undefined values
    const modelsByProvider = validModels.reduce((acc, model) => {
      const provider = model.provider || 'Unknown';
      if (!acc[provider]) {
        acc[provider] = [];
      }
      acc[provider].push(model);
      return acc;
    }, {} as Record<string, AIModel[]>);

    if (Object.keys(modelsByProvider).length === 0) {
      return (
        <div className="text-center py-8">
          <p>No models available. Add your first AI model to get started.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
          <div key={provider} className="space-y-3">
            <h3 className="text-lg font-medium text-primary/80 border-b pb-1">
              {provider} Models ({providerModels.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providerModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onUpdate={updateModel}
                  isUpdating={isSaving}
                  onTest={handleTestModel}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">AI Model Management</h1>
          <p className="text-muted-foreground">
            Configure AI models, providers, and routing rules
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isLoadingProviders}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                isLoading || isLoadingProviders ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b mb-6">
          <div className="flex justify-between items-center">
            <TabsList className="h-12 bg-transparent p-0 mb-0">
              <TabsTrigger
                value="models"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 h-12"
              >
                AI Models
              </TabsTrigger>
              <TabsTrigger
                value="providers"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 h-12"
              >
                Model Providers
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === "providers" ? (
                <Button onClick={() => setShowAddProvider(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </Button>
              ) : (
                <Button onClick={() => setShowAddModel(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Model
                </Button>
              )}
            </div>
          </div>
        </div>

        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddModel(true)}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Model
              </Button>
            </div>
          </div>

<<<<<<< HEAD
              {filteredModels.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Models Found</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      {searchTerm
                        ? "No models match your search criteria. Try adjusting your search."
                        : "You haven't added any AI models yet. Add a model to get started."}
                    </p>
                    <Button onClick={() => setShowAddModel(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Model
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2 border-b">
                      <CardTitle>Saved Models</CardTitle>
                      <CardDescription>
                        AI models saved in your database
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Default</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredModels.map((model) => (
                            <TableRow key={model.id}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{model.name}</span>
                                  {model.description && (
                                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                      {model.description}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="font-normal"
                                >
                                  {model.provider}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {model.isDefault ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <X className="h-4 w-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={model.isActive}
                                  onCheckedChange={() =>
                                    handleToggleModelStatus(model)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Find the provider for this model
                                    const provider = providers.find(
                                      (p) =>
                                        p.slug.toLowerCase() ===
                                          model.provider.toLowerCase() ||
                                        p.name.toLowerCase() ===
                                          model.provider.toLowerCase(),
                                    );
                                    if (provider) {
                                      handleConfigureProvider(provider);
                                    } else {
                                      toast({
                                        title: "Provider not found",
                                        description: `Could not find provider for ${model.provider}`,
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="border-t py-3 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        {filteredModels.length} of {models.length} model(s)
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </>
=======
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {renderModelCards()}

          {hasChanges && (
            <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
              <p>You have unsaved changes</p>
              <Button size="sm" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save All
                  </>
                )}
              </Button>
            </div>
>>>>>>> 079c50a5ca6b8dcc4cf3bba9905ada299e5ac98f
          )}
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          {showAddProvider && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Provider</CardTitle>
                <CardDescription>
                  Configure a new AI model provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Provider Name</Label>
                    <Input
                      id="provider-name"
                      placeholder="e.g., OpenAI, Anthropic"
                      value={newProvider.name}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider-slug">Provider Slug</Label>
                    <Input
                      id="provider-slug"
                      placeholder="e.g., openai, anthropic"
                      value={newProvider.slug}
                      onChange={(e) =>
                        setNewProvider({ ...newProvider, slug: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-description">Description</Label>
                  <Input
                    id="provider-description"
                    placeholder="Brief description of the provider"
                    value={newProvider.description || ""}
                    onChange={(e) =>
                      setNewProvider({
                        ...newProvider,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key-name">API Key Name</Label>
                    <Input
                      id="api-key-name"
                      placeholder="Environment variable name"
                      value={newProvider.apiKeyName}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          apiKeyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="base-url-name">
                      Base URL Name (Optional)
                    </Label>
                    <Input
                      id="base-url-name"
                      placeholder="Environment variable name for base URL"
                      value={newProvider.baseUrlName || ""}
                      onChange={(e) =>
                        setNewProvider({
                          ...newProvider,
                          baseUrlName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="api-key-required"
                      checked={newProvider.apiKeyRequired}
                      onCheckedChange={(checked) =>
                        setNewProvider({
                          ...newProvider,
                          apiKeyRequired: checked,
                        })
                      }
                    />
                    <Label htmlFor="api-key-required">API Key Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="base-url-required"
                      checked={newProvider.baseUrlRequired}
                      onCheckedChange={(checked) =>
                        setNewProvider({
                          ...newProvider,
                          baseUrlRequired: checked,
                        })
                      }
                    />
                    <Label htmlFor="base-url-required">Base URL Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="provider-active"
                      checked={newProvider.isActive}
                      onCheckedChange={(checked) =>
                        setNewProvider({ ...newProvider, isActive: checked })
                      }
                    />
                    <Label htmlFor="provider-active">Active</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowAddProvider(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProvider}
                  disabled={savingProvider}
                >
                  {savingProvider ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" /> Save Provider
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          {isLoadingProviders ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredProviders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">
                      No Providers Found
                    </h3>
                    <p className="text-muted-foreground text-center max-w-md mb-4">
                      {searchTerm
                        ? "No providers match your search criteria. Try adjusting your search."
                        : "You haven't added any AI providers yet. Add a provider to get started."}
                    </p>
                    <Button onClick={() => setShowAddProvider(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Provider
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProviders.map((provider) => (
                    <Card key={provider.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{provider.name}</CardTitle>
                            <CardDescription>{provider.slug}</CardDescription>
                          </div>
                          <Switch
                            checked={provider.isActive}
                            onCheckedChange={() =>
                              handleToggleProviderStatus(provider)
                            }
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {provider.description || "No description provided"}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">API Key:</span>
                            <span>
                              {provider.apiKeyRequired
                                ? "Required"
                                : "Optional"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Base URL:</span>
                            <span>
                              {provider.baseUrlRequired
                                ? "Required"
                                : "Optional"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Status:</span>
                            <Badge
                              variant={
                                provider.isActive ? "default" : "secondary"
                              }
                            >
                              {provider.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleConfigureProvider(provider)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Configure Models
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Model Dialog */}
      {showAddModel && (
        <AddModelDialog
          open={showAddModel}
          onOpenChange={setShowAddModel}
          onSuccess={handleAddModel}
        />
      )}

      {showTestDialog && (
        <ModelTestDialog
          isOpen={showTestDialog}
          onClose={() => setShowTestDialog(false)}
          model={testModel}
        />
      )}
    </div>
  );
};

export default AIModelManager;
