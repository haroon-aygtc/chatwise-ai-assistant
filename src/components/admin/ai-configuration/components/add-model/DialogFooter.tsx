
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ModelDialogFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isFormValid: boolean;
}

export const ModelDialogFooter = ({ 
  isSubmitting, 
  onCancel, 
  isFormValid 
}: ModelDialogFooterProps) => {
  return (
    <DialogFooter>
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
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Adding...
          </>
        ) : (
          "Add Model"
        )}
      </Button>
    </DialogFooter>
  );
};
