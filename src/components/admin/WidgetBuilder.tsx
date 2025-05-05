
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { 
  Copy, Code, Settings, Info, Palette, MessageSquare, LayoutTemplate, 
  Smartphone, Save, Download, Sparkles, Layers, Brush, Zap, 
  Monitor, Tablet, Smartphone as PhoneIcon, MousePointer, 
  Shuffle, Heart, FlaskConical, X
} from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import WidgetPreview from '@/components/admin/widget-biulder/WidgetPreview';
import EmbedCodeGenerator from '@/components/admin/widget-biulder/EmbedCodeGenerator';
import TemplatePresets from '@/components/admin/widget-biulder/TemplatePresets';
import DevicePreview from '@/components/admin/widget-biulder/DevicePreview';
import AiAssistant from '@/components/admin/widget-biulder/AiAssistant';
import ColorPicker from '@/components/admin/widget-biulder/ColorPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const widgetConfigSchema = z.object({
  general: z.object({
    name: z.string().min(2, { message: "Widget name must be at least 2 characters." }),
    welcomeMessage: z.string().min(5, { message: "Welcome message must be at least 5 characters." }),
    botName: z.string().min(2, { message: "Bot name must be at least 2 characters." }),
    placeholderText: z.string().optional(),
    widgetPosition: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
    presetTheme: z.string().optional(),
  }),
  appearance: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    headerBgColor: z.string(),
    textColor: z.string(),
    fontSize: z.number().min(12).max(20),
    borderRadius: z.number().min(0).max(30),
    widgetWidth: z.number().min(280).max(500),
    widgetHeight: z.number().min(400).max(800),
    showLogo: z.boolean(),
    showCloseButton: z.boolean(),
    darkMode: z.boolean(),
    customCSS: z.string().optional(),
    animation: z.enum(["none", "fade", "slide", "bounce"]).default("fade"),
    shadow: z.enum(["none", "sm", "md", "lg", "xl"]).default("md"),
    glassMorphism: z.boolean().default(false),
  }),
  behavior: z.object({
    startMinimized: z.boolean(),
    autoOpen: z.boolean(),
    autoOpenDelay: z.number().min(0).max(60),
    playSoundOnMessage: z.boolean(),
    persistConversation: z.boolean(),
    showTypingIndicator: z.boolean(),
    enableUserRatings: z.boolean(),
    collectUserData: z.boolean(),
    preChat: z.boolean().default(false),
    postChat: z.boolean().default(false),
    welcomeButtons: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
    closeAfterInactivity: z.boolean().default(false),
    inactivityTimeout: z.number().min(1).max(60).default(5),
  }),
  advanced: z.object({
    modelSelection: z.enum(["gemini", "gpt-4", "huggingface", "auto"]),
    contextRetention: z.enum(["session", "persistent", "none"]),
    maxMessagesStored: z.number().min(10).max(1000),
    enableAnalytics: z.boolean(),
    debugMode: z.boolean(),
    loadTimeoutMs: z.number().min(1000).max(30000),
    webhookUrl: z.string().url().optional().or(z.literal('')),
    abTesting: z.boolean().default(false),
    abTestingVariants: z.array(z.object({
      name: z.string(),
      distribution: z.number().min(0).max(100),
    })).default([]),
    customParameters: z.record(z.string()).default({}),
  }),
});

type WidgetConfigFormValues = z.infer<typeof widgetConfigSchema>;

const colorPresets = {
  modern: {
    primary: "#7E69AB",
    secondary: "#f3f4f6",
    header: "#1f2937",
    text: "#111827",
  },
  vibrant: {
    primary: "#8B5CF6",
    secondary: "#F3E8FF",
    header: "#4C1D95",
    text: "#1F2937",
  },
  minimalist: {
    primary: "#1F2937",
    secondary: "#F9FAFB",
    header: "#111827",
    text: "#374151",
  },
  playful: {
    primary: "#F97316",
    secondary: "#FFEDD5",
    header: "#7C2D12",
    text: "#1F2937",
  },
  corporate: {
    primary: "#0EA5E9",
    secondary: "#F0F9FF",
    header: "#0C4A6E",
    text: "#1E293B",
  },
};

