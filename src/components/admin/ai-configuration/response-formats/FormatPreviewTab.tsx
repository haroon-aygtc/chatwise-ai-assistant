
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Play } from "lucide-react";
import { ResponseFormat } from "@/types/ai-configuration";

interface FormatPreviewTabProps {
  testResponse: string;
  testPrompt: string;
  formatSettings: ResponseFormat;
  onGoToSettings: () => void;
}

export const FormatPreviewTab = ({ 
  testResponse, 
  testPrompt, 
  formatSettings,
  onGoToSettings
}: FormatPreviewTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Format Preview</CardTitle>
          <CardDescription>
            See how your AI responses will be formatted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testResponse ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/20">
                <div className="text-sm text-muted-foreground mb-2">
                  Prompt: {testPrompt}
                </div>
                <Separator className="my-2" />
                <div className="whitespace-pre-wrap">{testResponse}</div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Format Settings
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      <span className="font-medium">Format:</span>{" "}
                      {formatSettings.format}
                    </li>
                    <li>
                      <span className="font-medium">Length:</span>{" "}
                      {formatSettings.length}
                    </li>
                    <li>
                      <span className="font-medium">Tone:</span>{" "}
                      {formatSettings.tone}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Enabled Options
                  </h4>
                  <ul className="text-sm space-y-1">
                    {Object.entries(formatSettings.options).map(
                      ([key, value]) =>
                        value && (
                          <li key={key}>
                            <Check className="inline h-3 w-3 mr-1 text-green-500" />
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>
                No preview available. Run a test to see the formatted
                response.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={onGoToSettings}
              >
                Go to Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Markdown Support</CardTitle>
          <CardDescription>
            Your AI responses support these Markdown elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Text Formatting</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <code>**Bold**</code> - <strong>Bold</strong>
                </li>
                <li>
                  <code>*Italic*</code> - <em>Italic</em>
                </li>
                <li>
                  <code>~~Strikethrough~~</code> - <s>Strikethrough</s>
                </li>
                <li>
                  <code>`Code`</code> - <code>Code</code>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Structure</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <code># Heading 1</code> - Heading 1
                </li>
                <li>
                  <code>## Heading 2</code> - Heading 2
                </li>
                <li>
                  <code>* Bullet point</code> - Bullet point
                </li>
                <li>
                  <code>1. Numbered list</code> - Numbered list
                </li>
                <li>
                  <code>[Link](url)</code> - Link
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormatPreviewTab;
