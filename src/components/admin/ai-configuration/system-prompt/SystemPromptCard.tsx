
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useSystemPrompt } from "@/hooks/ai-configuration/useSystemPrompt";
import { SystemPrompt } from "@/types/ai-configuration";

export function SystemPromptCard() {
  const [promptContent, setPromptContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const { systemPrompt, isLoadingPrompt, isUpdatingPrompt, updatePrompt } = useSystemPrompt();

  useEffect(() => {
    if (systemPrompt) {
      setPromptContent(systemPrompt.content);
    }
  }, [systemPrompt]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptContent(e.target.value);
    setHasChanges(systemPrompt ? e.target.value !== systemPrompt.content : e.target.value !== "");
  };

  const handleSave = async () => {
    await updatePrompt(promptContent);
    setHasChanges(false);
  };

  const handleDiscard = () => {
    if (systemPrompt) {
      setPromptContent(systemPrompt.content);
    }
    setHasChanges(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>System Prompt</CardTitle>
        <CardDescription>
          This system prompt is used to guide the AI's responses across all chat sessions.
          It sets the tone, personality, and behavior guidelines for the AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingPrompt ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Textarea
            className="min-h-[250px] font-mono text-sm"
            placeholder="Enter your system prompt here..."
            value={promptContent}
            onChange={handleContentChange}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {hasChanges && (
          <Button variant="outline" onClick={handleDiscard} disabled={isUpdatingPrompt}>
            Discard
          </Button>
        )}
        <Button onClick={handleSave} disabled={!hasChanges || isUpdatingPrompt}>
          {isUpdatingPrompt ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
