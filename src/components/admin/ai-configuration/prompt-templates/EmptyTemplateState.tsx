
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyTemplateStateProps {
  hasFilters: boolean;
  onAddTemplate: () => void;
}

export const EmptyTemplateState = ({
  hasFilters,
  onAddTemplate,
}: EmptyTemplateStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
        <p className="text-muted-foreground text-center mb-6">
          {hasFilters
            ? "No templates match your search criteria. Try adjusting your filters."
            : "You haven't created any prompt templates yet. Add your first template to get started."}
        </p>
        <Button onClick={onAddTemplate}>
          <Plus className="mr-2 h-4 w-4" /> Add Template
        </Button>
      </CardContent>
    </Card>
  );
};
