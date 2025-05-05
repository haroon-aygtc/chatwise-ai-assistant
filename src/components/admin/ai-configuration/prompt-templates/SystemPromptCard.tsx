
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface SystemPromptCardProps {
  systemPrompt: string;
  onSave: (prompt: string) => void;
  isSaving: boolean;
}

export const SystemPromptCard = ({
  systemPrompt,
  onSave,
  isSaving,
}: SystemPromptCardProps) => {
  const [prompt, setPrompt] = useState(systemPrompt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Prompt</CardTitle>
        <CardDescription>
          Define the base behavior of your AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Use variables like {"{company_name}"} or {"{user_name}"}
            </span>
            <span>Characters: {prompt.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="ml-auto"
          onClick={() => onSave(prompt)}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save System Prompt"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
