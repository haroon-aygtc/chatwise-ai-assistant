
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface TemplateManagerHeaderProps {
  standalone?: boolean;
  onRefresh: () => void;
  onAddTemplate: () => void;
  isLoading: boolean;
}

export const TemplateManagerHeader: React.FC<TemplateManagerHeaderProps> = ({
  standalone = false,
  onRefresh,
  onAddTemplate,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center">
      {standalone && (
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prompt Templates</h2>
          <p className="text-muted-foreground">
            Create and manage reusable prompt templates
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button onClick={onAddTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </div>
    </div>
  );
};
