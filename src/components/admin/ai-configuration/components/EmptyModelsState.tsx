
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";

interface EmptyModelsStateProps {
  onAddModel: () => void;
}

export const EmptyModelsState: React.FC<EmptyModelsStateProps> = ({ onAddModel }) => {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Bot className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          No AI Models Configured
        </h3>
        <p className="text-muted-foreground text-center mb-6">
          You haven't added any AI models yet. Add your first model to get
          started with AI-powered chat.
        </p>
        <Button onClick={onAddModel}>
          <Plus className="mr-2 h-4 w-4" /> Add Your First Model
        </Button>
      </CardContent>
    </Card>
  );
};
