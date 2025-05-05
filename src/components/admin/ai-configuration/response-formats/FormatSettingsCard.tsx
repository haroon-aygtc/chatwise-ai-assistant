
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ResponseFormat } from "@/types/ai-configuration";
import { Trash2 } from "lucide-react";

export interface FormatSettingsCardProps {
  formatSettings: ResponseFormat;
  setFormatSettings: React.Dispatch<React.SetStateAction<ResponseFormat>>;
  handleSave: () => Promise<void>;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function FormatSettingsCard({
  formatSettings,
  setFormatSettings,
  handleSave,
  onDelete,
  isSaving,
  isDeleting,
}: FormatSettingsCardProps) {
  const handleOptionChange = (key: keyof ResponseFormat['options'], value: boolean) => {
    setFormatSettings(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value
      }
    }));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Format Name</Label>
          <Input
            id="name"
            value={formatSettings.name}
            onChange={(e) => setFormatSettings({ ...formatSettings, name: e.target.value })}
            placeholder="Enter format name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formatSettings.description || ''}
            onChange={(e) => setFormatSettings({ ...formatSettings, description: e.target.value })}
            placeholder="Describe the format's purpose"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format-type">Format Type</Label>
          <Select
            value={formatSettings.format}
            onValueChange={(value) => setFormatSettings({ ...formatSettings, format: value as ResponseFormat['format'] })}
          >
            <SelectTrigger id="format-type">
              <SelectValue placeholder="Select format type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="structured">Structured</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Response Length</Label>
          <Select
            value={formatSettings.length}
            onValueChange={(value) => setFormatSettings({ ...formatSettings, length: value as ResponseFormat['length'] })}
          >
            <SelectTrigger id="length">
              <SelectValue placeholder="Select response length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">Concise</SelectItem>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            value={formatSettings.tone}
            onValueChange={(value) => setFormatSettings({ ...formatSettings, tone: value as ResponseFormat['tone'] })}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <Label>Additional Options</Label>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="use-headings" className="cursor-pointer">Use Headings</Label>
            <Switch
              id="use-headings"
              checked={formatSettings.options.useHeadings}
              onCheckedChange={(checked) => handleOptionChange('useHeadings', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="use-bullet-points" className="cursor-pointer">Use Bullet Points</Label>
            <Switch
              id="use-bullet-points"
              checked={formatSettings.options.useBulletPoints}
              onCheckedChange={(checked) => handleOptionChange('useBulletPoints', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="include-links" className="cursor-pointer">Include Links</Label>
            <Switch
              id="include-links"
              checked={formatSettings.options.includeLinks}
              onCheckedChange={(checked) => handleOptionChange('includeLinks', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="format-code-blocks" className="cursor-pointer">Format Code Blocks</Label>
            <Switch
              id="format-code-blocks"
              checked={formatSettings.options.formatCodeBlocks}
              onCheckedChange={(checked) => handleOptionChange('formatCodeBlocks', checked)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6 pt-4">
        {formatSettings.id && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={onDelete}
            disabled={isDeleting || isSaving}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving || isDeleting}
          className="ml-auto"
        >
          {isSaving ? 'Saving...' : 'Save Format'}
        </Button>
      </CardFooter>
    </Card>
  );
}
