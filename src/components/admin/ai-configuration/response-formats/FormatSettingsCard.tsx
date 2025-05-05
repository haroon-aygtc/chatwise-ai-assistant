
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heading, List, LinkIcon, Code, Type, Check, Loader2 } from "lucide-react";
import { ResponseFormat } from "@/types/ai-configuration";

interface FormatSettingsCardProps {
  formatSettings: ResponseFormat;
  setFormatSettings: React.Dispatch<React.SetStateAction<ResponseFormat>>;
  handleSave: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isSaving: boolean;
}

export const FormatSettingsCard = ({
  formatSettings,
  setFormatSettings,
  handleSave,
  onDelete,
  isDeleting,
  isSaving
}: FormatSettingsCardProps) => {
  const handleFormatChange = (
    value: "conversational" | "structured" | "bullet-points" | "step-by-step",
  ) => {
    setFormatSettings({ ...formatSettings, format: value });
  };

  const handleLengthChange = (value: "concise" | "medium" | "detailed") => {
    setFormatSettings({ ...formatSettings, length: value });
  };

  const handleToneChange = (
    value: "professional" | "friendly" | "casual" | "technical",
  ) => {
    setFormatSettings({ ...formatSettings, tone: value });
  };

  const handleOptionChange = (
    option: keyof typeof formatSettings.options,
    value: boolean,
  ) => {
    setFormatSettings({
      ...formatSettings,
      options: {
        ...formatSettings.options,
        [option]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Formatting</CardTitle>
        <CardDescription>
          Configure how AI responses are structured
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format Name</Label>
            <Input 
              value={formatSettings.name} 
              onChange={(e) => setFormatSettings({...formatSettings, name: e.target.value})}
              placeholder="Enter a name for this format"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={formatSettings.description || ''} 
              onChange={(e) => setFormatSettings({...formatSettings, description: e.target.value})}
              placeholder="Enter a description for this format"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Format</Label>
              <Select
                value={formatSettings.format}
                onValueChange={handleFormatChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversational">
                    <div className="flex items-center">
                      <Type className="mr-2 h-4 w-4" />
                      <span>Conversational</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="structured">
                    <div className="flex items-center">
                      <Heading className="mr-2 h-4 w-4" />
                      <span>Structured</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bullet-points">
                    <div className="flex items-center">
                      <List className="mr-2 h-4 w-4" />
                      <span>Bullet Points</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="step-by-step">
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      <span>Step by Step</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Response Length</Label>
              <Select
                value={formatSettings.length}
                onValueChange={handleLengthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tone of Voice</Label>
            <Select
              value={formatSettings.tone}
              onValueChange={handleToneChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Formatting Options</Label>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="headings"
                  checked={formatSettings.options.useHeadings}
                  onCheckedChange={(checked) =>
                    handleOptionChange("useHeadings", checked)
                  }
                />
                <Label htmlFor="headings" className="flex items-center">
                  <Heading className="mr-2 h-4 w-4" /> Use Headings
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="bullet-points"
                  checked={formatSettings.options.useBulletPoints}
                  onCheckedChange={(checked) =>
                    handleOptionChange("useBulletPoints", checked)
                  }
                />
                <Label
                  htmlFor="bullet-points"
                  className="flex items-center"
                >
                  <List className="mr-2 h-4 w-4" /> Use Bullet Points
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="links"
                  checked={formatSettings.options.includeLinks}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeLinks", checked)
                  }
                />
                <Label htmlFor="links" className="flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" /> Include Links
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="code-blocks"
                  checked={formatSettings.options.formatCodeBlocks}
                  onCheckedChange={(checked) =>
                    handleOptionChange("formatCodeBlocks", checked)
                  }
                />
                <Label
                  htmlFor="code-blocks"
                  className="flex items-center"
                >
                  <Code className="mr-2 h-4 w-4" /> Format Code Blocks
                </Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is-default"
              checked={formatSettings.isDefault || false}
              onCheckedChange={(checked) =>
                setFormatSettings({...formatSettings, isDefault: checked})
              }
            />
            <Label htmlFor="is-default" className="font-medium">
              Set as Default Format
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {formatSettings.id && (
          <Button
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting || formatSettings.isDefault}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Delete Format
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormatSettingsCard;
