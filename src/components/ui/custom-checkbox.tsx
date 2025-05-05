
import * as React from "react";
import { Checkbox, CheckboxProps } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface CustomCheckboxProps extends Omit<CheckboxProps, "ref"> {
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
