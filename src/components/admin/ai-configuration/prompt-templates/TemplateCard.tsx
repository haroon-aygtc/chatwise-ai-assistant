import React from "react";
import { PromptTemplate } from "@/types/ai-configuration";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Copy, Trash, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface TemplateCardProps {
  template: PromptTemplate;
  onEdit: (template: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (template: PromptTemplate) => void;
  onTest?: (template: PromptTemplate) => void;
  onSetDefault?: (template: PromptTemplate) => void;
}

/**
 * TemplateCard - A component for displaying template information
 * 
 * Features:
 * - Display template metadata (name, description, category, variables)
 * - Actions for editing, testing, cloning, and deleting templates
 * - Visual indication of active and default status
 */
export function TemplateCard({
  template,
  onEdit,
  onDelete,
  onClone,
  onTest,
  onSetDefault,
}: TemplateCardProps) {
  // Format the template creation/update date
  const getUpdatedTimeText = () => {
    if (!template.updatedAt) return "Recently";
    try {
      return `${formatDistanceToNow(new Date(template.updatedAt))} ago`;
    } catch (error) {
      return "Recently";
    }
  };

  // Get variable count for display
  const variableCount = Array.isArray(template.variables)
    ? template.variables.length
    : 0;

  // Format variable names for display
  const variableNames = Array.isArray(template.variables)
    ? template.variables.map(v => v.name || v).join(", ")
    : "";

  // Get a preview of the template content
  const getTemplatePreview = () => {
    const content = template.template || "";
    return content.length > 150
      ? `${content.substring(0, 150)}...`
      : content;
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      onDelete(template.id);
    }
  };

  return (
    <Card className={cn(
      "h-full flex flex-col transition-all",
      template.isDefault && "border-primary",
      !template.isActive && "opacity-60"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center">
              {template.name}
              {template.isDefault && (
                <Badge variant="default" className="ml-2">
                  Default
                </Badge>
              )}
            </CardTitle>

            <CardDescription className="mt-1">
              {template.category && (
                <Badge variant="outline" className="mr-2">
                  {template.category}
                </Badge>
              )}
              {!template.isActive && (
                <Badge variant="outline" className="bg-muted">
                  Inactive
                </Badge>
              )}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {onTest && (
                <DropdownMenuItem onClick={() => onTest(template)}>
                  <Play className="mr-2 h-4 w-4" />
                  Test
                </DropdownMenuItem>
              )}

              <DropdownMenuItem onClick={() => onClone(template)}>
                <Copy className="mr-2 h-4 w-4" />
                Clone
              </DropdownMenuItem>

              {onSetDefault && !template.isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(template)}>
                  <Star className="mr-2 h-4 w-4" />
                  Set as Default
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          {template.description || "No description provided"}
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">
            TEMPLATE PREVIEW
          </h4>
          <div className="text-xs bg-muted p-2 rounded-md overflow-hidden whitespace-pre-wrap">
            {getTemplatePreview()}
          </div>
        </div>

        {variableCount > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">
              VARIABLES ({variableCount})
            </h4>
            <div className="text-xs">
              {variableNames}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex justify-between">
        <div>Updated: {getUpdatedTimeText()}</div>
        {template.usageCount !== undefined && (
          <div>Used: {template.usageCount} times</div>
        )}
      </CardFooter>
    </Card>
  );
}
