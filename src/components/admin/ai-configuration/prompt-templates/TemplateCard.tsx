import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptTemplate } from "@/types/ai-configuration";
import { Edit, Trash2, Variable, Play } from "lucide-react";

interface TemplateCardProps {
  template: PromptTemplate;
  onEdit: () => void;
  onDelete: () => void;
  onTest?: () => void;
}

export const TemplateCard = ({
  template,
  onEdit,
  onDelete,
  onTest,
}: TemplateCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{template.name}</CardTitle>
        {template.category && (
          <Badge variant="outline" className="w-fit">
            {template.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {template.description || "No description provided."}
        </p>
        {template.variables && template.variables.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Variable className="h-3.5 w-3.5" />
              <span>{template.variables.length} variables</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {template.variables.slice(0, 3).map((variable) => (
                <Badge
                  key={variable.name}
                  variant="secondary"
                  className="text-xs"
                >
                  {variable.name}
                </Badge>
              ))}
              {template.variables.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.variables.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {onTest && (
          <Button variant="outline" size="sm" onClick={onTest}>
            <Play className="h-4 w-4 mr-1" /> Test
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
