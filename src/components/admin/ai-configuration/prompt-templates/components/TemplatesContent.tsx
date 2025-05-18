
import React from "react";
import { PromptTemplate, PromptTemplateCategory } from "@/types/ai-configuration";

interface TemplatesContentProps {
  templates: PromptTemplate[];
  categoryOptions: PromptTemplateCategory[];
  isLoading: boolean;
  hasFilters: boolean;
  onAddTemplate: () => void;
  onEditTemplate: (template: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onCloneTemplate: (template: PromptTemplate) => void;
}

export const TemplatesContent: React.FC<TemplatesContentProps> = ({
  templates,
  categoryOptions,
  isLoading,
  hasFilters,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onCloneTemplate
}) => {
  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
        <h3 className="text-lg font-medium">No templates found</h3>
        <p className="text-muted-foreground mb-4">
          {hasFilters
            ? "Try changing your search or filter criteria."
            : "Create your first prompt template to get started."}
        </p>
        {!hasFilters && (
          <button
            onClick={onAddTemplate}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create Template
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <div
          key={template.id}
          className="border rounded-lg p-4 hover:border-primary transition-colors"
        >
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {template.description || "No description"}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => onCloneTemplate(template)}
              className="text-xs px-2 py-1 rounded border hover:bg-accent"
            >
              Clone
            </button>
            <button
              onClick={() => onEditTemplate(template)}
              className="text-xs px-2 py-1 rounded border hover:bg-accent"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteTemplate(template.id)}
              className="text-xs px-2 py-1 rounded border hover:bg-accent text-destructive"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
