
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: PromptTemplate | null;
  onSave: (id: string, template: Partial<PromptTemplate>) => void;
  categoryOptions: CategoryOption[];
  isSaving: boolean;
}

export const EditTemplateDialog = ({
  open,
  onOpenChange,
  template,
  onSave,
  categoryOptions,
  isSaving,
}: EditTemplateDialogProps) => {
  const [editedTemplate, setEditedTemplate] = useState<PromptTemplate | null>(null);

  useEffect(() => {
    if (open && template) {
      setEditedTemplate(template);
    }
  }, [open, template]);

  const handleVariableChange = (value: string) => {
    if (editedTemplate) {
      const variableMatches = value.match(/\{([^}]+)\}/g) || [];
      const extractedVariables: PromptVariable[] = variableMatches.map((v) => ({
        name: v.replace(/[{}]/g, ""),
        description: "",
        required: true,
        defaultValue: "",
      }));
      
      setEditedTemplate({
        ...editedTemplate,
        template: value,
        variables: extractedVariables,
      });
    }
  };

  const handleSave = () => {
    if (editedTemplate) {
      onSave(editedTemplate.id, editedTemplate);
    }
  };

  if (!editedTemplate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>Modify your prompt template</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={editedTemplate.name}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  name: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Input
              id="edit-description"
              value={editedTemplate.description}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  description: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Select
              value={editedTemplate.category}
              onValueChange={(value) =>
                setEditedTemplate({
                  ...editedTemplate,
                  category: value,
                })
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
            <Label htmlFor="edit-template" className="text-right pt-2">
              Content
            </Label>
            <div className="col-span-3 space-y-2">
              <Textarea
                id="edit-template"
                rows={6}
                value={editedTemplate.template}
                onChange={(e) => handleVariableChange(e.target.value)}
              />
              <div>
                <Label>Variables (automatically detected)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editedTemplate.variables && editedTemplate.variables.map((variable) => (
                    <Badge key={variable.name} variant="outline">
                      {variable.name}
                    </Badge>
                  ))}
                </div>
              </div>
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
            disabled={
              !editedTemplate ||
              !editedTemplate.name ||
              !editedTemplate.template ||
              isSaving
            }
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
