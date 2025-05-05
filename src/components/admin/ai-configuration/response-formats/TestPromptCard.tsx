
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2 } from "lucide-react";

interface TestPromptCardProps {
  testPrompt: string;
  setTestPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleTest: () => void;
  isTesting: boolean;
}

export const TestPromptCard = ({
  testPrompt,
  setTestPrompt,
  handleTest,
  isTesting
}: TestPromptCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Format Preview</CardTitle>
        <CardDescription>
          Test your formatting settings with a sample prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Test Prompt</Label>
            <Textarea
              placeholder="Enter a test prompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleTest}
              disabled={isTesting || !testPrompt.trim()}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Test Format
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestPromptCard;
