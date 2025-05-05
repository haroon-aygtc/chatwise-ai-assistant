
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ValidationResult } from "@/lib/validations";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validation?: (value: string, isValid: boolean) => ValidationResult;
}

// Common area codes for display
const AREA_CODES = [
  { code: "201", region: "NJ", city: "Jersey City" },
  { code: "202", region: "DC", city: "Washington" },
  { code: "212", region: "NY", city: "New York City" },
  { code: "213", region: "CA", city: "Los Angeles" },
  { code: "215", region: "PA", city: "Philadelphia" },
  { code: "305", region: "FL", city: "Miami" },
  { code: "312", region: "IL", city: "Chicago" },
  { code: "404", region: "GA", city: "Atlanta" },
  { code: "415", region: "CA", city: "San Francisco" },
  { code: "469", region: "TX", city: "Dallas" },
  { code: "480", region: "AZ", city: "Phoenix" },
  { code: "503", region: "OR", city: "Portland" },
  { code: "512", region: "TX", city: "Austin" },
  { code: "617", region: "MA", city: "Boston" },
  { code: "702", region: "NV", city: "Las Vegas" },
  { code: "713", region: "TX", city: "Houston" },
  { code: "206", region: "WA", city: "Seattle" },
];

export const PhoneInput = ({
  value = "",
  onChange,
  label,
  placeholder = "Phone number",
  required = false,
  disabled = false,
  className,
  validation,
}: PhoneInputProps) => {
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: "",
    error: ""
  });

  // Parse value into area code and phone number
  useEffect(() => {
    if (value) {
      const cleanedValue = value.replace(/\D/g, "");
      if (cleanedValue.length >= 10) {
        setAreaCode(cleanedValue.substring(0, 3));
        setPhoneNumber(cleanedValue.substring(3));
      } else {
        setPhoneNumber(cleanedValue);
      }
    } else {
      setAreaCode("");
      setPhoneNumber("");
    }
  }, [value]);

  const validatePhoneNumber = useCallback(
    (code: string, number: string) => {
      const isCodeValid = code.length === 3 && /^\d{3}$/.test(code);
      const isNumberValid = number.length === 7 && /^\d{7}$/.test(number);
      const newIsValid = isCodeValid && isNumberValid;
      setIsValid(newIsValid);

      if (validation) {
        const result = validation(`(${code}) ${number.substring(0, 3)}-${number.substring(3)}`, newIsValid);
        setValidationResult(result);
      }

      return newIsValid;
    },
    [validation]
  );

  useEffect(() => {
    if (areaCode && phoneNumber) {
      validatePhoneNumber(areaCode, phoneNumber);
    }
  }, [areaCode, phoneNumber, validatePhoneNumber]);

  const handleAreaCodeChange = (newCode: string) => {
    setAreaCode(newCode);
    
    if (onChange) {
      const formatted = `(${newCode}) ${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 7)}`;
      const newIsValid = validatePhoneNumber(newCode, phoneNumber);
      onChange(formatted, newIsValid);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const newPhone = e.target.value.replace(/\D/g, "");
    
    // Limit to 7 digits (excluding area code)
    if (newPhone.length <= 7) {
      setPhoneNumber(newPhone);
      
      if (onChange && areaCode) {
        const formatted = `(${areaCode}) ${newPhone.substring(0, 3)}-${newPhone.substring(3)}`;
        const newIsValid = validatePhoneNumber(areaCode, newPhone);
        onChange(formatted, newIsValid);
      }
    }
  };

  // Format display in input field
  const formattedPhone = phoneNumber.length > 3 
    ? `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3)}`
    : phoneNumber;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
        >
          {label}
        </Label>
      )}
      
      <div className="flex items-center gap-2">
        <div className="relative w-[110px]">
          <Select 
            value={areaCode} 
            onValueChange={handleAreaCodeChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              {AREA_CODES.map((code) => (
                <SelectItem key={code.code} value={code.code}>
                  {code.code} ({code.region})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Input
          value={formattedPhone}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={cn(
            !isValid && "border-destructive focus-visible:ring-destructive"
          )}
          disabled={disabled}
          required={required}
        />
      </div>
      
      {(!isValid || !validationResult.isValid) && validationResult.message && (
        <p className="text-sm text-destructive">{validationResult.message || validationResult.error}</p>
      )}
    </div>
  );
};
