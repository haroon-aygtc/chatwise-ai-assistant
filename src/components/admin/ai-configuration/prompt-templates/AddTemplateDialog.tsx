
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PromptTemplate, PromptVariable } from "@/types/ai-configuration";

interface CategoryOption {
  id: string;
  name: string;
}

interface AddTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Partial<PromptTemplate>) => void;
  categoryOptions: CategoryOption[];
  isSaving: boolean;
}

export const AddTemplateDialog = ({
  open,
  onOpenChange,
  onSave,
  categoryOptions,
  isSaving,
}: AddTemplateDialogProps) => {
  const [newTemplate, setNewTemplate] = useState<Partial<PromptTemplate>>({
    name: "",
    description: "",
    template: "",
    category: "general",
    variables: [],
    isActive: true,
  });

  const handleSave = () => {
    if (newTemplate.name && newTemplate.template) {
      const variableMatches = newTemplate.template.match(/\{([^}]+)\}/g) || [];
      const extractedVariables: PromptVariable[] = variableMatches.map((v) => ({
        name: v.replace(/[{}]/g, ""),
        description: "",
        required: true,
        defaultValue: "",
      }));

      onSave({
        ...newTemplate,
        variables: extractedVariables,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Template</DialogTitle>
          <DialogDescription>
            Create a new prompt template for your AI assistant
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newTemplate.name}
              onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={newTemplate.description}
              onChange={(e) =>
                setNewTemplate({
                  ...newTemplate,
                  description: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={newTemplate.category}
              onValueChange={(value) =>
                setNewTemplate({ ...newTemplate, category: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="template" className="text-right pt-2">
              Content
            </Label>
            <div className="col-span-3 space-y-2">
              <Textarea
                id="template"
                rows={6}
                value={newTemplate.template}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, template: e.target.value })
                }
                placeholder="Enter your prompt template here. Use {variable_name} for variables."
              />
              <p className="text-sm text-muted-foreground">
                Use curly braces for variables, e.g., {"{user_name}"}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!newTemplate.name || !newTemplate.template || isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Template'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
