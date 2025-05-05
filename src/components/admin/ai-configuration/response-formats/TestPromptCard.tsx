
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";

export interface TestPromptCardProps {
  testPrompt: string;
  setTestPrompt: Dispatch<SetStateAction<string>>;
  handleTest: () => Promise<void>;
  isTesting: boolean;
  disabled?: boolean;
}

export function TestPromptCard({
  testPrompt,
  setTestPrompt,
  handleTest,
  isTesting,
  disabled = false
}: TestPromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Format</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter a sample prompt to test the format..."
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          rows={5}
          disabled={isTesting || disabled}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Enter a prompt that you'd like to see formatted according to the current settings.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTest} 
          disabled={!testPrompt || isTesting || disabled}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Formatting...
            </>
          ) : (
            'Test Format'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
