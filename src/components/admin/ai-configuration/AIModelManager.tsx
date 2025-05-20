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
import { AlertCircle, Plus, Save, Settings, RefreshCw, PlusCircle, Check, X } from "lucide-react";
import { AIModel, AIProvider, ModelProvider } from "@/types/ai-configuration";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import * as aiModelService from "@/services/ai-configuration/aiModelService";

export const AIModelManager = () => {
  const [activeTab, setActiveTab] = useState("models");
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<ModelProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [savingProvider, setSavingProvider] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
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
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setIsLoadingProviders(true);
      const fetchedProviders = await aiModelService.getAllProviders();
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
      const createdProvider = await aiModelService.createProvider(newProvider as Omit<ModelProvider, "id" | "createdAt" | "updatedAt" | "slug">);
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
      await aiModelService.updateProvider(provider.id, {
        ...provider,
        isActive: !provider.isActive,
      });

      // Update local state
      setProviders(prevProviders =>
        prevProviders.map(p =>
          p.id === provider.id ? { ...p, isActive: !p.isActive } : p
        )
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
      await refreshData();
      await fetchProviders();
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

  // Filter models based on search term
  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter providers based on search term
  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.description && provider.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              className={`mr-2 h-4 w-4 ${isLoading || isLoadingProviders ? "animate-spin" : ""
                }`}
            />
            Refresh
          </Button>
          <Button onClick={handleSaveChanges} disabled={!hasChanges || isSaving}>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="providers">Model Providers</TabsTrigger>
        </TabsList>

        <div className="my-4 flex justify-between">
          <Input
            placeholder="Search..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {activeTab === "providers" && (
            <Button onClick={() => setShowAddProvider(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          )}
        </div>

        <TabsContent value="models" className="space-y-4">
          {isLoading ? (
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
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Model
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Available Models</CardTitle>
                      <CardDescription>
                        AI models available in the system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                {model.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
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
                                  onCheckedChange={() => handleToggleModelStatus(model)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
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
                    <Label htmlFor="base-url-name">Base URL Name (Optional)</Label>
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
                <Button onClick={handleCreateProvider} disabled={savingProvider}>
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
                    <h3 className="text-lg font-semibold">No Providers Found</h3>
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
                            onCheckedChange={() => handleToggleProviderStatus(provider)}
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
                            <span>{provider.apiKeyRequired ? "Required" : "Optional"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Base URL:</span>
                            <span>{provider.baseUrlRequired ? "Required" : "Optional"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Status:</span>
                            <Badge variant={provider.isActive ? "default" : "secondary"}>
                              {provider.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
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
    </div>
  );
};

export default AIModelManager;
