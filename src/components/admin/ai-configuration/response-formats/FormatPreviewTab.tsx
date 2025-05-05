
import { Button } from "@/components/ui/button";
import { ResponseFormat } from "@/types/ai-configuration";
import { ArrowLeft } from "lucide-react";

export interface FormatPreviewTabProps {
  testPrompt: string;
  testResponse: string;
  formatSettings: ResponseFormat;
  onGoToSettings: () => void;
}

export function FormatPreviewTab({
  testPrompt,
  testResponse,
  formatSettings,
  onGoToSettings
}: FormatPreviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onGoToSettings}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <span className="text-sm font-medium">
          Previewing: {formatSettings.name}
        </span>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Original Prompt</h3>
          <div className="bg-muted/50 p-4 rounded-md text-sm">
            {testPrompt || "No prompt provided"}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Formatted Response</h3>
          <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
            {testResponse || "No response generated yet"}
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-md space-y-2">
          <h3 className="text-sm font-medium">Format Settings Used</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Format Type:</span>{" "}
              {formatSettings.format}
            </div>
            <div>
              <span className="text-muted-foreground">Length:</span>{" "}
              {formatSettings.length}
            </div>
            <div>
              <span className="text-muted-foreground">Tone:</span>{" "}
              {formatSettings.tone}
            </div>
            <div>
              <span className="text-muted-foreground">Use Headings:</span>{" "}
              {formatSettings.options.useHeadings ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Use Bullet Points:</span>{" "}
              {formatSettings.options.useBulletPoints ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Include Links:</span>{" "}
              {formatSettings.options.includeLinks ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-muted-foreground">Format Code Blocks:</span>{" "}
              {formatSettings.options.formatCodeBlocks ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
