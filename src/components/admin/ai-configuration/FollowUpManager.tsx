
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  Edit,
  ArrowUp,
  ArrowDown,
  Play,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowUpSuggestion } from "@/types/ai-configuration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import followUpService from "@/services/ai-configuration/followUpService";

export interface FollowUpManagerProps {
  standalone?: boolean;
}

const FollowUpManager = ({
  standalone = false,
}: FollowUpManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<FollowUpSuggestion | null>(null);
  const [newSuggestion, setNewSuggestion] = useState<Partial<FollowUpSuggestion>>({
    text: "",
    description: "",
    category: "general",
    order: 0,
    is_active: true,
  });
  const [enableFollowUps, setEnableFollowUps] = useState(true);
  const [maxSuggestions, setMaxSuggestions] = useState(3);
  const [testResponse, setTestResponse] = useState("");
  const [testFollowUps, setTestFollowUps] = useState<FollowUpSuggestion[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [suggestions, setSuggestions] = useState<FollowUpSuggestion[]>([]);

  useEffect(() => {
    fetchSuggestions();
    fetchSettings();
  }, []);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await followUpService.getAllSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to load follow-up suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await followUpService.getSettings();
      setEnableFollowUps(data.enabled);
      setMaxSuggestions(data.max_suggestions);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchSuggestions();
    fetchSettings();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await followUpService.updateSettings({
        enabled: enableFollowUps,
        max_suggestions: maxSuggestions,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSuggestion = () => {
    setNewSuggestion({
      text: "",
      description: "",
      category: "general",
      order: suggestions.length + 1,
      is_active: true,
    });
    setShowAddDialog(true);
  };

  const handleEditSuggestion = (suggestion: FollowUpSuggestion) => {
    setCurrentSuggestion(suggestion);
    setShowEditDialog(true);
  };

  const handleDeleteSuggestion = async (id: string) => {
    try {
      await followUpService.deleteSuggestion(id);
      setSuggestions(suggestions.filter((suggestion) => suggestion.id !== id));
      toast.success("Suggestion deleted successfully");
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast.error("Failed to delete suggestion");
    }
  };

  const handleSaveNewSuggestion = async () => {
    if (newSuggestion.text && newSuggestion.category) {
      try {
        const createdSuggestion = await followUpService.createSuggestion(newSuggestion);
        setSuggestions([...suggestions, createdSuggestion]);
        toast.success("Suggestion added successfully");
        setShowAddDialog(false);
      } catch (error) {
        console.error("Error creating suggestion:", error);
        toast.error("Failed to create suggestion");
      }
    }
  };

  const handleSaveEditedSuggestion = async () => {
    if (currentSuggestion && currentSuggestion.text && currentSuggestion.category) {
      try {
        const updatedSuggestion = await followUpService.updateSuggestion(
          currentSuggestion.id,
          currentSuggestion
        );
        
        const updatedSuggestions = suggestions.map((suggestion) =>
          suggestion.id === updatedSuggestion.id ? updatedSuggestion : suggestion
        );
        
        setSuggestions(updatedSuggestions);
        toast.success("Suggestion updated successfully");
        setShowEditDialog(false);
        setCurrentSuggestion(null);
      } catch (error) {
        console.error("Error updating suggestion:", error);
        toast.error("Failed to update suggestion");
      }
    }
  };

  const handleMoveUp = async (id: string) => {
    try {
      const updatedSuggestions = await followUpService.moveSuggestionUp(id);
      setSuggestions(updatedSuggestions);
    } catch (error) {
      console.error("Error moving suggestion up:", error);
      toast.error("Failed to reorder suggestions");
    }
  };

  const handleMoveDown = async (id: string) => {
    try {
      const updatedSuggestions = await followUpService.moveSuggestionDown(id);
      setSuggestions(updatedSuggestions);
    } catch (error) {
      console.error("Error moving suggestion down:", error);
      toast.error("Failed to reorder suggestions");
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const result = await followUpService.testSuggestions();
      setTestResponse(result.response);
      setTestFollowUps(result.followUps);
      setActiveTab("preview");
      toast.success("Test completed successfully");
    } catch (error) {
      console.error("Error testing suggestions:", error);
      toast.error("Failed to test suggestions");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSwitchChange = async (checked: boolean) => {
    setEnableFollowUps(checked);
    try {
      await followUpService.updateSettings({
        enabled: checked,
        max_suggestions: maxSuggestions,
      });
      toast.success(checked ? "Follow-ups enabled" : "Follow-ups disabled");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
      setEnableFollowUps(!checked); // Revert on error
    }
  };

  const handleMaxSuggestionsChange = async (value: string) => {
    const newMax = parseInt(value);
    setMaxSuggestions(newMax);
    try {
      await followUpService.updateSettings({
        enabled: enableFollowUps,
        max_suggestions: newMax,
      });
    } catch (error) {
      console.error("Error updating max suggestions:", error);
      toast.error("Failed to update max suggestions");
      setMaxSuggestions(maxSuggestions); // Revert on error
    }
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Follow-Up Suggestions</h1>
            <p className="text-muted-foreground">
              Configure suggested next steps for users
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
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
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions">
            <MessageSquare className="mr-2 h-4 w-4" /> Suggestions
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Play className="mr-2 h-4 w-4" /> Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Follow-Up Suggestions</CardTitle>
                  <CardDescription>
                    Configure suggested next steps for users
                  </CardDescription>
                </div>
                <Switch
                  checked={enableFollowUps}
                  onCheckedChange={handleSwitchChange}
                  id="enable-followups"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="max-suggestions">Maximum Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                      How many suggestions to show at once
                    </p>
                  </div>
                  <Select
                    value={maxSuggestions.toString()}
                    onValueChange={handleMaxSuggestionsChange}
                    disabled={!enableFollowUps}
                  >
                    <SelectTrigger className="w-[100px]">
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

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Suggestions</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSuggestion}
                      disabled={!enableFollowUps}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Suggestion
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-2 text-muted-foreground">Loading suggestions...</p>
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No suggestions defined yet. Add your first suggestion to
                      get started.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div>
                            <p className="font-medium">{suggestion.text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveUp(suggestion.id)}
                              disabled={index === 0 || !enableFollowUps}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMoveDown(suggestion.id)}
                              disabled={
                                index === suggestions.length - 1 ||
                                !enableFollowUps
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSuggestion(suggestion)}
                              disabled={!enableFollowUps}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteSuggestion(suggestion.id)
                              }
                              disabled={!enableFollowUps}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Follow-Up Suggestions</CardTitle>
              <CardDescription>
                Preview how follow-up suggestions will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={handleTest}
                    disabled={isTesting || suggestions.length === 0}
                  >
                    {isTesting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" /> Test Suggestions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Follow-Up Preview</CardTitle>
              <CardDescription>
                See how follow-up suggestions will appear after AI responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResponse ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="whitespace-pre-wrap">{testResponse}</div>
                    {testFollowUps.length > 0 && (
                      <div className="mt-4 space-x-2">
                        {testFollowUps.map((suggestion) => (
                          <Badge key={suggestion.id} variant="outline" className="cursor-pointer">
                            {suggestion.text}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Settings</h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          <span className="font-medium">Enabled:</span>{" "}
                          {enableFollowUps ? "Yes" : "No"}
                        </li>
                        <li>
                          <span className="font-medium">Max Suggestions:</span>{" "}
                          {maxSuggestions}
                        </li>
                        <li>
                          <span className="font-medium">
                            Total Suggestions:
                          </span>{" "}
                          {suggestions.length}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Active Suggestions
                      </h4>
                      <ul className="text-sm space-y-1">
                        {testFollowUps.map((suggestion) => (
                          <li key={suggestion.id}>
                            <span className="font-medium">
                              "{suggestion.text}"
                            </span>{" "}
                            <span className="text-muted-foreground">
                              ({suggestion.category})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>
                    No preview available. Run a test to see the follow-up
                    suggestions.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("suggestions")}
                  >
                    Go to Suggestions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Use Cases</CardTitle>
              <CardDescription>
                Common scenarios for follow-up suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Support Escalation
                  </h4>
                  <div className="p-3 border rounded-md bg-muted/10 text-sm">
                    <p>
                      <strong>AI Response:</strong> I understand you're having
                      an issue with your account. Let me help troubleshoot that
                      for you...
                    </p>
                    <div className="mt-3 space-x-2">
                      <Badge variant="outline" className="cursor-pointer">
                        Talk to a human agent
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer">
                        View account FAQ
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Sales Opportunity
                  </h4>
                  <div className="p-3 border rounded-md bg-muted/10 text-sm">
                    <p>
                      <strong>AI Response:</strong> Our premium plan includes
                      all these features plus advanced analytics and priority
                      support...
                    </p>
                    <div className="mt-3 space-x-2">
                      <Badge variant="outline" className="cursor-pointer">
                        See pricing details
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer">
                        Start free trial
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Suggestion Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Follow-Up Suggestion</DialogTitle>
            <DialogDescription>
              Create a new follow-up suggestion for users
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suggestion-text" className="text-right">
                Text
              </Label>
              <Input
                id="suggestion-text"
                value={newSuggestion.text}
                onChange={(e) =>
                  setNewSuggestion({ ...newSuggestion, text: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Need more help?"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suggestion-category" className="text-right">
                Category
              </Label>
              <Select
                value={newSuggestion.category}
                onValueChange={(value) =>
                  setNewSuggestion({ ...newSuggestion, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="escalation">Escalation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suggestion-description" className="text-right">
                Description
              </Label>
              <Input
                id="suggestion-description"
                value={newSuggestion.description}
                onChange={(e) =>
                  setNewSuggestion({
                    ...newSuggestion,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="e.g., General follow-up question"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveNewSuggestion}
              disabled={!newSuggestion.text || !newSuggestion.category}
            >
              Add Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Suggestion Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Follow-Up Suggestion</DialogTitle>
            <DialogDescription>
              Modify an existing follow-up suggestion
            </DialogDescription>
          </DialogHeader>
          {currentSuggestion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-suggestion-text" className="text-right">
                  Text
                </Label>
                <Input
                  id="edit-suggestion-text"
                  value={currentSuggestion.text}
                  onChange={(e) =>
                    setCurrentSuggestion({
                      ...currentSuggestion,
                      text: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-suggestion-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={currentSuggestion.category}
                  onValueChange={(value) =>
                    setCurrentSuggestion({
                      ...currentSuggestion,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="escalation">Escalation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="edit-suggestion-description"
                  className="text-right"
                >
                  Description
                </Label>
                <Input
                  id="edit-suggestion-description"
                  value={currentSuggestion.description}
                  onChange={(e) =>
                    setCurrentSuggestion({
                      ...currentSuggestion,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditedSuggestion}
              disabled={!currentSuggestion || !currentSuggestion.text || !currentSuggestion.category}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowUpManager;
