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
  onTest?: (template: PromptTemplate) => void;
}

export const TemplatesContent = ({
  templates,
  isLoading,
  onEdit,
  onDelete,
  onTest,
}: TemplatesContentProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

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
          onTest={onTest ? () => onTest(template) : undefined}
        />
      ))}
    </div>
  );
};
