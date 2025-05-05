
import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ValidationResult } from "@/lib/validations";

interface CustomFormFieldProps {
  name: string;
  label?: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  validation?: (value: any) => ValidationResult;
  children: React.ReactNode;
}

export const CustomFormField = ({
  name,
  label,
  description,
  tooltip,
  required = false,
  validation,
  children,
}: CustomFormFieldProps) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: "",
    error: ""
  });

  const handleValidation = (value: any) => {
    if (validation) {
      const result = validation(value);
      setValidationResult(result);
      return result.isValid;
    }
    return true;
  };

  return (
    <FormField
      name={name}
      rules={{ required: required ? "This field is required" : false }}
      validate={handleValidation}
      render={({ field }) => (
        <FormItem className="space-y-1">
          {label && (
            <div className="flex items-center space-x-1">
              <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                {label}
              </FormLabel>

              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          <FormControl>{React.cloneElement(children as React.ReactElement, field)}</FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          {!validationResult.isValid && validationResult.message && (
            <FormMessage>{validationResult.message || validationResult.error}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
