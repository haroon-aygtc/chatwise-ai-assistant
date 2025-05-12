
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FormatSettingsCard } from "./FormatSettingsCard";
import { SavedFormatsCard } from "./SavedFormatsCard";
import { PreviewCard } from "./PreviewCard";
import { TestPromptCard } from "./TestPromptCard";
import { FormatPreviewTab } from "./FormatPreviewTab";
import { Separator } from "@/components/ui/separator";
import { ResponseFormat, CreateResponseFormatRequest } from "@/types/ai-configuration";
import { useResponseFormats } from "@/hooks/ai-configuration/useResponseFormats";

const ResponseFormatterManager = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [currentFormat, setCurrentFormat] = useState<Partial<ResponseFormat>>({
    name: "",
    description: "",
    format: "json",
    template: "", 
    systemInstructions: "", 
    content: "", 
    active: true
  });

  const { 
    formats, 
    isLoading, 
    error, 
    createFormat, 
    updateFormat, 
    deleteFormat,
    setSelectedFormat,
    isSaving,
    testFormat
  } = useResponseFormats();

  const [testPrompt, setTestPrompt] = useState("");
  const [formattedResponse, setFormattedResponse] = useState("");
  const [isTestingFormat, setIsTestingFormat] = useState(false);

  const handleFormatChange = (field: keyof ResponseFormat, value: any) => {
    setCurrentFormat((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveFormat = async () => {
    if (!currentFormat.name || !currentFormat.format) {
      return false;
    }

    try {
      if (currentFormat.id) {
        await updateFormat(currentFormat.id, currentFormat);
      } else {
        // Convert to CreateResponseFormatRequest by ensuring required fields are present
        const formatRequest: CreateResponseFormatRequest = {
          name: currentFormat.name,
          format: currentFormat.format,
          description: currentFormat.description,
          template: currentFormat.template,
          systemInstructions: currentFormat.systemInstructions,
          content: currentFormat.content,
          active: currentFormat.active ?? true
        };
        await createFormat(formatRequest);
      }
      setCurrentFormat({
        name: "",
        description: "",
        format: "json",
        template: "",
        systemInstructions: "",
        content: "",
        active: true
      });
      return true;
    } catch (error) {
      console.error("Error saving format:", error);
      return false;
    }
  };

  const handleDeleteFormat = async () => {
    if (!currentFormat.id) return;
    await deleteFormat(currentFormat.id);
    setCurrentFormat({
      name: "",
      description: "",
      format: "json",
      template: "",
      systemInstructions: "",
      content: "",
      active: true
    });
  };

  const handleTestFormat = async () => {
    if (!currentFormat.id || !testPrompt.trim()) return;
    
    setIsTestingFormat(true);
    try {
      const result = await testFormat(currentFormat.id, testPrompt);
      if (result) {
        setFormattedResponse(result.formatted);
        setActiveTab("preview");
      }
    } catch (error) {
      console.error("Error testing format:", error);
    } finally {
      setIsTestingFormat(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium">Response Format Manager</h3>
        <p className="text-muted-foreground">
          Create and manage response formats for your AI models
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="settings">Format Settings</TabsTrigger>
              <TabsTrigger value="preview">Format Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <FormatSettingsCard
                    formatSettings={currentFormat}
                    setFormatSettings={setCurrentFormat}
                    handleSave={handleSaveFormat}
                    onDelete={handleDeleteFormat}
                    isNew={!currentFormat.id}
                    isLoading={isSaving}
                  />
                  <TestPromptCard
                    value={testPrompt}
                    onChange={setTestPrompt}
                    selectedFormatId={currentFormat.id || ""}
                    onTest={handleTestFormat}
                    isLoading={isTestingFormat}
                  />
                </div>
                <div>
                  <SavedFormatsCard
                    formats={formats}
                    selectedFormatId={currentFormat.id || ""}
                    onSelectFormat={(format) => {
                      setCurrentFormat(format);
                      setSelectedFormat(format);
                    }}
                    onNewFormat={() => {
                      setCurrentFormat({
                        name: "",
                        description: "",
                        format: "json",
                        template: "",
                        systemInstructions: "",
                        content: "",
                        active: true
                      });
                    }}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <FormatPreviewTab 
                testPrompt={testPrompt}
                testResponse={formattedResponse}
                formatSettings={currentFormat}
                onGoToSettings={() => setActiveTab("settings")}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 border border-destructive text-destructive rounded-md">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default ResponseFormatterManager;
