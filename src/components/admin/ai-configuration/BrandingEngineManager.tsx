
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
  Sparkles,
  RefreshCw,
  Save,
  Play,
  AlertCircle,
  Palette,
  Type,
  MessageSquare,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrandVoice } from "@/types/ai-configuration";

export interface BrandingEngineManagerProps {
  standalone?: boolean;
}

export const BrandingEngineManager = ({
  standalone = false,
}: BrandingEngineManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testPrompt, setTestPrompt] = useState("Tell me about your company");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  const [brandSettings, setBrandSettings] = useState<BrandVoice>({
    id: "brand1",
    name: "Default Brand Voice",
    description: "Our standard brand voice for all communications",
    brandName: "Acme Inc",
    positioning: "inline",
    signature: "If you have any more questions, the Acme team is here to help!",
    tone: ["friendly", "professional"],
    examples: [],
  });

  const [brandPersonality, setBrandPersonality] = useState({
    enablePersonality: true,
    traits: {
      friendly: 4,
      professional: 5,
      casual: 2,
      technical: 3,
      enthusiastic: 4,
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
      let response = "";

      // Generate response based on positioning
      if (brandSettings.positioning === "start") {
        response = `At ${brandSettings.brandName}, we're a leading provider of innovative software solutions designed to streamline business operations and enhance customer experiences. Our company was founded in 2010 with a mission to make powerful technology accessible to businesses of all sizes. We specialize in AI-powered chat systems, customer relationship management tools, and data analytics platforms that help organizations make better decisions and connect with their customers more effectively.\n\n${brandSettings.signature}`;
      } else if (brandSettings.positioning === "end") {
        response = `We're a leading provider of innovative software solutions designed to streamline business operations and enhance customer experiences. Our company was founded in 2010 with a mission to make powerful technology accessible to businesses of all sizes. We specialize in AI-powered chat systems, customer relationship management tools, and data analytics platforms that help organizations make better decisions and connect with their customers more effectively.\n\n${brandSettings.signature}`;
      } else {
        // inline
        response = `We're a leading provider of innovative software solutions designed to streamline business operations and enhance customer experiences. At ${brandSettings.brandName}, we were founded in 2010 with a mission to make powerful technology accessible to businesses of all sizes. We specialize in AI-powered chat systems, customer relationship management tools, and data analytics platforms that help organizations make better decisions and connect with their customers more effectively.\n\n${brandSettings.signature}`;
      }

      setTestResponse(response);
      setIsTesting(false);
      setActiveTab("preview");
    }, 1500);
  };

  const handlePositioningChange = (value: "start" | "inline" | "end") => {
    setBrandSettings({ ...brandSettings, positioning: value });
  };

  const handleTraitChange = (trait: string, value: number) => {
    setBrandPersonality({
      ...brandPersonality,
      traits: {
        ...brandPersonality.traits,
        [trait]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Branding Engine</h1>
            <p className="text-muted-foreground">
              Customize how your brand appears in AI responses
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
            <Sparkles className="mr-2 h-4 w-4" /> Brand Settings
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Play className="mr-2 h-4 w-4" /> Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
              <CardDescription>
                Customize how your brand appears in AI responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input
                    placeholder="Your Company Name"
                    value={brandSettings.brandName}
                    onChange={(e) =>
                      setBrandSettings({
                        ...brandSettings,
                        brandName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand Positioning</Label>
                  <Select
                    value={brandSettings.positioning}
                    onValueChange={handlePositioningChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Start of Response</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inline">
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Inline with Response</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="end">
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>End of Response</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {brandSettings.positioning === "start"
                      ? "Brand name will appear at the beginning of responses"
                      : brandSettings.positioning === "inline"
                        ? "Brand name will be naturally incorporated within responses"
                        : "Brand name will appear at the end of responses"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Brand Signature</Label>
                  <Textarea
                    placeholder="Custom text to include with responses"
                    value={brandSettings.signature}
                    onChange={(e) =>
                      setBrandSettings({
                        ...brandSettings,
                        signature: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    This signature will be added to the end of responses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Brand Personality</CardTitle>
                  <CardDescription>
                    Define your brand's personality traits
                  </CardDescription>
                </div>
                <Switch
                  checked={brandPersonality.enablePersonality}
                  onCheckedChange={(checked) =>
                    setBrandPersonality({
                      ...brandPersonality,
                      enablePersonality: checked,
                    })
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(brandPersonality.traits).map(
                  ([trait, value]) => (
                    <div key={trait} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="capitalize">{trait}</Label>
                        <span className="text-sm text-muted-foreground">
                          {value}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Low
                        </span>
                        <div className="flex-1 flex gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                              key={level}
                              type="button"
                              variant={level <= value ? "default" : "outline"}
                              size="sm"
                              className="flex-1 h-8"
                              onClick={() => handleTraitChange(trait, level)}
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          High
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format Preview</CardTitle>
              <CardDescription>
                Test your branding settings with a sample prompt
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
                        <Play className="mr-2 h-4 w-4" /> Test Branding
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
              <CardTitle>Branding Preview</CardTitle>
              <CardDescription>
                See how your brand voice will appear in responses
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
                        Brand Settings
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          <span className="font-medium">Brand Name:</span>{" "}
                          {brandSettings.brandName}
                        </li>
                        <li>
                          <span className="font-medium">Positioning:</span>{" "}
                          {brandSettings.positioning}
                        </li>
                        <li>
                          <span className="font-medium">Signature:</span>{" "}
                          <span className="italic">
                            {brandSettings.signature}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Personality Traits
                      </h4>
                      <ul className="text-sm space-y-1">
                        {Object.entries(brandPersonality.traits).map(
                          ([trait, value]) => (
                            <li key={trait}>
                              <span className="font-medium capitalize">
                                {trait}:
                              </span>{" "}
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <span
                                    key={i}
                                    className={`inline-block w-2 h-2 rounded-full mx-0.5 ${i < value ? "bg-primary" : "bg-muted"}`}
                                  ></span>
                                ))}
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
                    No preview available. Run a test to see the branded
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
              <CardTitle>Brand Voice Examples</CardTitle>
              <CardDescription>
                Sample responses with different brand positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Start Positioning
                  </h4>
                  <div className="p-3 border rounded-md bg-muted/10 text-sm">
                    <p>
                      <strong>At Acme Inc</strong>, we offer a 30-day money-back
                      guarantee on all our products. If you're not satisfied for
                      any reason, you can return your purchase for a full refund
                      within 30 days of delivery.
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Inline Positioning
                  </h4>
                  <div className="p-3 border rounded-md bg-muted/10 text-sm">
                    <p>
                      We offer a 30-day money-back guarantee on all our
                      products. Here at <strong>Acme Inc</strong>, customer
                      satisfaction is our top priority. If you're not satisfied
                      for any reason, you can return your purchase for a full
                      refund within 30 days of delivery.
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">End Positioning</h4>
                  <div className="p-3 border rounded-md bg-muted/10 text-sm">
                    <p>
                      We offer a 30-day money-back guarantee on all our
                      products. If you're not satisfied for any reason, you can
                      return your purchase for a full refund within 30 days of
                      delivery.
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      <em>
                        If you have any more questions, the{" "}
                        <strong>Acme Inc</strong> team is here to help!
                      </em>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandingEngineManager;
