
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SystemPrompt } from "@/types/ai-configuration";

interface SystemPromptCardProps {
  systemPrompt: SystemPrompt | null;
  onSave: (content: string) => Promise<boolean>;
  isSaving: boolean;
}

export const SystemPromptCard: React.FC<SystemPromptCardProps> = ({
  systemPrompt,
  onSave,
  isSaving,
}) => {
  const [content, setContent] = useState(systemPrompt?.content || "");
  const [editing, setEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsChanged(e.target.value !== systemPrompt?.content);
  };

  const handleSave = async () => {
    const success = await onSave(content);
    if (success) {
      setEditing(false);
      setIsChanged(false);
    }
  };

  const handleCancel = () => {
    setContent(systemPrompt?.content || "");
    setEditing(false);
    setIsChanged(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>System Prompt</div>
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!isChanged || isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Enter system prompt..."
          rows={10}
          className="font-mono"
          readOnly={!editing}
        />
        <p className="text-xs text-muted-foreground mt-2">
          The system prompt sets the AI's behavior for all conversations.
        </p>
      </CardContent>
    </Card>
  );
}
