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
  AlertCircle,
  Check,
  List,
  Heading,
  Link as LinkIcon,
  Code,
  Type,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResponseFormat } from "@/types/ai-configuration";

export interface ResponseFormatterManagerProps {
  standalone?: boolean;
}

export const ResponseFormatterManager = ({
  standalone = false,
}: ResponseFormatterManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testPrompt, setTestPrompt] = useState(
    "Tell me about your product features",
  );
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  const [formatSettings, setFormatSettings] = useState<ResponseFormat>({
    id: "default",
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

  const handleTest = () => {
    setIsTesting(true);
    // Simulate API call
    setTimeout(() => {
      setTestResponse(
        formatSettings.format === "bullet-points"
          ? "Our product features include:\n\n• **AI-Powered Chat**: Intelligent responses based on your business knowledge\n• **Multi-Channel Support**: Seamless integration with your website, mobile app, and social media\n• **Knowledge Base Integration**: Connect your existing documentation for more accurate responses\n• **Analytics Dashboard**: Track user interactions and identify common questions\n• **Customizable Interface**: Match your brand's look and feel\n\nWould you like more details about any specific feature?"
          : formatSettings.format === "structured"
            ? "# Product Features Overview\n\n## AI-Powered Chat\nIntelligent responses based on your business knowledge and customer context.\n\n## Multi-Channel Support\nSeamless integration with your website, mobile app, and social media platforms.\n\n## Knowledge Base Integration\nConnect your existing documentation for more accurate and consistent responses.\n\n## Analytics Dashboard\nTrack user interactions and identify common questions and pain points.\n\n## Customizable Interface\nMatch your brand's look and feel with our flexible design options.\n\nWould you like more details about any specific feature?"
            : "Our product offers several powerful features designed to enhance your customer experience. The AI-powered chat provides intelligent responses based on your business knowledge. We also offer multi-channel support, allowing seamless integration with your website, mobile app, and social media platforms. With our knowledge base integration, you can connect your existing documentation for more accurate responses. The analytics dashboard helps you track user interactions and identify common questions. Finally, our customizable interface ensures the chat widget matches your brand's look and feel. Would you like more details about any specific feature?",
      );
      setIsTesting(false);
      setActiveTab("preview");
    }, 1500);
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
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="ml-auto"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Settings"}
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
                    disabled={isTesting || !testPrompt.trim()}
                  >
                    {isTesting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
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
