import React from "react";
import { PromptTemplate } from "@/types/ai-configuration";
import { TemplateCard } from "../TemplateCard";
import { EmptyTemplateState } from "../EmptyTemplateState";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplatesContentProps {
  templates: PromptTemplate[];
  isLoading: boolean;
  onEdit: (template: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (template: PromptTemplate) => void;
  onTest?: (template: PromptTemplate) => void;
  onSetDefault?: (template: PromptTemplate) => void;
}

/**
 * TemplatesContent - A component for displaying a grid of template cards
 * 
 * Features:
 * - Responsive grid layout for template cards
 * - Loading skeleton state
 * - Empty state when no templates exist
 * - Passes actions to template cards
 */
export function TemplatesContent({
  templates,
  isLoading,
  onEdit,
  onDelete,
  onClone,
  onTest,
  onSetDefault,
}: TemplatesContentProps) {
  // Display loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Display empty state if no templates
  if (templates.length === 0) {
    return <EmptyTemplateState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={() => onEdit(template)}
          onDelete={() => onDelete(template.id)}
          onClone={() => onClone(template)}
          onTest={onTest ? () => onTest(template) : undefined}
          onSetDefault={onSetDefault ? () => onSetDefault(template) : undefined}
        />
      ))}
    </div>
  );
}
