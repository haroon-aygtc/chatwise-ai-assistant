import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ModelDialogFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isFormValid: boolean;
}

export const ModelDialogFooter = ({
  isSubmitting,
  onCancel,
  isFormValid,
}: ModelDialogFooterProps) => {
  return (
    <DialogFooter className="mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || !isFormValid}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Model"
        )}
      </Button>
    </DialogFooter>
  );
};
