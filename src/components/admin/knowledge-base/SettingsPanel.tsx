
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Skeleton } from "@/components/ui/skeleton";

export const SettingsPanel: React.FC = () => {
  const { settings, isLoadingSettings, handleUpdateSettings } = useKnowledgeBase();
  
  const [isEnabled, setIsEnabled] = useState(settings?.isEnabled || false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'exclusive'>(
    settings?.priority || 'medium'
  );
  const [includeCitations, setIncludeCitations] = useState(settings?.includeCitations || true);

  const handleSaveSettings = () => {
    handleUpdateSettings({
      isEnabled,
      priority,
      includeCitations
    });
    toast.success("Settings saved successfully");
  };

  if (isLoadingSettings) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base Settings</CardTitle>
        <CardDescription>
          Configure how your AI uses the knowledge base to answer questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="kb-active">Enable Knowledge Base</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your AI will use documents in the knowledge base to answer questions
            </p>
          </div>
          <Switch 
            id="kb-active" 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="kb-priority">Knowledge Priority Level</Label>
          <p className="text-sm text-muted-foreground">
            Determine how strongly the AI should rely on knowledge base information
          </p>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger id="kb-priority" className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Use only when directly relevant</SelectItem>
              <SelectItem value="medium">Medium - Balance with other knowledge</SelectItem>
              <SelectItem value="high">High - Prioritize over other knowledge</SelectItem>
              <SelectItem value="exclusive">Exclusive - Only use knowledge base</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="kb-citations">Include Citations</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, your AI will include document references in responses
            </p>
          </div>
          <Switch 
            id="kb-citations" 
            checked={includeCitations} 
            onCheckedChange={setIncludeCitations}
          />
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};
