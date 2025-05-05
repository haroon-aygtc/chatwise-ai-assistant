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
import { Textarea } from "@/components/ui/textarea";
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
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export interface FollowUpManagerProps {
  standalone?: boolean;
}

export const FollowUpManager = ({
  standalone = false,
}: FollowUpManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] =
    useState<FollowUpSuggestion | null>(null);
  const [newSuggestion, setNewSuggestion] = useState<
    Partial<FollowUpSuggestion>
  >({
    text: "",
    description: "",
    order: 0,
  });
  const [enableFollowUps, setEnableFollowUps] = useState(true);
  const [maxSuggestions, setMaxSuggestions] = useState(3);
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");

  const [suggestions, setSuggestions] = useState<FollowUpSuggestion[]>([
    {
      id: "suggestion1",
      text: "Need more help?",
      description: "General follow-up",
      order: 1,
    },
    {
      id: "suggestion2",
      text: "Talk to a human agent",
      description: "Escalation option",
      order: 2,
    },
    {
      id: "suggestion3",
      text: "Learn about our pricing",
      description: "Sales inquiry",
      order: 3,
    },
  ]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleAddSuggestion = () => {
    setNewSuggestion({
      text: "",
      description: "",
      order: suggestions.length + 1,
    });
    setShowAddDialog(true);
  };

  const handleEditSuggestion = (suggestion: FollowUpSuggestion) => {
    setCurrentSuggestion(suggestion);
    setShowEditDialog(true);
  };

  const handleDeleteSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((suggestion) => suggestion.id !== id));
  };

  const handleSaveNewSuggestion = () => {
    if (newSuggestion.text) {
      const suggestion: FollowUpSuggestion = {
        id: `suggestion${suggestions.length + 1}`,
        text: newSuggestion.text,
        description: newSuggestion.description || "",
        order: newSuggestion.order || suggestions.length + 1,
      };

      setSuggestions([...suggestions, suggestion]);
      setShowAddDialog(false);
    }
  };

  const handleSaveEditedSuggestion = () => {
    if (currentSuggestion) {
      const updatedSuggestions = suggestions.map((suggestion) =>
        suggestion.id === currentSuggestion.id ? currentSuggestion : suggestion,
      );
      setSuggestions(updatedSuggestions);
      setShowEditDialog(false);
      setCurrentSuggestion(null);
    }
  };

  const handleMoveUp = (id: string) => {
    const index = suggestions.findIndex((suggestion) => suggestion.id === id);
    if (index > 0) {
      const newSuggestions = [...suggestions];
      const temp = newSuggestions[index].order;
      newSuggestions[index].order = newSuggestions[index - 1].order;
      newSuggestions[index - 1].order = temp;
      newSuggestions.sort((a, b) => a.order - b.order);
      setSuggestions(newSuggestions);
    }
  };

  const handleMoveDown = (id: string) => {
    const index = suggestions.findIndex((suggestion) => suggestion.id === id);
    if (index < suggestions.length - 1) {
      const newSuggestions = [...suggestions];
      const temp = newSuggestions[index].order;
      newSuggestions[index].order = newSuggestions[index + 1].order;
      newSuggestions[index + 1].order = temp;
      newSuggestions.sort((a, b) => a.order - b.order);
      setSuggestions(newSuggestions);
    }
  };

  const handleTest = () => {
    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      const response =
        "Our product offers several powerful features designed to enhance your customer experience. The AI-powered chat provides intelligent responses based on your business knowledge. We also offer multi-channel support, allowing seamless integration with your website, mobile app, and social media platforms.";

      const followUps = enableFollowUps
        ? suggestions
            .slice(0, maxSuggestions)
            .map((s) => `- ${s.text}`)
            .join("\n")
        : "";

      setTestResponse(followUps ? `${response}\n\n${followUps}` : response);
      setIsTesting(false);
      setActiveTab("preview");
    }, 1500);
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
                  onCheckedChange={setEnableFollowUps}
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
                    onValueChange={(value) =>
                      setMaxSuggestions(parseInt(value))
                    }
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

                  {suggestions.length === 0 ? (
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
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
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
                        {suggestions
                          .slice(0, maxSuggestions)
                          .map((suggestion) => (
                            <li key={suggestion.id}>
                              <span className="font-medium">
                                "{suggestion.text}"
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
              disabled={!newSuggestion.text}
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
              disabled={!currentSuggestion || !currentSuggestion.text}
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
