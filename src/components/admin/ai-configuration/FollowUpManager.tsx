import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Sparkles,
  RefreshCw,
  Save,
  Play,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  GitBranch,
  ArrowRightFromLine
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowUpSuggestion } from "@/types/ai-configuration";
import {
  getAllSuggestions,
  createSuggestion,
  updateSuggestion,
  deleteSuggestion,
  getSettings,
  updateSettings
} from "@/services/ai-configuration/followUpService";

// Interface for follow-up settings
interface FollowUpSettings {
  enabled: boolean;
  maxSuggestions: number;
  displayMode: string;
  autoGenerate: boolean;
  branchingEnabled: boolean;
}

// Interface for a branching flow
interface BranchingFlow {
  id: string;
  name: string;
  startSuggestionId: string;
  description?: string;
  isActive: boolean;
}

export const FollowUpManager = () => {
  const { toast } = useToast();
  const [followUps, setFollowUps] = useState<FollowUpSuggestion[]>([]);
  const [branchingFlows, setBranchingFlows] = useState<BranchingFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSuggestion, setCurrentSuggestion] = useState<Partial<FollowUpSuggestion>>({
    text: "",
    category: "general",
    description: "",
    is_active: true,
    trigger_conditions: [],
  });
  const [settings, setSettings] = useState<FollowUpSettings>({
    enabled: true,
    maxSuggestions: 3,
    displayMode: "buttons",
    autoGenerate: true,
    branchingEnabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [suggestionsResponse, settingsResponse] = await Promise.all([
        getAllSuggestions(),
        getSettings()
      ]);

      setFollowUps(suggestionsResponse);
      setSettings({
        enabled: settingsResponse.enabled,
        maxSuggestions: settingsResponse.maxSuggestions,
        displayMode: settingsResponse.displayMode || "buttons",
        autoGenerate: settingsResponse.autoGenerate || true,
        branchingEnabled: settingsResponse.branchingEnabled || true
      });

      // In a real implementation, you would also fetch branching flows
      // For now, we'll use placeholder data
      setBranchingFlows([
        {
          id: "flow-1",
          name: "Product Information Flow",
          startSuggestionId: suggestionsResponse[0]?.id || "",
          description: "Branches for exploring product information",
          isActive: true
        },
        {
          id: "flow-2",
          name: "Support Request Flow",
          startSuggestionId: suggestionsResponse[1]?.id || "",
          description: "Flow for handling customer support inquiries",
          isActive: true
        }
      ]);
    } catch (error) {
      console.error("Error fetching follow-up data:", error);
      toast({
        title: "Error",
        description: "Failed to load follow-up suggestions and settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter follow-ups based on search query
  const filteredFollowUps = followUps.filter(
    (followUp) =>
      followUp.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followUp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (followUp.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (id: string) => {
    try {
      const suggestion = followUps.find(fu => fu.id === id);
      if (!suggestion) return;

      const updatedSuggestion = { ...suggestion, is_active: !suggestion.is_active };
      await updateSuggestion(id, updatedSuggestion);

      setFollowUps(followUps.map(fu => fu.id === id ? updatedSuggestion : fu));

      toast({
        title: "Status Updated",
        description: `Follow-up suggestion is now ${updatedSuggestion.is_active ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      console.error("Error updating suggestion status:", error);
      toast({
        title: "Error",
        description: "Failed to update suggestion status",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Follow-up settings have been updated successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchData();
      toast({
        title: "Refreshed",
        description: "Follow-up data has been refreshed",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateSuggestion = async () => {
    if (!currentSuggestion.text || !currentSuggestion.category) {
      toast({
        title: "Validation Error",
        description: "Text and category are required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && currentSuggestion.id) {
        const updated = await updateSuggestion(
          currentSuggestion.id,
          currentSuggestion as FollowUpSuggestion
        );
        setFollowUps(followUps.map(fu => fu.id === updated.id ? updated : fu));
        toast({
          title: "Suggestion Updated",
          description: "Follow-up suggestion has been updated successfully",
        });
      } else {
        const created = await createSuggestion(currentSuggestion as Omit<FollowUpSuggestion, "id">);
        setFollowUps([...followUps, created]);
        toast({
          title: "Suggestion Created",
          description: "New follow-up suggestion has been created",
        });
      }

      // Reset form
      setCurrentSuggestion({
        text: "",
        category: "general",
        description: "",
        is_active: true,
        trigger_conditions: [],
      });
      setIsEditing(false);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to save follow-up suggestion",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    try {
      await deleteSuggestion(id);
      setFollowUps(followUps.filter(fu => fu.id !== id));
      toast({
        title: "Suggestion Deleted",
        description: "Follow-up suggestion has been deleted",
      });
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to delete follow-up suggestion",
        variant: "destructive",
      });
    }
  };

  const handleEditSuggestion = (suggestion: FollowUpSuggestion) => {
    setCurrentSuggestion(suggestion);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const categoryOptions = [
    { value: "general", label: "General" },
    { value: "product", label: "Product" },
    { value: "service", label: "Service" },
    { value: "support", label: "Support" },
    { value: "pricing", label: "Pricing" },
    { value: "technical", label: "Technical" },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">
            <MessageSquare className="mr-2 h-4 w-4" /> Follow-Up Suggestions
          </TabsTrigger>
          <TabsTrigger value="branching">
            <GitBranch className="mr-2 h-4 w-4" /> Branching Formats
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Sparkles className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Follow-Up Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Follow-Up Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Manage automated follow-up suggestions that appear after AI responses
              </p>
            </div>
            <Button onClick={() => {
              setShowAddForm(true);
              setIsEditing(false);
              setCurrentSuggestion({
                text: "",
                category: "general",
                description: "",
                is_active: true,
                trigger_conditions: [],
              });
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Suggestion
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? "Edit" : "Add"} Follow-Up Suggestion</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your follow-up suggestion details"
                    : "Create a new follow-up suggestion for your AI responses"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="suggestion-text">Suggestion Text</Label>
                    <Input
                      id="suggestion-text"
                      placeholder="Would you like to know more about..."
                      value={currentSuggestion.text}
                      onChange={(e) => setCurrentSuggestion({
                        ...currentSuggestion,
                        text: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suggestion-category">Category</Label>
                    <Select
                      value={currentSuggestion.category}
                      onValueChange={(value) => setCurrentSuggestion({
                        ...currentSuggestion,
                        category: value
                      })}
                    >
                      <SelectTrigger id="suggestion-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggestion-description">Description</Label>
                  <Textarea
                    id="suggestion-description"
                    placeholder="Describe when this suggestion should appear..."
                    value={currentSuggestion.description || ""}
                    onChange={(e) => setCurrentSuggestion({
                      ...currentSuggestion,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="suggestion-active"
                    checked={currentSuggestion.is_active}
                    onCheckedChange={(checked) => setCurrentSuggestion({
                      ...currentSuggestion,
                      is_active: checked
                    })}
                  />
                  <Label htmlFor="suggestion-active">Suggestion is active</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddOrUpdateSuggestion} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update" : "Save"} Suggestion
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>All Suggestions</CardTitle>
                <Input
                  placeholder="Search suggestions..."
                  className="max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center p-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Suggestion Text</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFollowUps.map((followUp) => (
                        <TableRow key={followUp.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {followUp.text}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {followUp.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {followUp.description || "—"}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={followUp.is_active}
                              onCheckedChange={() => handleToggleStatus(followUp.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditSuggestion(followUp)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSuggestion(followUp.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredFollowUps.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center"
                          >
                            No suggestions found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branching Response Formats Tab */}
        <TabsContent value="branching" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">Branching Response Formats</h3>
              <p className="text-sm text-muted-foreground">
                Create conversation flows with branching paths based on user responses
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Flow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </>
            ) : (
              <>
                {branchingFlows.map((flow) => (
                  <Card key={flow.id} className={selectedSuggestion === flow.id ? "border-primary" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{flow.name}</CardTitle>
                          <CardDescription>{flow.description}</CardDescription>
                        </div>
                        <Switch
                          checked={flow.isActive}
                          onCheckedChange={() => {
                            // Toggle active status
                            setBranchingFlows(
                              branchingFlows.map(f =>
                                f.id === flow.id ? { ...f, isActive: !f.isActive } : f
                              )
                            );
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Starting Suggestion:</span>{" "}
                          {followUps.find(f => f.id === flow.startSuggestionId)?.text || "None selected"}
                        </div>

                        <div className="mt-2">
                          <Badge variant="outline" className="mr-2">
                            {followUps.filter(f => branchingFlows.some(
                              flow => flow.startSuggestionId === f.id
                            )).length} nodes
                          </Badge>
                          <Badge variant="outline">
                            {flow.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm">
                        <ArrowRightFromLine className="mr-2 h-4 w-4" /> View Flow
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </div>

          {branchingFlows.length === 0 && !isLoading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Branching Flows Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first flow to start building branching conversation paths
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create First Flow
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Settings</CardTitle>
              <CardDescription>
                Configure how follow-up suggestions are generated and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Enable Follow-up Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Show contextual suggestions after AI responses
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Maximum Suggestions</Label>
                  <p className="text-sm text-muted-foreground">
                    Number of follow-up suggestions to show at once
                  </p>
                </div>
                <Select
                  value={settings.maxSuggestions.toString()}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    maxSuggestions: parseInt(value)
                  })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Follow-up Display Mode</Label>
                <Select
                  value={settings.displayMode}
                  onValueChange={(value) => setSettings({ ...settings, displayMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select display style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buttons">Button Group</SelectItem>
                    <SelectItem value="chips">Chips</SelectItem>
                    <SelectItem value="list">Vertical List</SelectItem>
                    <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Controls how follow-up suggestions appear to users
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Automatic Generation</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.autoGenerate}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoGenerate: checked })}
                  />
                  <Label>Use AI to automatically generate relevant follow-ups</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the system will dynamically generate contextual follow-up
                  suggestions based on conversation content
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Enable Branching Responses</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.branchingEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, branchingEnabled: checked })}
                  />
                  <Label>Allow conversation flows with multiple paths</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, follow-up suggestions can lead to different conversation branches
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Reset Defaults
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowUpManager;
