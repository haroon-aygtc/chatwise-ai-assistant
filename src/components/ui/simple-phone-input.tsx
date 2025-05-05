
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ValidationResult } from "@/lib/validations";

interface SimplePhoneInputProps {
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: (value: string, isValid: boolean) => ValidationResult;
}

export const SimplePhoneInput = ({
  value = "",
  onChange,
  label,
  placeholder = "Phone number",
  required = false,
  disabled = false,
  className,
  validation,
}: SimplePhoneInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: "",
    error: ""
  });

  // Format incoming value if different from internal state
  useEffect(() => {
    if (value && value !== phoneNumber) {
      // Clean up any non-digit characters
      const digits = value.replace(/\D/g, "");
      
      // Format the phone number
      let formatted = "";
      if (digits.length > 0) {
        // For US format (XXX) XXX-XXXX
        if (digits.length <= 3) {
          formatted = digits;
        } else if (digits.length <= 6) {
          formatted = `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
        } else {
          formatted = `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
        }
      }
      
      setPhoneNumber(formatted);
    }
  }, [value, phoneNumber]);

  const validatePhoneNumber = useCallback(
    (phone: string) => {
      // US phone format validation - we want 10 digits total
      const digitsOnly = phone.replace(/\D/g, "");
      const newIsValid = digitsOnly.length === 10;
      setIsValid(newIsValid);

      if (validation) {
        const result = validation(phone, newIsValid);
        setValidationResult(result);
      }

      return newIsValid;
    },
    [validation]
  );
  
  useEffect(() => {
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber, validatePhoneNumber]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, "");
    
    // Format the phone number as the user types
    let formatted = "";
    if (digitsOnly.length <= 3) {
      formatted = digitsOnly;
    } else if (digitsOnly.length <= 6) {
      formatted = `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3)}`;
    } else {
      formatted = `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6, 10)}`;
    }
    
    setPhoneNumber(formatted);
    
    if (onChange) {
      const newIsValid = validatePhoneNumber(formatted);
      onChange(formatted, newIsValid);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
        >
          {label}
        </Label>
      )}
      
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        className={cn(
          !isValid && "border-destructive focus-visible:ring-destructive"
        )}
        disabled={disabled}
        required={required}
      />
      
      {(!isValid || !validationResult.isValid) && validationResult.message && (
        <p className="text-sm text-destructive">{validationResult.message || validationResult.error}</p>
      )}
    </div>
  );
};
