
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import KnowledgeBaseService from "@/services/knowledge-base/knowledgeBaseService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const SettingsPanel: React.FC = () => {
  const queryClient = useQueryClient();
  
  // Fetch settings
  const { 
    data: settings, 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['knowledgeBase', 'settings'],
    queryFn: KnowledgeBaseService.getSettings
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: KnowledgeBaseService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'settings'] });
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message || "Unknown error"}`);
    }
  });

  const handleToggleIntegration = () => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      isEnabled: !settings.isEnabled
    });
  };

  const handleChangePriority = (value: 'low' | 'medium' | 'high' | 'exclusive') => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      priority: value
    });
  };

  const handleToggleCitations = () => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      includeCitations: !settings.includeCitations
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !settings) {
    return (
      <Card>
        <CardContent className="pt-6 text-center min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-destructive mb-2">Failed to load settings</p>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'settings'] })}
          >
            Retry
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
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="kb-integration">Knowledge Base Integration</Label>
            <p className="text-sm text-muted-foreground">
              Enable AI to use your knowledge base for responses
            </p>
          </div>
          <Switch 
            id="kb-integration" 
            checked={settings.isEnabled}
            onCheckedChange={handleToggleIntegration}
            disabled={updateSettingsMutation.isPending}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="kb-priority">Knowledge Priority</Label>
            <p className="text-sm text-muted-foreground">
              How strongly should AI prefer knowledge base over general knowledge
            </p>
          </div>
          <Select 
            value={settings.priority} 
            onValueChange={(value: any) => handleChangePriority(value)}
            disabled={updateSettingsMutation.isPending || !settings.isEnabled}
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
            onCheckedChange={handleToggleCitations}
            disabled={updateSettingsMutation.isPending || !settings.isEnabled}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          disabled={updateSettingsMutation.isPending}
          onClick={() => queryClient.invalidateQueries({ queryKey: ['knowledgeBase', 'settings'] })}
        >
          {updateSettingsMutation.isPending ? 
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
            null
          }
          {updateSettingsMutation.isPending ? "Saving..." : "Refresh Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};
