
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { SystemPrompt } from "@/types/ai-configuration";

interface SystemPromptCardProps {
  systemPrompt: SystemPrompt | null | undefined;
  onSave: (content: string) => void;
  isSaving: boolean;
}

export function SystemPromptCard({ 
  systemPrompt, 
  onSave,
  isSaving,
}: SystemPromptCardProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (systemPrompt) {
      setContent(systemPrompt.content);
    }
  }, [systemPrompt]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>System Prompt</CardTitle>
        <CardDescription>
          The system prompt is sent at the beginning of every conversation to instruct the AI how to behave
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Textarea
            placeholder="Enter your system prompt..."
            className="min-h-[150px] resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              className="w-full md:w-auto"
              disabled={!content.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save System Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