const templates = [
  { 
    id: "modern", 
    name: "Modern Clean", 
    description: "A sleek, modern design with clean lines and intuitive interactions",
    thumbnail: "https://via.placeholder.com/100x80/7E69AB/FFFFFF?text=Modern"
  },
  { 
    id: "glass", 
    name: "Glass Effect", 
    description: "Trendy glass morphism effect with subtle transparency",
    thumbnail: "https://via.placeholder.com/100x80/88CCDD/FFFFFF?text=Glass"
  },
  { 
    id: "dark", 
    name: "Dark Mode", 
    description: "Sleek dark interface that's easy on the eyes",
    thumbnail: "https://via.placeholder.com/100x80/1F2937/FFFFFF?text=Dark"
  },
  { 
    id: "rounded", 
    name: "Soft Rounded", 
    description: "Friendly design with soft rounded corners and playful elements",
    thumbnail: "https://via.placeholder.com/100x80/F97316/FFFFFF?text=Rounded"
  },
  { 
    id: "minimal", 
    name: "Minimalist", 
    description: "Clean, distraction-free design focused on content",
    thumbnail: "https://via.placeholder.com/100x80/111827/FFFFFF?text=Minimal"
  },
];

const WidgetConfigPage = () => {
  const [selectedTab, setSelectedTab] = useState("general");
  const [previewVisible, setPreviewVisible] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const defaultValues: WidgetConfigFormValues = {
    general: {
      name: "Customer Support Widget",
      welcomeMessage: "Hello! How can we assist you today?",
      botName: "Support Assistant",
      placeholderText: "Type your message here...",
      widgetPosition: "bottom-right",
      presetTheme: "",
    },
    appearance: {
      primaryColor: "#7E69AB",
      secondaryColor: "#f3f4f6",
      headerBgColor: "#1f2937",
      textColor: "#111827",
      fontSize: 14,
      borderRadius: 8,
      widgetWidth: 350,
      widgetHeight: 550,
      showLogo: true,
      showCloseButton: true,
      darkMode: false,
      customCSS: "",
      animation: "fade",
      shadow: "md",
      glassMorphism: false,
    },
    behavior: {
      startMinimized: true,
      autoOpen: false,
      autoOpenDelay: 5,
      playSoundOnMessage: true,
      persistConversation: true,
      showTypingIndicator: true,
      enableUserRatings: true,
      collectUserData: false,
      preChat: false,
      postChat: false,
      welcomeButtons: [],
      closeAfterInactivity: false,
      inactivityTimeout: 5,
    },
    advanced: {
      modelSelection: "auto",
      contextRetention: "session",
      maxMessagesStored: 100,
      enableAnalytics: true,
      debugMode: false,
      loadTimeoutMs: 5000,
      webhookUrl: '',
      abTesting: false,
      abTestingVariants: [
        { name: "Variant A (Default)", distribution: 100 },
        { name: "Variant B", distribution: 0 },
      ],
      customParameters: {},
    },
  };
  
  const form = useForm<WidgetConfigFormValues>({
    resolver: zodResolver(widgetConfigSchema),
    defaultValues,
  });

  const onSubmit = (data: WidgetConfigFormValues) => {
    setSaving(true);
    console.log('Widget configuration saved:', data);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configuration Saved",
        description: "Your widget configuration has been successfully saved.",
      });
    }, 1000);
  };

  const handleResetToDefaults = () => {
    form.reset(defaultValues);
    toast({
      title: "Reset to Defaults",
      description: "All settings have been reset to default values.",
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // Apply template-specific settings
    switch(templateId) {
      case "modern":
        form.setValue("appearance.primaryColor", colorPresets.modern.primary);
        form.setValue("appearance.secondaryColor", colorPresets.modern.secondary);
        form.setValue("appearance.headerBgColor", colorPresets.modern.header);
        form.setValue("appearance.textColor", colorPresets.modern.text);
        form.setValue("appearance.borderRadius", 8);
        form.setValue("appearance.animation", "fade");
        form.setValue("appearance.shadow", "md");
        form.setValue("appearance.glassMorphism", false);
        form.setValue("appearance.darkMode", false);
        break;
      case "glass":
        form.setValue("appearance.primaryColor", "#88CCDD");
        form.setValue("appearance.secondaryColor", "#ffffff");
        form.setValue("appearance.headerBgColor", "#88CCDD");
        form.setValue("appearance.textColor", "#333333");
        form.setValue("appearance.borderRadius", 12);
        form.setValue("appearance.animation", "fade");
        form.setValue("appearance.shadow", "lg");
        form.setValue("appearance.glassMorphism", true);
        form.setValue("appearance.darkMode", false);
        break;
      case "dark":
        form.setValue("appearance.primaryColor", "#3B82F6");
        form.setValue("appearance.secondaryColor", "#1F2937");
        form.setValue("appearance.headerBgColor", "#111827");
        form.setValue("appearance.textColor", "#F9FAFB");
        form.setValue("appearance.borderRadius", 8);
        form.setValue("appearance.animation", "fade");
        form.setValue("appearance.shadow", "xl");
        form.setValue("appearance.glassMorphism", false);
        form.setValue("appearance.darkMode", true);
        break;
      case "rounded":
        form.setValue("appearance.primaryColor", "#F97316");
        form.setValue("appearance.secondaryColor", "#FFEDD5");
        form.setValue("appearance.headerBgColor", "#7C2D12");
        form.setValue("appearance.textColor", "#1F2937");
        form.setValue("appearance.borderRadius", 20);
        form.setValue("appearance.animation", "bounce");
        form.setValue("appearance.shadow", "lg");
        form.setValue("appearance.glassMorphism", false);
        form.setValue("appearance.darkMode", false);
        break;
      case "minimal":
        form.setValue("appearance.primaryColor", "#111827");
        form.setValue("appearance.secondaryColor", "#F9FAFB");
        form.setValue("appearance.headerBgColor", "#111827");
        form.setValue("appearance.textColor", "#374151");
        form.setValue("appearance.borderRadius", 0);
        form.setValue("appearance.animation", "none");
        form.setValue("appearance.shadow", "none");
        form.setValue("appearance.glassMorphism", false);
        form.setValue("appearance.darkMode", false);
        break;
    }
    
    form.setValue("general.presetTheme", templateId);
    
    toast({
      title: `Applied ${template.name} Template`,
      description: "Widget preview updated with the new template settings.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Widget Configuration</h1>
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">Advanced Mode</Badge>
          </div>
          <p className="text-muted-foreground">Create, customize and manage your chat widget experience.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetToDefaults}>Reset</Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            className="relative"
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </span>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 space-y-6">
          <Card className="border-none shadow-sm overflow-visible">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Configure Your Widget
              </CardTitle>
            </CardHeader>
            
            <CardContent className="overflow-visible">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-5">
                      <TabsTrigger value="general" className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span className="hidden sm:inline">General</span>
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="flex items-center gap-1">
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Appearance</span>
                      </TabsTrigger>
                      <TabsTrigger value="behavior" className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Behavior</span>
                      </TabsTrigger>
                      <TabsTrigger value="content" className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />
                        <span className="hidden sm:inline">Content</span>
                      </TabsTrigger>
                      <TabsTrigger value="advanced" className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        <span className="hidden sm:inline">Advanced</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4 pt-4">
                      {/* AI assistant suggestion */}
                      <AiAssistant
                        suggestions={[
                          {
                            title: "Improve engagement",
                            description: "Try a friendly welcome message that addresses common user questions.",
                            action: () => {
                              form.setValue("general.welcomeMessage", "👋 Hello there! I'm here to help with any questions about our products, services, or support needs. What can I assist you with today?");
                            }
                          },
                          {
                            title: "Optimize for mobile",
                            description: "Set position to bottom-right for best mobile experience.",
                            action: () => {
                              form.setValue("general.widgetPosition", "bottom-right");
                            }
                          }
                        ]}
                      />

                      <FormField
                        control={form.control}
                        name="general.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Widget Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter widget name" />
                            </FormControl>
                            <FormDescription>
                              Internal name for this widget configuration.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="general.welcomeMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Welcome Message</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter welcome message" />
                            </FormControl>
                            <FormDescription>
                              First message users will see when opening the chat.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="general.botName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bot Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter bot name" />
                            </FormControl>
                            <FormDescription>
                              Name displayed for the bot in the conversation.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="general.placeholderText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Input Placeholder</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter placeholder text" />
                            </FormControl>
                            <FormDescription>
                              Text shown in the empty message input field.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="general.widgetPosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Widget Position</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                                <SelectItem value="top-left">Top Left</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Position of the widget on the page.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      {/* Template Presets */}
                      <div className="pt-4 border-t">
                        <Label className="mb-2 block">Template Presets</Label>
                        <FormDescription className="mb-3">
                          Choose from pre-built templates to quickly style your widget.
                        </FormDescription>
                        <TemplatePresets 
                          templates={templates} 
                          applyTemplate={applyTemplate}
                          currentTemplate={form.watch("general.presetTheme")}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-4 pt-4">
                      <AiAssistant
                        suggestions={[
                          {
                            title: "Brand match",
                            description: "Use your brand's primary color for better recognition.",
                            action: () => {}
                          },
                          {
                            title: "Enhanced readability",
                            description: "Increase font size to 16px for better readability.",
                            action: () => {
                              form.setValue("appearance.fontSize", 16);
                            }
                          }
                        ]}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="appearance.primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color</FormLabel>
                              <ColorPicker 
                                color={field.value} 
                                onChange={field.onChange}
                                presets={Object.values(colorPresets).map(c => c.primary)}
                              />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.secondaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Color</FormLabel>
                              <ColorPicker 
                                color={field.value} 
                                onChange={field.onChange} 
                                presets={Object.values(colorPresets).map(c => c.secondary)}
                              />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.headerBgColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Header Background</FormLabel>
                              <ColorPicker 
                                color={field.value} 
                                onChange={field.onChange}
                                presets={Object.values(colorPresets).map(c => c.header)}
                              />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.textColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Text Color</FormLabel>
                              <ColorPicker 
                                color={field.value} 
                                onChange={field.onChange}
                                presets={Object.values(colorPresets).map(c => c.text)}
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="appearance.fontSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Font Size: {field.value}px</FormLabel>
                              <FormControl>
                                <Slider
                                  min={12}
                                  max={20}
                                  step={1}
                                  defaultValue={[field.value]}
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.borderRadius"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Border Radius: {field.value}px</FormLabel>
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={30}
                                  step={1}
                                  defaultValue={[field.value]}
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.widgetWidth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Widget Width: {field.value}px</FormLabel>
                              <FormControl>
                                <Slider
                                  min={280}
                                  max={500}
                                  step={10}
                                  defaultValue={[field.value]}
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.widgetHeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Widget Height: {field.value}px</FormLabel>
                              <FormControl>
                                <Slider
                                  min={400}
                                  max={800}
                                  step={10}
                                  defaultValue={[field.value]}
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <Label className="mb-2 block">Animation & Effects</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="appearance.animation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Animation</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select animation" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="fade">Fade</SelectItem>
                                    <SelectItem value="slide">Slide</SelectItem>
                                    <SelectItem value="bounce">Bounce</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="appearance.shadow"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Shadow</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select shadow" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="sm">Small</SelectItem>
                                    <SelectItem value="md">Medium</SelectItem>
                                    <SelectItem value="lg">Large</SelectItem>
                                    <SelectItem value="xl">Extra Large</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <FormField
                          control={form.control}
                          name="appearance.showLogo"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Show Logo</FormLabel>
                                <FormDescription>
                                  Display your brand logo in the widget header
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.showCloseButton"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Show Close Button</FormLabel>
                                <FormDescription>
                                  Allow users to close the widget
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="appearance.darkMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Dark Mode</FormLabel>
                                <FormDescription>
                                  Use dark theme for the widget
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="appearance.glassMorphism"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Glass Effect</FormLabel>
                                <FormDescription>
                                  Apply a modern glass morphism effect
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="appearance.customCSS"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom CSS (Advanced)</FormLabel>
                            <FormControl>
                              <textarea 
                                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder=".chat-widget { /* your custom styles */ }"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Add custom CSS to further customize your widget appearance.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="behavior" className="space-y-4 pt-4">
                      <AiAssistant
                        suggestions={[
                          {
                            title: "Increase engagement",
                            description: "Enable auto-open with a 5 second delay for better engagement.",
                            action: () => {
                              form.setValue("behavior.autoOpen", true);
                              form.setValue("behavior.autoOpenDelay", 5);
                            }
                          },
                          {
                            title: "Collect user feedback",
                            description: "Enable user ratings to collect feedback on responses.",
                            action: () => {
                              form.setValue("behavior.enableUserRatings", true);
                            }
                          }
                        ]}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="behavior.startMinimized"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Start Minimized</FormLabel>
                                <FormDescription>
                                  Widget starts in minimized state
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="behavior.autoOpen"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Auto Open</FormLabel>
                                <FormDescription>
                                  Automatically open the widget after delay
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("behavior.autoOpen") && (
                          <FormField
                            control={form.control}
                            name="behavior.autoOpenDelay"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Auto Open Delay (seconds): {field.value}</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={60}
                                    step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        
                        <FormField
                          control={form.control}
                          name="behavior.playSoundOnMessage"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Sound Notifications</FormLabel>
                                <FormDescription>
                                  Play sound when new messages arrive
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="behavior.persistConversation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Persist Conversation</FormLabel>
                                <FormDescription>
                                  Save conversation between sessions
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="behavior.showTypingIndicator"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Typing Indicator</FormLabel>
                                <FormDescription>
                                  Show typing animation when AI responds
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="behavior.enableUserRatings"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>User Ratings</FormLabel>
                                <FormDescription>
                                  Allow users to rate AI responses
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="behavior.collectUserData"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Collect User Data</FormLabel>
                                <FormDescription>
                                  Ask for name/email before starting chat
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="behavior.closeAfterInactivity"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Auto Close on Inactivity</FormLabel>
                                <FormDescription>
                                  Close widget after period of inactivity
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {form.watch("behavior.closeAfterInactivity") && (
                          <FormField
                            control={form.control}
                            name="behavior.inactivityTimeout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Inactivity Timeout (minutes): {field.value}</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={1}
                                    max={60}
                                    step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 pt-4">
                      <AiAssistant
                        suggestions={[
                          {
                            title: "Add quick reply buttons",
                            description: "Add welcome buttons for common questions to improve UX.",
                            action: () => {
                              form.setValue("behavior.welcomeButtons", [
                                { label: "Pricing", value: "Can you tell me about your pricing?" },
                                { label: "Features", value: "What features do you offer?" },
                                { label: "Support", value: "How can I get support?" }
                              ]);
                            }
                          }
                        ]}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="behavior.preChat"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Pre-Chat Form</FormLabel>
                                <FormDescription>
                                  Show a form before starting the chat
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="behavior.postChat"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Post-Chat Survey</FormLabel>
                                <FormDescription>
                                  Show a satisfaction survey after chat ends
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <FormLabel>Welcome Message Quick Replies</FormLabel>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentButtons = form.getValues("behavior.welcomeButtons") || [];
                              form.setValue("behavior.welcomeButtons", [
                                ...currentButtons,
                                { label: "New Button", value: "Button value" }
                              ]);
                            }}
                          >
                            Add Button
                          </Button>
                        </div>
                        <FormDescription className="mb-2">
                          Create quick reply buttons that appear with your welcome message.
                        </FormDescription>

                        {form.watch("behavior.welcomeButtons")?.map((button, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <Input
                              placeholder="Button Label"
                              value={button.label}
                              onChange={(e) => {
                                const newButtons = [...form.getValues("behavior.welcomeButtons")];
                                newButtons[index].label = e.target.value;
                                form.setValue("behavior.welcomeButtons", newButtons);
                              }}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Button Value"
                              value={button.value}
                              onChange={(e) => {
                                const newButtons = [...form.getValues("behavior.welcomeButtons")];
                                newButtons[index].value = e.target.value;
                                form.setValue("behavior.welcomeButtons", newButtons);
                              }}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newButtons = form.getValues("behavior.welcomeButtons").filter((_, i) => i !== index);
                                form.setValue("behavior.welcomeButtons", newButtons);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4 pt-4">
                      <AiAssistant
                        suggestions={[
                          {
                            title: "Optimize for performance",
                            description: "Set a reasonable load timeout (5000ms) to ensure fast loading.",
                            action: () => {
                              form.setValue("advanced.loadTimeoutMs", 5000);
                            }
                          },
                          {
                            title: "Setup A/B testing",
                            description: "Enable A/B testing to test different widget configurations.",
                            action: () => {
                              form.setValue("advanced.abTesting", true);
                              form.setValue("advanced.abTestingVariants", [
                                { name: "Variant A (Default)", distribution: 50 },
                                { name: "Variant B", distribution: 50 },
                              ]);
                            }
                          }
                        ]}
                      />

                      <FormField
                        control={form.control}
                        name="advanced.modelSelection"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>AI Model Selection</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select AI model" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="gemini">Gemini</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="huggingface">Hugging Face</SelectItem>
                                <SelectItem value="auto">Auto (Smart Routing)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select which AI model to use for responses
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="advanced.contextRetention"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Context Retention</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select context retention" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="session">Session Only</SelectItem>
                                <SelectItem value="persistent">Persistent (Across Sessions)</SelectItem>
                                <SelectItem value="none">None (Stateless)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How long to maintain conversation context
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="advanced.maxMessagesStored"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Messages Stored: {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={10}
                                max={1000}
                                step={10}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum number of messages to keep in history
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="advanced.webhookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://your-webhook-url.com/chat-events" />
                            </FormControl>
                            <FormDescription>
                              Optional webhook to send chat events (new messages, ratings, etc.)
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="advanced.enableAnalytics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Enable Analytics</FormLabel>
                                <FormDescription>
                                  Collect usage analytics and metrics
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="advanced.debugMode"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Debug Mode</FormLabel>
                                <FormDescription>
                                  Log detailed information to console
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="advanced.abTesting"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>
                                  A/B Testing
                                  <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-600 border-amber-200">Beta</Badge>
                                </FormLabel>
                                <FormDescription>
                                  Test different widget configurations
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("advanced.abTesting") && (
                        <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                          <div className="flex justify-between items-center">
                            <Label>A/B Testing Variants</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentVariants = form.getValues("advanced.abTestingVariants") || [];
                                form.setValue("advanced.abTestingVariants", [
                                  ...currentVariants,
                                  { name: `Variant ${String.fromCharCode(65 + currentVariants.length)}`, distribution: 0 }
                                ]);
                              }}
                              disabled={form.watch("advanced.abTestingVariants").length >= 4}
                            >
                              Add Variant
                            </Button>
                          </div>

                          {form.watch("advanced.abTestingVariants").map((variant, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder="Variant Name"
                                value={variant.name}
                                onChange={(e) => {
                                  const newVariants = [...form.getValues("advanced.abTestingVariants")];
                                  newVariants[index].name = e.target.value;
                                  form.setValue("advanced.abTestingVariants", newVariants);
                                }}
                                className="flex-1"
                              />
                              <div className="flex-1 flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={variant.distribution}
                                  onChange={(e) => {
                                    const newVariants = [...form.getValues("advanced.abTestingVariants")];
                                    newVariants[index].distribution = parseInt(e.target.value) || 0;
                                    form.setValue("advanced.abTestingVariants", newVariants);
                                  }}
                                  className="w-20"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newVariants = form.getValues("advanced.abTestingVariants").filter((_, i) => i !== index);
                                      form.setValue("advanced.abTestingVariants", newVariants);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          <FormDescription>
                            Define variants and their traffic distribution percentages (must add up to 100%).
                          </FormDescription>
                        </div>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="advanced.loadTimeoutMs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Load Timeout (ms): {field.value}</FormLabel>
                            <FormControl>
                              <Slider
                                min={1000}
                                max={30000}
                                step={1000}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum time to wait for widget to load
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <div className="pt-4">
                        <Label className="mb-2 block">Custom Parameters</Label>
                        <FormDescription className="mb-2">
                          Add custom parameters to be passed to the widget
                        </FormDescription>
                        <div className="space-y-2">
                          {Object.entries(form.watch("advanced.customParameters") || {}).map(([key, value], index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder="Parameter Name"
                                value={key}
                                onChange={(e) => {
                                  const params = {...form.getValues("advanced.customParameters")};
                                  const oldKey = key;
                                  delete params[oldKey];
                                  params[e.target.value] = value;
                                  form.setValue("advanced.customParameters", params);
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={value as string}
                                onChange={(e) => {
                                  const params = {...form.getValues("advanced.customParameters")};
                                  params[key] = e.target.value;
                                  form.setValue("advanced.customParameters", params);
                                }}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const params = {...form.getValues("advanced.customParameters")};
                                  delete params[key];
                                  form.setValue("advanced.customParameters", params);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const params = {...form.getValues("advanced.customParameters")};
                              params[`param${Object.keys(params).length + 1}`] = "";
                              form.setValue("advanced.customParameters", params);
                            }}
                          >
                            Add Parameter
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      className="relative"
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Embed Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmbedCodeGenerator config={form.getValues()} />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/5">
          <div className="sticky top-6 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <LayoutTemplate className="mr-2 h-5 w-5" />
                  Live Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex bg-muted p-0.5 rounded-md">
                    <Button
                      variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 px-2.5"
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "tablet" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 px-2.5"
                      onClick={() => setPreviewDevice("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 px-2.5"
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewVisible(!previewVisible)}
                  >
                    {previewVisible ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {previewVisible ? (
                  <div className="bg-gray-100 rounded-lg p-4 min-h-[550px] flex items-center justify-center relative">
                    <DevicePreview device={previewDevice}>
                      <WidgetPreview 
                        config={form.getValues()}
                        showWelcomeButtons={form.watch("behavior.welcomeButtons")?.length > 0}
                      />
                    </DevicePreview>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                    <Button variant="outline" onClick={() => setPreviewVisible(true)}>
                      Show Preview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Export & Deploy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export your widget configuration or deploy it directly to your production environment.
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export as JSON
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Code className="mr-2 h-4 w-4" />
                      Export as JavaScript
                    </Button>
                    <Button className="justify-start">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Deploy to Production
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered suggestions to improve your widget configuration.
                  </p>
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start group hover:bg-primary hover:text-white transition-colors">
                      <Zap className="mr-2 h-4 w-4 group-hover:text-white text-amber-500" />
                      <span>Generate optimized configuration</span>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start group hover:bg-primary hover:text-white transition-colors">
                      <Brush className="mr-2 h-4 w-4 group-hover:text-white text-amber-500" />
                      <span>Suggest color scheme from logo</span>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start group hover:bg-primary hover:text-white transition-colors">
                      <FlaskConical className="mr-2 h-4 w-4 group-hover:text-white text-amber-500" />
                      <span>Recommend A/B test variants</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfigPage;