
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Save, Wand2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ResponseFormat } from "@/types/ai-configuration";
import {
  getAllResponseFormats,
  createResponseFormat,
  updateResponseFormat,
  deleteResponseFormat,
  setDefaultResponseFormat,
  testResponseFormat,
} from "@/services/response-format";
import { FormatSettingsCard } from "./FormatSettingsCard";
import { TestPromptCard } from "./TestPromptCard";
import { SavedFormatsCard } from "./SavedFormatsCard";
import { FormatPreviewTab } from "./FormatPreviewTab";

export interface ResponseFormatterManagerProps {
  standalone?: boolean;
}

const ResponseFormatterManager = ({
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

  const handleDeleteFormat = () => {
    if (window.confirm("Are you sure you want to delete this format?")) {
      deleteFormatMutation.mutate(formatSettings.id);
    }
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
                  <Save className="mr-2 h-4 w-4" /> Saving...
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
          <FormatSettingsCard 
            formatSettings={formatSettings}
            setFormatSettings={setFormatSettings}
            handleSave={handleSave}
            onDelete={handleDeleteFormat}
            isDeleting={deleteFormatMutation.isPending}
            isSaving={createFormatMutation.isPending || updateFormatMutation.isPending}
          />

          <TestPromptCard 
            testPrompt={testPrompt}
            setTestPrompt={setTestPrompt}
            handleTest={handleTest}
            isTesting={testFormatMutation.isPending}
          />
          
          {formats && formats.length > 0 && (
            <SavedFormatsCard 
              formats={formats}
              onSelectFormat={setFormatSettings}
              onSetDefault={(id) => setDefaultMutation.mutate(id)}
              isSettingDefault={setDefaultMutation.isPending}
            />
          )}
        </TabsContent>

        <TabsContent value="preview">
          <FormatPreviewTab 
            testResponse={testResponse}
            testPrompt={testPrompt}
            formatSettings={formatSettings}
            onGoToSettings={() => setActiveTab("settings")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseFormatterManager;
