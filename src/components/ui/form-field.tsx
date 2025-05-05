
import React, { useState, ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ValidationResult } from "@/lib/validations";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validate?: () => ValidationResult;
  required?: boolean;
  className?: string;
  icon?: ReactNode;
  autoComplete?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  validate,
  required = false,
  className = "",
  icon,
  autoComplete,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, error: null });

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      setValidationResult(validate());
    }
    if (onBlur) onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // If field has been touched, validate on change for immediate feedback
    if (touched && validate) {
      setValidationResult(validate());
    }
  };

  const hasError = touched && !validationResult.isValid;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-foreground ${required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}`}
      >
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          className={`${
            icon ? "pl-10" : ""
          } h-12 bg-background border-input ${
            hasError
              ? "border-destructive focus:border-destructive"
              : "focus:border-primary"
          } text-foreground ${className}`}
        />
      </div>
      {hasError && (
        <p className="text-destructive text-xs mt-1">{validationResult.error}</p>
      )}
    </div>
  );
}
