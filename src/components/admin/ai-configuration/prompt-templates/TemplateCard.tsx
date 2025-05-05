
import { Edit, Copy, Trash2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PromptTemplate } from "@/types/ai-configuration";

interface TemplateCardProps {
  template: PromptTemplate;
  categoryName: string;
  onEdit: (template: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (template: PromptTemplate) => void;
}

export const TemplateCard = ({
  template,
  categoryName,
  onEdit,
  onDelete,
  onClone,
}: TemplateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {template.name}
              {template.isDefault && (
                <Badge className="ml-2" variant="secondary">
                  Default
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(template)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClone(template)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(template.id)}
              disabled={template.isDefault}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap text-sm">
              {template.template}
            </pre>
          </div>
          <div>
            <Label>Variables</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {template.variables &&
                template.variables.map((variable) => (
                  <Badge key={variable.name} variant="outline">
                    {variable.name}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="mr-2 h-4 w-4" />
          {categoryName || "General"}
        </div>
      </CardFooter>
    </Card>
  );
};
