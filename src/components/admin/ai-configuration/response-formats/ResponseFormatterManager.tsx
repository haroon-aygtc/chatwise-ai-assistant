import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FormatSettingsCard } from "./FormatSettingsCard";
import { FormatPreviewTab } from "./FormatPreviewTab";
import { useResponseFormats } from "@/hooks/ai-configuration/useResponseFormats";
import { ResponseFormat } from "@/types/ai-configuration";
import { Loader2 } from "lucide-react";

export function ResponseFormatterManager() {
  const [activeTab, setActiveTab] = useState("settings");
  const [testPrompt, setTestPrompt] = useState("Explain the theory of relativity");
  const [testResponse, setTestResponse] = useState("");
  const [isNew, setIsNew] = useState(false);
  const {
    formats,
    defaultFormat,
    selectedFormat,
    setSelectedFormat,
    isLoadingFormats,
    isLoadingDefaultFormat,
    isSaving,
    isDeleting,
    isSettingDefault,
    isTesting,
    formatsError,
    createFormat,
    updateFormat,
    deleteFormat,
    setDefaultFormat,
    testFormat,
    refetchFormats,
  } = useResponseFormats();

  const [formatSettings, setFormatSettings] = useState<Partial<ResponseFormat>>({
    name: "",
    description: "",
    content: "# {title}\n\n{content}\n\nSources:\n{sources}",
    systemInstructions: "You are a helpful AI assistant. Format your responses using the template provided.",
    length: "medium",
    tone: "neutral",
    options: {
      useHeadings: true,
      useBulletPoints: true,
      includeLinks: true,
      formatCodeBlocks: true,
    },
  });

  useEffect(() => {
    if (selectedFormat) {
      setFormatSettings(selectedFormat);
      setIsNew(false);
    } else {
      setFormatSettings({
        name: "",
        description: "",
        content: "# {title}\n\n{content}\n\nSources:\n{sources}",
        systemInstructions: "You are a helpful AI assistant. Format your responses using the template provided.",
        length: "medium",
        tone: "neutral",
        options: {
          useHeadings: true,
          useBulletPoints: true,
          includeLinks: true,
          formatCodeBlocks: true,
        },
      });
    }
  }, [selectedFormat]);

  const handleCreateFormat = async () => {
    setFormatSettings((prev) => ({
      ...prev,
      content: prev.content || "# {title}\n\n{content}\n\nSources:\n{sources}",
    }));
    setIsNew(true);
    setSelectedFormat(null);
    setActiveTab("settings");
  };

  const handleSaveFormat = async () => {
    if (isNew) {
      const success = await createFormat(formatSettings);
      if (success) {
        refetchFormats();
        setIsNew(false);
      }
    } else if (selectedFormat) {
      const success = await updateFormat(selectedFormat.id, formatSettings);
      if (success) {
        refetchFormats();
      }
    }
  };

  const handleDeleteFormat = async () => {
    if (selectedFormat) {
      await deleteFormat(selectedFormat.id);
      setSelectedFormat(null);
      setFormatSettings({
        name: "",
        description: "",
        content: "# {title}\n\n{content}\n\nSources:\n{sources}",
        systemInstructions: "You are a helpful AI assistant. Format your responses using the template provided.",
        length: "medium",
        tone: "neutral",
        options: {
          useHeadings: true,
          useBulletPoints: true,
          includeLinks: true,
          formatCodeBlocks: true,
        },
      });
    }
  };

  const handleSetDefaultFormat = async () => {
    if (selectedFormat) {
      await setDefaultFormat(selectedFormat.id);
    }
  };

  const handleTestFormat = async () => {
    if (formatSettings.id) {
      const result = await testFormat(formatSettings.id, testPrompt);
      setTestResponse(result?.formatted || "Test failed.");
      setActiveTab("preview");
    } else {
      toast({
        title: "Error",
        description: "Please save the format first.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Response Formatting
          </h2>
          <p className="text-muted-foreground">
            Customize how AI responses are structured and presented
          </p>
        </div>
        <Button onClick={handleCreateFormat}>Add Format</Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-background">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Available Formats</CardTitle>
                  <CardDescription>
                    Select a format to edit or create a new one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingFormats ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading formats...
                    </div>
                  ) : formatsError ? (
                    <div className="text-red-500">Error: {formatsError.message}</div>
                  ) : (
                    <div className="space-y-2">
                      {formats.map((format) => (
                        <Button
                          key={format.id}
                          variant={selectedFormat?.id === format.id ? "secondary" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setSelectedFormat(format)}
                        >
                          {format.name} {format.isDefault ? "(Default)" : ""}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <FormatSettingsCard
              formatSettings={formatSettings}
              setFormatSettings={setFormatSettings}
              handleSave={handleSaveFormat}
              onDelete={handleDeleteFormat}
              isNew={isNew}
              isLoading={isSaving || isDeleting}
            />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="space-y-4">
          <FormatPreviewTab
            testPrompt={testPrompt}
            testResponse={testResponse}
            formatSettings={formatSettings}
            onGoToSettings={() => setActiveTab("settings")}
          />
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Enter test prompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
            />
            <Button onClick={handleTestFormat} disabled={isTesting}>
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Format"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
