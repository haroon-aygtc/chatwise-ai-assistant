import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Palette,
  Code,
  Copy,
  Check,
  MessageCircle,
  Smartphone,
  Monitor,
  Save,
} from "lucide-react";
import ChatWidget from "../chat/ChatWidget";

const WidgetBuilder = () => {
  const [copied, setCopied] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    position: "bottom-right",
    primaryColor: "#1e40af",
    secondaryColor: "#e2e8f0",
    botName: "AI Assistant",
    welcomeMessage: "Hello! How can I help you today?",
    logoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chat-bot",
    size: "medium",
    borderRadius: "rounded",
    fontFamily: "Inter",
    autoOpen: false,
    autoOpenDelay: 5,
    autoOpenTrigger: "time",
    mobileOptimized: true,
  });

  const handleConfigChange = (
    key: string,
    value: string | boolean | number,
  ) => {
    setWidgetConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCopyCode = () => {
    // In a real implementation, this would generate and copy the embed code
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = `<script src="https://chat-widget.example.com/embed.js" 
  data-widget-id="widget-123456" 
  data-position="${widgetConfig.position}"
  data-primary-color="${widgetConfig.primaryColor}"
  data-bot-name="${widgetConfig.botName}"
  async>
</script>`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Widget Builder</h1>
          <p className="text-muted-foreground">
            Customize and generate your chat widget
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Configuration
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">
                <Palette className="mr-2 h-4 w-4" /> Appearance
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <MessageCircle className="mr-2 h-4 w-4" /> Behavior
              </TabsTrigger>
              <TabsTrigger value="embed">
                <Code className="mr-2 h-4 w-4" /> Embed Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Customization</CardTitle>
                  <CardDescription>
                    Customize the look and feel of your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{ backgroundColor: widgetConfig.primaryColor }}
                        />
                        <Input
                          type="text"
                          value={widgetConfig.primaryColor}
                          onChange={(e) =>
                            handleConfigChange("primaryColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{
                            backgroundColor: widgetConfig.secondaryColor,
                          }}
                        />
                        <Input
                          type="text"
                          value={widgetConfig.secondaryColor}
                          onChange={(e) =>
                            handleConfigChange("secondaryColor", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Widget Position</Label>
                    <Select
                      value={widgetConfig.position}
                      onValueChange={(value) =>
                        handleConfigChange("position", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">
                          Bottom Right
                        </SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Widget Size</Label>
                    <Select
                      value={widgetConfig.size}
                      onValueChange={(value) =>
                        handleConfigChange("size", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Select
                      value={widgetConfig.borderRadius}
                      onValueChange={(value) =>
                        handleConfigChange("borderRadius", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="full">Fully Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={widgetConfig.fontFamily}
                      onValueChange={(value) =>
                        handleConfigChange("fontFamily", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Customization</CardTitle>
                  <CardDescription>
                    Customize the text and images in your chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bot Name</Label>
                    <Input
                      value={widgetConfig.botName}
                      onChange={(e) =>
                        handleConfigChange("botName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Welcome Message</Label>
                    <Textarea
                      value={widgetConfig.welcomeMessage}
                      onChange={(e) =>
                        handleConfigChange("welcomeMessage", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={widgetConfig.logoUrl}
                      onChange={(e) =>
                        handleConfigChange("logoUrl", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Behavior</CardTitle>
                  <CardDescription>
                    Configure how your chat widget behaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-open">Auto-Open Widget</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically open the chat widget
                      </p>
                    </div>
                    <Switch
                      id="auto-open"
                      checked={widgetConfig.autoOpen}
                      onCheckedChange={(checked) =>
                        handleConfigChange("autoOpen", checked)
                      }
                    />
                  </div>

                  {widgetConfig.autoOpen && (
                    <>
                      <div className="space-y-2">
                        <Label>Auto-Open Trigger</Label>
                        <Select
                          value={widgetConfig.autoOpenTrigger}
                          onValueChange={(value) =>
                            handleConfigChange("autoOpenTrigger", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="time">Time on Page</SelectItem>
                            <SelectItem value="scroll">
                              Scroll Percentage
                            </SelectItem>
                            <SelectItem value="exit">Exit Intent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {widgetConfig.autoOpenTrigger === "time" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>
                              Delay (seconds): {widgetConfig.autoOpenDelay}
                            </Label>
                          </div>
                          <Slider
                            value={[widgetConfig.autoOpenDelay as number]}
                            min={1}
                            max={30}
                            step={1}
                            onValueChange={(value) =>
                              handleConfigChange("autoOpenDelay", value[0])
                            }
                          />
                        </div>
                      )}

                      {widgetConfig.autoOpenTrigger === "scroll" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Scroll Percentage: 50%</Label>
                          </div>
                          <Slider value={[50]} min={10} max={100} step={5} />
                        </div>
                      )}
                    </>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mobile-optimized">
                        Mobile Optimization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize widget for mobile devices
                      </p>
                    </div>
                    <Switch
                      id="mobile-optimized"
                      checked={widgetConfig.mobileOptimized}
                      onCheckedChange={(checked) =>
                        handleConfigChange("mobileOptimized", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound-effects">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sound on new messages
                      </p>
                    </div>
                    <Switch id="sound-effects" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="persistent-chat">Persistent Chat</Label>
                      <p className="text-sm text-muted-foreground">
                        Save chat history between sessions
                      </p>
                    </div>
                    <Switch id="persistent-chat" checked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Registration</CardTitle>
                  <CardDescription>
                    Configure user registration requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require-registration">
                        Require Registration
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Users must register before chatting
                      </p>
                    </div>
                    <Switch id="require-registration" checked />
                  </div>

                  <div className="space-y-2">
                    <Label>Required Fields</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="field-name" checked />
                        <Label htmlFor="field-name">Full Name</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-email" />
                        <Label htmlFor="field-email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="field-phone" checked />
                        <Label htmlFor="field-phone">Phone Number</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embed" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                  <CardDescription>
                    Add this code to your website to embed the chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{embedCode}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleCopyCode}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Installation Method</Label>
                    <Tabs defaultValue="script">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="script">Script Tag</TabsTrigger>
                        <TabsTrigger value="iframe">iFrame</TabsTrigger>
                        <TabsTrigger value="npm">NPM Package</TabsTrigger>
                      </TabsList>
                      <TabsContent value="script" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Add the script tag to your HTML file, preferably right
                          before the closing body tag.
                        </p>
                      </TabsContent>
                      <TabsContent value="iframe" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Use an iframe for complete isolation from your
                          website's styles and scripts.
                        </p>
                      </TabsContent>
                      <TabsContent value="npm" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Install via NPM for React, Vue, or Angular
                          applications.
                        </p>
                        <pre className="bg-muted p-2 rounded-md mt-2">
                          <code className="text-sm">
                            npm install @chat-widget/react
                          </code>
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Options</CardTitle>
                  <CardDescription>
                    Additional options for embedding the chat widget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch id="responsive" checked />
                        <Label htmlFor="responsive">Responsive Design</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Automatically adapt to screen size
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch id="shadow-dom" checked />
                        <Label htmlFor="shadow-dom">Use Shadow DOM</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Isolate widget styles from your website
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch id="lazy-load" checked />
                        <Label htmlFor="lazy-load">Lazy Loading</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Load widget only when needed
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch id="analytics" checked />
                        <Label htmlFor="analytics">Include Analytics</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track widget usage and performance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Live preview of your chat widget
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[500px] relative bg-muted/20 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <ChatWidget
                    position={widgetConfig.position as any}
                    primaryColor={widgetConfig.primaryColor}
                    secondaryColor={widgetConfig.secondaryColor}
                    botName={widgetConfig.botName}
                    welcomeMessage={widgetConfig.welcomeMessage}
                    logoUrl={widgetConfig.logoUrl}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Preview</CardTitle>
              <CardDescription>
                See how your widget looks on different devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 flex-1"
                >
                  <Monitor className="h-6 w-6 mb-2" />
                  <span>Desktop</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col h-auto py-4 flex-1"
                >
                  <Smartphone className="h-6 w-6 mb-2" />
                  <span>Mobile</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Gallery</CardTitle>
              <CardDescription>
                Choose from pre-designed templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                >
                  <span className="text-sm font-medium">Modern Clean</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                >
                  <span className="text-sm font-medium">Dark Mode</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                >
                  <span className="text-sm font-medium">Soft Rounded</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                >
                  <span className="text-sm font-medium">Minimalist</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WidgetBuilder;
