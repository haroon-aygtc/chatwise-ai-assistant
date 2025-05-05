
import { RefreshCw } from "lucide-react";
import { PromptTemplate } from "@/types/ai-configuration";
import { EmptyTemplateState } from "../EmptyTemplateState";
import { TemplateCard } from "../TemplateCard";

interface TemplatesContentProps {
  templates: PromptTemplate[];
  categoryOptions: Array<{ id: string; name: string }>;
  isLoading: boolean;
  hasFilters: boolean;
  onAddTemplate: () => void;
  onEditTemplate: (template: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onCloneTemplate: (template: PromptTemplate) => void;
}

export const TemplatesContent = ({
  templates,
  categoryOptions,
  isLoading,
  hasFilters,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCloneTemplate,
}: TemplatesContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyTemplateState 
        hasFilters={hasFilters}
        onAddTemplate={onAddTemplate}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          categoryName={categoryOptions.find((c) => c.id === template.category)?.name || "General"}
          onEdit={onEditTemplate}
          onDelete={onDeleteTemplate}
          onClone={onCloneTemplate}
        />
      ))}
    </div>
  );
};
