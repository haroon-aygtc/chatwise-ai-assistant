
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { type CheckedState } from "@radix-ui/react-checkbox";

export interface CustomCheckboxProps {
  checked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}

export const CustomCheckbox = React.forwardRef<
  HTMLButtonElement,
  CustomCheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  const innerRef = React.useRef<HTMLButtonElement>(null);
  const resolvedRef = (ref || innerRef) as React.RefObject<HTMLButtonElement>;

  React.useEffect(() => {
    if (
      resolvedRef.current &&
      typeof indeterminate === "boolean" &&
      "indeterminate" in resolvedRef.current
    ) {
      // This is a bit hacky, but it's the only way to set the indeterminate property
      (resolvedRef.current as any).indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <Checkbox
      ref={resolvedRef}
      className={cn(
        indeterminate && "bg-primary/50 text-primary-foreground",
        className
      )}
      {...props}
    />
  );
});

CustomCheckbox.displayName = "CustomCheckbox";
