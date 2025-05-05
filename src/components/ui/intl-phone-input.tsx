
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationResult } from "@/lib/validations";
import { Phone } from "lucide-react";

interface IntlPhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string, isValid: boolean, countryCode: string) => void;
  onBlur?: () => void;
  validate?: (isValid: boolean) => ValidationResult;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export function IntlPhoneInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  validate,
  required = false,
  className = "",
  placeholder = "Phone number",
}: IntlPhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, error: null });
  const [isInputValid, setIsInputValid] = useState(true);

  // Simplified version to avoid intl-tel-input errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/[^\d\s]/g, '');
    
    // Validate format (simple)
    const isValid = sanitizedValue.length >= 7;
    
    setIsInputValid(isValid);
    onChange(sanitizedValue, isValid, "US");
    
    // Validate if touched
    if (touched && validate) {
      setValidationResult(validate(isValid));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const isValid = value.length >= 7;
      setIsInputValid(isValid);
      setValidationResult(validate(isValid));
    }
    if (onBlur) onBlur();
  };

  const hasError = touched && !validationResult.isValid;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-foreground ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}`}
      >
        {label}
      </Label>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          id={id}
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`pl-10 h-12 bg-background border-input ${
            hasError
              ? "border-red-500 focus:border-red-500"
              : "focus:border-primary"
          } text-foreground ${className}`}
        />
        {touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isInputValid ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-green-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-red-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
          </div>
        )}
      </div>
      {hasError && (
        <p className="text-red-500 text-xs mt-1">{validationResult.error}</p>
      )}
    </div>
  );
}
