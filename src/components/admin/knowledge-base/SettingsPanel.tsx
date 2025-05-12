
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface KnowledgeBaseSettings {
  maxTokensPerChunk: number;
  chunkOverlap: number;
  similarityThreshold: number;
  maxResults: number;
  includeMetadata: boolean;
  enableFuzzySearch: boolean;
  [key: string]: any; // Add index signature to allow string keys
}

interface UpdateSettingsRequest {
  [key: string]: any;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<KnowledgeBaseSettings>({
    maxTokensPerChunk: 512,
    chunkOverlap: 50,
    similarityThreshold: 0.75,
    maxResults: 5,
    includeMetadata: true,
    enableFuzzySearch: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base Settings</CardTitle>
        <CardDescription>
          Configure how your documents are processed and searched
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="maxTokensPerChunk">
              Max Tokens Per Chunk
            </Label>
            <span className="text-sm text-muted-foreground">
              {settings.maxTokensPerChunk}
            </span>
          </div>
          <Slider
            id="maxTokensPerChunk"
            min={128}
            max={2048}
            step={128}
            value={[settings.maxTokensPerChunk]}
            onValueChange={(value) =>
              setSettings({ ...settings, maxTokensPerChunk: value[0] })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Controls the size of document chunks for processing
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="chunkOverlap">Chunk Overlap (%)</Label>
            <span className="text-sm text-muted-foreground">
              {settings.chunkOverlap}%
            </span>
          </div>
          <Slider
            id="chunkOverlap"
            min={0}
            max={100}
            step={5}
            value={[settings.chunkOverlap]}
            onValueChange={(value) =>
              setSettings({ ...settings, chunkOverlap: value[0] })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="similarityThreshold">
              Similarity Threshold
            </Label>
            <span className="text-sm text-muted-foreground">
              {settings.similarityThreshold}
            </span>
          </div>
          <Slider
            id="similarityThreshold"
            min={0.1}
            max={1}
            step={0.05}
            value={[settings.similarityThreshold]}
            onValueChange={(value) =>
              setSettings({ ...settings, similarityThreshold: value[0] })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher values require a closer match between query and content
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxResults">Max Search Results</Label>
          <Input
            id="maxResults"
            type="number"
            min={1}
            max={20}
            value={settings.maxResults}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxResults: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeMetadata"
            checked={settings.includeMetadata}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, includeMetadata: checked })
            }
          />
          <Label htmlFor="includeMetadata">Include Metadata</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enableFuzzySearch"
            checked={settings.enableFuzzySearch}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enableFuzzySearch: checked })
            }
          />
          <Label htmlFor="enableFuzzySearch">Enable Fuzzy Search</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
