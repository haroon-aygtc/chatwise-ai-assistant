
import React from "react";
import { Button } from "@/components/ui/button";
import { RoutingRule } from "@/types/ai-configuration";

interface RuleItemProps {
  rule: RoutingRule;
  onEdit: (rule: RoutingRule) => void;
  onDelete: (id: string) => void;
}

export const RuleItem: React.FC<RuleItemProps> = ({ rule, onEdit, onDelete }) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div>
        <p className="font-medium">{rule.name}</p>
        <p className="text-sm text-muted-foreground">
          {rule.description}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(rule)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => onDelete(rule.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
