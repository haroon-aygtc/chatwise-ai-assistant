
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PromptTemplateCategory } from "@/types/ai-configuration";

interface AddTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: any) => void;
  categoryOptions: PromptTemplateCategory[];
  isSaving: boolean;
}

export const AddTemplateDialog: React.FC<AddTemplateDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  categoryOptions,
  isSaving,
}) => {
  // Stub implementation
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Template</DialogTitle>
        </DialogHeader>
        <div>Template form would go here</div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
