
import React, { useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField as HookFormField,
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
    <HookFormField
      name={name}
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

// Simple form field component for ComponentShowcasePage
interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-2 top-2.5 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
            icon ? "pl-8" : ""
          }`}
        />
      </div>
    </div>
  );
};
