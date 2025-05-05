
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus } from "lucide-react";

interface AddModelCardProps {
  onAddModel: () => void;
}

export const AddModelCard: React.FC<AddModelCardProps> = ({ onAddModel }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-muted-foreground" /> Add Model
        </CardTitle>
        <CardDescription>Configure a new AI model</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] flex items-center justify-center border-2 border-dashed rounded-md">
          <div className="text-center">
            <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Click to add a new AI model
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={onAddModel}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Model
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
