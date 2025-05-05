
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { KnowledgeBaseSettings } from "@/types/knowledge-base";

export const SettingsPanel = () => {
  const [settings, setSettings] = useState<KnowledgeBaseSettings>({
    isEnabled: true,
    priority: 'medium',
    includeCitations: true
  });

  // Fetch settings
  const { 
    data: fetchedSettings,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['knowledgeBase', 'settings'],
    queryFn: KnowledgeBaseService.getSettings
  });

  // Update settings when fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: KnowledgeBaseSettings) => KnowledgeBaseService.updateSettings(data),
    onSuccess: (updatedSettings) => {
      setSettings(updatedSettings);
      toast.success("Settings saved successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to save settings: ${error.message || "Unknown error"}`);
    }
  });

  // Handle settings change
  const handleSettingChange = (key: keyof KnowledgeBaseSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading settings</p>
          <Button variant="outline" className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base Settings</CardTitle>
        <CardDescription>
          Configure how your knowledge base integrates with AI responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="kb-integration">
                Knowledge Base Integration
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable AI to use your knowledge base for responses
              </p>
            </div>
            <Switch 
              id="kb-integration" 
              checked={settings.isEnabled}
              onCheckedChange={(checked) => handleSettingChange('isEnabled', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="kb-priority">Knowledge Priority</Label>
              <p className="text-sm text-muted-foreground">
                How strongly should AI prefer knowledge base over general
                knowledge
              </p>
            </div>
            <Select 
              value={settings.priority}
              onValueChange={(value) => handleSettingChange('priority', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="kb-citation">Include Citations</Label>
              <p className="text-sm text-muted-foreground">
                Add source references to AI responses
              </p>
            </div>
            <Switch 
              id="kb-citation" 
              checked={settings.includeCitations}
              onCheckedChange={(checked) => handleSettingChange('includeCitations', checked)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="ml-auto"
          onClick={handleSaveSettings}
          disabled={saveSettingsMutation.isPending}
        >
          {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};
