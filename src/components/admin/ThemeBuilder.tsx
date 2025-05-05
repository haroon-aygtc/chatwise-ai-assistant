
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Palette,
  Save,
  Copy,
  Check,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash,
  Eye,
  Laptop,
  Smartphone,
  MonitorIcon,
} from "lucide-react";

const ThemeBuilder = () => {
  const { theme, setTheme } = useTheme();
  const [activePreview, setActivePreview] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [activeTheme, setActiveTheme] = useState("custom");
  const [themeValues, setThemeValues] = useState({
    primary: "#1e40af",
    secondary: "#e2e8f0",
    accent: "#f8fafc",
    background: "#ffffff",
    text: "#0f172a",
    radius: 8,
    fontFamily: "Inter",
    animationSpeed: 300,
  });

  const handleColorChange = (key: string, value: string) => {
    setThemeValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCopyTheme = () => {
    // In a real implementation, this would generate and copy the theme code
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetThemes = [
    { name: "Modern Clean", primary: "#0ea5e9", secondary: "#f0f9ff" },
    { name: "Dark Mode", primary: "#8b5cf6", secondary: "#1e1b4b" },
    { name: "Soft Rounded", primary: "#ec4899", secondary: "#fdf2f8" },
    { name: "Minimalist", primary: "#64748b", secondary: "#f8fafc" },
    { name: "Bold Corporate", primary: "#0f766e", secondary: "#f0fdfa" },
    { name: "Vibrant", primary: "#f97316", secondary: "#fff7ed" },
  ];

  return (
    <div className="space-y-6 static">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme Builder</h1>
          <p className="text-muted-foreground">
            Create and customize themes for your chat widget
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" /> Save Theme
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">
                <Palette className="mr-2 h-4 w-4" /> Colors
              </TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="spacing">Spacing & Layout</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                  <CardDescription>
                    Define the primary colors for your theme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{ backgroundColor: themeValues.primary }}
                        />
                        <Input
                          type="text"
                          value={themeValues.primary}
                          onChange={(e) =>
                            handleColorChange("primary", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{ backgroundColor: themeValues.secondary }}
                        />
                        <Input
                          type="text"
                          value={themeValues.secondary}
                          onChange={(e) =>
                            handleColorChange("secondary", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{ backgroundColor: themeValues.accent }}
                        />
                        <Input
                          type="text"
                          value={themeValues.accent}
                          onChange={(e) =>
                            handleColorChange("accent", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded border"
                          style={{ backgroundColor: themeValues.background }}
                        />
                        <Input
                          type="text"
                          value={themeValues.background}
                          onChange={(e) =>
                            handleColorChange("background", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded border"
                        style={{ backgroundColor: themeValues.text }}
                      />
                      <Input
                        type="text"
                        value={themeValues.text}
                        onChange={(e) =>
                          handleColorChange("text", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Color Preview</h3>
                    <div className="grid grid-cols-5 gap-2">
                      <div
                        className="h-12 rounded-l-md"
                        style={{ backgroundColor: themeValues.primary }}
                      ></div>
                      <div
                        className="h-12"
                        style={{ backgroundColor: themeValues.secondary }}
                      ></div>
                      <div
                        className="h-12"
                        style={{ backgroundColor: themeValues.accent }}
                      ></div>
                      <div
                        className="h-12"
                        style={{ backgroundColor: themeValues.background }}
                      ></div>
                      <div
                        className="h-12 rounded-r-md"
                        style={{ backgroundColor: themeValues.text }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dark Mode Colors</CardTitle>
                  <CardDescription>
                    Configure colors for dark mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-dark-mode">Auto Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate dark mode colors
                      </p>
                    </div>
                    <Switch id="auto-dark-mode" checked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Settings</CardTitle>
                  <CardDescription>
                    Configure fonts and text styles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={themeValues.fontFamily}
                      onValueChange={(value) =>
                        setThemeValues({ ...themeValues, fontFamily: value })
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
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Border Radius: {themeValues.radius}px</Label>
                    </div>
                    <Slider
                      value={[themeValues.radius]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) =>
                        setThemeValues({ ...themeValues, radius: value[0] })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">
                      Typography Preview
                    </h3>
                    <div
                      className="p-4 border rounded-md"
                      style={{
                        fontFamily: themeValues.fontFamily,
                        borderRadius: `${themeValues.radius}px`,
                      }}
                    >
                      <h1 className="text-2xl font-bold mb-2">Heading 1</h1>
                      <h2 className="text-xl font-semibold mb-2">Heading 2</h2>
                      <p className="mb-2">
                        This is a paragraph with some text to show how the
                        typography looks with your selected font family.
                      </p>
                      <button
                        className="px-4 py-2 text-white rounded-md"
                        style={{
                          backgroundColor: themeValues.primary,
                          borderRadius: `${themeValues.radius}px`,
                        }}
                      >
                        Sample Button
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing & Layout</CardTitle>
                  <CardDescription>
                    Configure spacing and layout settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Container Padding</Label>
                    <Slider value={[16]} min={0} max={32} step={2} />
                  </div>

                  <div className="space-y-2">
                    <Label>Element Spacing</Label>
                    <Slider value={[8]} min={0} max={16} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Layout Density</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger>
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Layout Preview</h3>
                    <div className="border rounded-md p-4">
                      <div className="grid gap-4">
                        <div className="h-8 bg-muted rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-20 bg-muted rounded"></div>
                          <div className="h-20 bg-muted rounded"></div>
                        </div>
                        <div className="h-32 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Animation Settings</CardTitle>
                  <CardDescription>
                    Configure animations and transitions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-animations">
                        Enable Animations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on/off all animations
                      </p>
                    </div>
                    <Switch id="enable-animations" checked />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>
                        Animation Speed: {themeValues.animationSpeed}ms
                      </Label>
                    </div>
                    <Slider
                      value={[themeValues.animationSpeed]}
                      min={100}
                      max={1000}
                      step={50}
                      onValueChange={(value) =>
                        setThemeValues({
                          ...themeValues,
                          animationSpeed: value[0],
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Transition Style</Label>
                    <Select defaultValue="ease">
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">
                      Animation Preview
                    </h3>
                    <div className="border rounded-md p-4 flex justify-center">
                      <div
                        className="h-16 w-16 bg-primary rounded-md hover:scale-110"
                        style={{
                          transition: `all ${themeValues.animationSpeed}ms ease`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground mt-2">
                      Hover over the square to see the animation
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
              <CardDescription>
                See how your theme looks in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="flex justify-center p-2">
                  <Button
                    variant={
                      activePreview === "desktop" ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActivePreview("desktop")}
                  >
                    <MonitorIcon className="h-4 w-4" />
                    Desktop
                  </Button>
                  <Button
                    variant={activePreview === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActivePreview("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                </div>
              </div>
              <div className="h-[400px] relative bg-muted/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-full h-full max-w-md mx-auto p-4"
                    style={{
                      fontFamily: themeValues.fontFamily,
                    }}
                  >
                    <div
                      className="rounded-lg shadow-lg overflow-hidden"
                      style={{
                        borderRadius: `${themeValues.radius}px`,
                        backgroundColor: themeValues.background,
                        color: themeValues.text,
                      }}
                    >
                      <div
                        className="p-4 flex justify-between items-center"
                        style={{
                          backgroundColor: themeValues.primary,
                          color: "white",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-white/20"></div>
                          <div>
                            <h3 className="font-medium">AI Assistant</h3>
                            <p className="text-xs opacity-80">Online</p>
                          </div>
                        </div>
                        <button className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="sr-only">Close</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div
                        className="p-4 h-64 overflow-y-auto"
                        style={{ backgroundColor: themeValues.secondary }}
                      >
                        <div className="flex justify-start mb-4">
                          <div
                            className="max-w-[80%] rounded-lg p-3"
                            style={{ backgroundColor: themeValues.accent }}
                          >
                            <p>Hello! How can I help you today?</p>
                          </div>
                        </div>
                        <div className="flex justify-end mb-4">
                          <div
                            className="max-w-[80%] rounded-lg p-3 text-white"
                            style={{ backgroundColor: themeValues.primary }}
                          >
                            <p>I have a question about your services.</p>
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div
                            className="max-w-[80%] rounded-lg p-3"
                            style={{ backgroundColor: themeValues.accent }}
                          >
                            <p>
                              I'd be happy to help with that! What would you
                              like to know about our services?
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 p-2 rounded border"
                          style={{
                            borderRadius: `${themeValues.radius}px`,
                            borderColor: themeValues.accent,
                          }}
                        />
                        <button
                          className="px-4 py-2 text-white rounded"
                          style={{
                            backgroundColor: themeValues.primary,
                            borderRadius: `${themeValues.radius}px`,
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Management</CardTitle>
              <CardDescription>
                Save, load, and export your themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Active Theme</Label>
                <Select value={activeTheme} onValueChange={setActiveTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Theme</SelectItem>
                    {presetThemes.map((theme, index) => (
                      <SelectItem
                        key={index}
                        value={theme.name.toLowerCase().replace(" ", "-")}
                      >
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyTheme}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy CSS
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" /> Import
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preset Themes</CardTitle>
              <CardDescription>Choose from pre-designed themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {presetThemes.map((theme, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col justify-center relative group"
                    style={{
                      borderColor: theme.primary,
                      borderWidth:
                        activeTheme ===
                        theme.name.toLowerCase().replace(" ", "-")
                          ? "2px"
                          : "1px",
                    }}
                    onClick={() =>
                      setActiveTheme(theme.name.toLowerCase().replace(" ", "-"))
                    }
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-background/80 transition-opacity">
                      <Eye className="h-5 w-5 mr-2" /> Preview
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <span className="text-sm font-medium">{theme.name}</span>
                    </div>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                >
                  <Plus className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">Create New</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThemeBuilder;
