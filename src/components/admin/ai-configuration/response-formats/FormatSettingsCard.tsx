
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ResponseFormat } from "@/types/ai-configuration";
import { Loader2, Save, Trash } from "lucide-react";

interface FormatSettingsCardProps {
  formatSettings: Partial<ResponseFormat>;
  setFormatSettings: React.Dispatch<React.SetStateAction<Partial<ResponseFormat>>>;
  handleSave: () => void;
  onDelete: () => void;
  isNew: boolean;
  isLoading: boolean;
}

export function FormatSettingsCard({
  formatSettings,
  setFormatSettings,
  handleSave,
  onDelete,
  isNew,
  isLoading,
}: FormatSettingsCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleFieldChange = <K extends keyof ResponseFormat>(
    field: K,
    value: ResponseFormat[K]
  ) => {
    setFormatSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Format Settings</CardTitle>
        <CardDescription>
          {isNew
            ? "Create a new response format"
            : "Edit response format settings"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formatSettings.name || ""}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Format name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formatSettings.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Format description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Template</Label>
          <Textarea
            id="content"
            value={formatSettings.content || ""}
            onChange={(e) => handleFieldChange("content", e.target.value)}
            placeholder="Enter the response template..."
            className="min-h-[150px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Use variables like {{content}} and {{sources}} in your template.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="systemInstructions">System Instructions</Label>
          <Textarea
            id="systemInstructions"
            value={formatSettings.systemInstructions || ""}
            onChange={(e) => handleFieldChange("systemInstructions", e.target.value)}
            placeholder="Instructions for the AI on how to format responses..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isDefault"
            checked={formatSettings.isDefault || false}
            onCheckedChange={(checked) =>
              handleFieldChange("isDefault", checked)
            }
          />
          <Label htmlFor="isDefault">Set as default format</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isNew ? (
          <div>
            {showConfirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confirm?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  disabled={isLoading || formatSettings.isDefault}
                >
                  Yes, Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(true)}
                disabled={isLoading || formatSettings.isDefault}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Format
              </Button>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <Button
          onClick={handleSave}
          disabled={
            isLoading ||
            !formatSettings.name ||
            !formatSettings.content
          }
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Format
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
