
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Wand2,
  RefreshCw,
  Save,
  Play,
  Check,
  List,
  Heading,
  Link as LinkIcon,
  Code,
  Type,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ResponseFormat } from "@/types/ai-configuration";
import {
  getAllResponseFormats,
  createResponseFormat,
  updateResponseFormat,
  deleteResponseFormat,
  setDefaultResponseFormat,
  getDefaultResponseFormat,
  testResponseFormat,
} from "@/services/response-format";

export interface ResponseFormatterManagerProps {
  standalone?: boolean;
}

export const ResponseFormatterManager = ({
  standalone = false,
}: ResponseFormatterManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [testPrompt, setTestPrompt] = useState(
    "Tell me about your product features"
  );
  const [testResponse, setTestResponse] = useState("");
  const [activeTab, setActiveTab] = useState("settings");

  const [formatSettings, setFormatSettings] = useState<ResponseFormat>({
    id: "",
    name: "Default Format",
    format: "conversational",
    length: "medium",
    tone: "professional",
    options: {
      useHeadings: true,
      useBulletPoints: true,
      includeLinks: true,
      formatCodeBlocks: false,
    },
  });

  // Fetch response formats
  const { 
    data: formats, 
    isLoading: isLoadingFormats,
    refetch 
  } = useQuery({
    queryKey: ['responseFormats'],
    queryFn: getAllResponseFormats
  });

  // Fetch default format on initial load
  useEffect(() => {
    if (formats && formats.length > 0) {
      const defaultFormat = formats.find(format => format.isDefault);
      if (defaultFormat) {
        setFormatSettings(defaultFormat);
      } else if (formats.length > 0) {
        setFormatSettings(formats[0]);
      }
    }
  }, [formats]);

  // Create format mutation
  const createFormatMutation = useMutation({
    mutationFn: createResponseFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast({
        title: "Format created",
        description: "Response format has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create response format",
        variant: "destructive",
      });
    },
  });

  // Update format mutation
  const updateFormatMutation = useMutation({
    mutationFn: (format: ResponseFormat) => updateResponseFormat(format.id, format),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast({
        title: "Format updated",
        description: "Response format has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update response format",
        variant: "destructive",
      });
    },
  });

  // Delete format mutation
  const deleteFormatMutation = useMutation({
    mutationFn: deleteResponseFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast({
        title: "Format deleted",
        description: "Response format has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete response format",
        variant: "destructive",
      });
    },
  });

  // Set default format mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultResponseFormat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responseFormats'] });
      toast({
        title: "Default updated",
        description: "Default response format has been set successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set default format",
        variant: "destructive",
      });
    },
  });

  // Test format mutation
  const testFormatMutation = useMutation({
    mutationFn: ({ formatId, prompt }: { formatId: string, prompt: string }) => 
      testResponseFormat(formatId, prompt),
    onSuccess: (data) => {
      setTestResponse(data);
      setActiveTab("preview");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to test format",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSave = () => {
    if (!formatSettings.id || formatSettings.id === "") {
      // Create new format
      createFormatMutation.mutate(formatSettings);
    } else {
      // Update existing format
      updateFormatMutation.mutate(formatSettings);
    }
  };

  const handleTest = () => {
    if (!formatSettings.id) {
      // Save first if this is a new format
      createFormatMutation.mutate(formatSettings, {
        onSuccess: (newFormat) => {
          setFormatSettings(newFormat);
          testFormatMutation.mutate({ 
            formatId: newFormat.id, 
            prompt: testPrompt 
          });
        }
      });
    } else {
      // Test with existing format
      testFormatMutation.mutate({ 
        formatId: formatSettings.id, 
        prompt: testPrompt 
      });
    }
  };

  const handleFormatChange = (
    value: "conversational" | "structured" | "bullet-points" | "step-by-step",
  ) => {
    setFormatSettings({ ...formatSettings, format: value });
  };

  const handleLengthChange = (value: "concise" | "medium" | "detailed") => {
    setFormatSettings({ ...formatSettings, length: value });
  };

  const handleToneChange = (
    value: "professional" | "friendly" | "casual" | "technical",
  ) => {
    setFormatSettings({ ...formatSettings, tone: value });
  };

  const handleOptionChange = (
    option: keyof typeof formatSettings.options,
    value: boolean,
  ) => {
    setFormatSettings({
      ...formatSettings,
      options: {
        ...formatSettings.options,
        [option]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Response Formatter</h1>
            <p className="text-muted-foreground">
              Configure how AI responses are structured and formatted
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingFormats}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoadingFormats ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={createFormatMutation.isPending || updateFormatMutation.isPending}
            >
              {(createFormatMutation.isPending || updateFormatMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          <TabsTrigger value="settings">
            <Wand2 className="mr-2 h-4 w-4" /> Format Settings
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Play className="mr-2 h-4 w-4" /> Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Formatting</CardTitle>
              <CardDescription>
                Configure how AI responses are structured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Format Name</Label>
                  <Input 
                    value={formatSettings.name} 
                    onChange={(e) => setFormatSettings({...formatSettings, name: e.target.value})}
                    placeholder="Enter a name for this format"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={formatSettings.description || ''} 
                    onChange={(e) => setFormatSettings({...formatSettings, description: e.target.value})}
                    placeholder="Enter a description for this format"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Format</Label>
                    <Select
                      value={formatSettings.format}
                      onValueChange={handleFormatChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversational">
                          <div className="flex items-center">
                            <Type className="mr-2 h-4 w-4" />
                            <span>Conversational</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="structured">
                          <div className="flex items-center">
                            <Heading className="mr-2 h-4 w-4" />
                            <span>Structured</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bullet-points">
                          <div className="flex items-center">
                            <List className="mr-2 h-4 w-4" />
                            <span>Bullet Points</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="step-by-step">
                          <div className="flex items-center">
                            <Check className="mr-2 h-4 w-4" />
                            <span>Step by Step</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Response Length</Label>
                    <Select
                      value={formatSettings.length}
                      onValueChange={handleLengthChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Select
                    value={formatSettings.tone}
                    onValueChange={handleToneChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Formatting Options</Label>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="headings"
                        checked={formatSettings.options.useHeadings}
                        onCheckedChange={(checked) =>
                          handleOptionChange("useHeadings", checked)
                        }
                      />
                      <Label htmlFor="headings" className="flex items-center">
                        <Heading className="mr-2 h-4 w-4" /> Use Headings
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="bullet-points"
                        checked={formatSettings.options.useBulletPoints}
                        onCheckedChange={(checked) =>
                          handleOptionChange("useBulletPoints", checked)
                        }
                      />
                      <Label
                        htmlFor="bullet-points"
                        className="flex items-center"
                      >
                        <List className="mr-2 h-4 w-4" /> Use Bullet Points
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="links"
                        checked={formatSettings.options.includeLinks}
                        onCheckedChange={(checked) =>
                          handleOptionChange("includeLinks", checked)
                        }
                      />
                      <Label htmlFor="links" className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4" /> Include Links
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="code-blocks"
                        checked={formatSettings.options.formatCodeBlocks}
                        onCheckedChange={(checked) =>
                          handleOptionChange("formatCodeBlocks", checked)
                        }
                      />
                      <Label
                        htmlFor="code-blocks"
                        className="flex items-center"
                      >
                        <Code className="mr-2 h-4 w-4" /> Format Code Blocks
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-default"
                    checked={formatSettings.isDefault || false}
                    onCheckedChange={(checked) =>
                      setFormatSettings({...formatSettings, isDefault: checked})
                    }
                  />
                  <Label htmlFor="is-default" className="font-medium">
                    Set as Default Format
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {formatSettings.id && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this format?")) {
                      deleteFormatMutation.mutate(formatSettings.id);
                    }
                  }}
                  disabled={deleteFormatMutation.isPending || formatSettings.isDefault}
                >
                  {deleteFormatMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Delete Format
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={createFormatMutation.isPending || updateFormatMutation.isPending}
              >
                {(createFormatMutation.isPending || updateFormatMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format Preview</CardTitle>
              <CardDescription>
                Test your formatting settings with a sample prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Prompt</Label>
                  <Textarea
                    placeholder="Enter a test prompt"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleTest}
                    disabled={testFormatMutation.isPending || !testPrompt.trim()}
                  >
                    {testFormatMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" /> Test Format
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {formats && formats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Formats</CardTitle>
                <CardDescription>
                  Select a format to edit or test
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {formats.map((format) => (
                    <Card key={format.id} className={format.isDefault ? "border-primary" : ""}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{format.name}</CardTitle>
                        <CardDescription className="text-xs">{format.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="text-sm">
                          <div><span className="font-medium">Format:</span> {format.format}</div>
                          <div><span className="font-medium">Length:</span> {format.length}</div>
                          <div><span className="font-medium">Tone:</span> {format.tone}</div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex justify-between w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setFormatSettings(format)}
                          >
                            Edit
                          </Button>
                          {!format.isDefault && (
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setDefaultMutation.mutate(format.id)}
                              disabled={setDefaultMutation.isPending}
                            >
                              Set Default
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Format Preview</CardTitle>
              <CardDescription>
                See how your AI responses will be formatted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResponse ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="text-sm text-muted-foreground mb-2">
                      Prompt: {testPrompt}
                    </div>
                    <Separator className="my-2" />
                    <div className="whitespace-pre-wrap">{testResponse}</div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Format Settings
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          <span className="font-medium">Format:</span>{" "}
                          {formatSettings.format}
                        </li>
                        <li>
                          <span className="font-medium">Length:</span>{" "}
                          {formatSettings.length}
                        </li>
                        <li>
                          <span className="font-medium">Tone:</span>{" "}
                          {formatSettings.tone}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Enabled Options
                      </h4>
                      <ul className="text-sm space-y-1">
                        {Object.entries(formatSettings.options).map(
                          ([key, value]) =>
                            value && (
                              <li key={key}>
                                <Check className="inline h-3 w-3 mr-1 text-green-500" />
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </li>
                            ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>
                    No preview available. Run a test to see the formatted
                    response.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("settings")}
                  >
                    Go to Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Markdown Support</CardTitle>
              <CardDescription>
                Your AI responses support these Markdown elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Text Formatting</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <code>**Bold**</code> - <strong>Bold</strong>
                    </li>
                    <li>
                      <code>*Italic*</code> - <em>Italic</em>
                    </li>
                    <li>
                      <code>~~Strikethrough~~</code> - <s>Strikethrough</s>
                    </li>
                    <li>
                      <code>`Code`</code> - <code>Code</code>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Structure</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <code># Heading 1</code> - Heading 1
                    </li>
                    <li>
                      <code>## Heading 2</code> - Heading 2
                    </li>
                    <li>
                      <code>* Bullet point</code> - Bullet point
                    </li>
                    <li>
                      <code>1. Numbered list</code> - Numbered list
                    </li>
                    <li>
                      <code>[Link](url)</code> - Link
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseFormatterManager;
