
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { ResponseFormat } from "@/types/ai-configuration";

export interface FormatPreviewTabProps {
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
            <span>Response Format Preview</span>
            <Button variant="ghost" size="sm" onClick={onGoToSettings}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Settings
            </Button>
          </CardTitle>
          <CardDescription>
            See how your response will be formatted using this template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Test Prompt</h4>
              <div className="p-3 bg-muted rounded-md text-sm">{testPrompt}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Format Template</h4>
              <div className="p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap">
                {formatSettings.content || "No template defined"}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Result</h4>
              <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {testResponse || "No response yet. Click 'Test Format' to see results."}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
