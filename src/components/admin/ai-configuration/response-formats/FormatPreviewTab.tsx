
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { ResponseFormat } from "@/types/ai-configuration";

interface FormatPreviewTabProps {
  testPrompt: string;
  testResponse: string;
  formatSettings: Partial<ResponseFormat>;
  onGoToSettings: () => void;
}

export function FormatPreviewTab({
  testPrompt,
  testResponse,
  formatSettings,
  onGoToSettings,
}: FormatPreviewTabProps) {
  return (
    <div className="space-y-6">
      <Card className="h-full shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Format Preview</span>
            <Button size="sm" variant="outline" onClick={onGoToSettings}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
            </Button>
          </CardTitle>
          <CardDescription>
            {formatSettings.name ? `"${formatSettings.name}"` : "New Format"} - See how your format affects AI responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Original Prompt:</h3>
            <div className="rounded-lg bg-muted p-4 text-sm">
              {testPrompt || "No prompt provided"}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Format Template:</h3>
            <div className="rounded-lg bg-muted p-4 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[200px]">
              {formatSettings.content || "No template defined"}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Formatted Response:</h3>
            <div className="rounded-lg border p-4 bg-card text-sm whitespace-pre-wrap overflow-auto max-h-[300px]">
              {testResponse ? (
                testResponse
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mb-2 opacity-50" />
                  <p>Click "Test Format" to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            This preview shows how your format transforms AI responses.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
