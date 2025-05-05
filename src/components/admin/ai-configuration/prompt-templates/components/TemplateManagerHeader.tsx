
import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateManagerHeaderProps {
  onRefresh: () => void;
  onAddTemplate: () => void;
  isLoading: boolean;
  standalone?: boolean;
}

export const TemplateManagerHeader = ({
  onRefresh,
  onAddTemplate,
  isLoading,
  standalone = false,
}: TemplateManagerHeaderProps) => {
  if (!standalone) return null;
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Prompt Templates</h1>
        <p className="text-muted-foreground">
          Create and manage reusable prompt templates for your AI
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button onClick={onAddTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>
    </div>
  );
};
