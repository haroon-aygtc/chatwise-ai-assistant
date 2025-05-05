
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ValidationResult } from "@/lib/validations";

// Country codes for phone numbers
const COUNTRY_CODES = [
  { code: "+1", country: "US", name: "United States" },
  { code: "+44", country: "GB", name: "United Kingdom" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+52", country: "MX", name: "Mexico" },
];

interface IntlPhoneInputProps {
  value?: string;
  onChange?: (value: string, isValid: boolean) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
  className?: string;
  validation?: (value: string, isValid: boolean) => ValidationResult;
}

export const IntlPhoneInput = ({
  value = "",
  onChange,
  label,
  placeholder = "Phone number",
  required = false,
  disabled = false,
  defaultCountry = "US",
  className,
  validation,
}: IntlPhoneInputProps) => {
  const [countryCode, setCountryCode] = useState(
    COUNTRY_CODES.find((c) => c.country === defaultCountry)?.code || "+1"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    message: "",
    error: ""
  });

  // Format: +XX XXXXXXXXXX
  useEffect(() => {
    if (value) {
      // Extract country code and phone number from value
      const match = value.match(/^\+(\d+)\s(.*)$/);
      if (match) {
        const extractedCode = `+${match[1]}`;
        const code = COUNTRY_CODES.find((c) => c.code === extractedCode);
        if (code) {
          setCountryCode(code.code);
          setPhoneNumber(match[2]);
        } else {
          setPhoneNumber(value);
        }
      } else {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber("");
    }
  }, [value]);

  const validatePhoneNumber = useCallback(
    (phone: string) => {
      // Basic format validation (numbers, spaces, dashes, parentheses)
      const phonePattern = /^[\d\s\-()]+$/;
      const newIsValid = phone.length > 0 && phonePattern.test(phone);
      setIsValid(newIsValid);

      if (validation) {
        const result = validation(`${countryCode} ${phone}`, newIsValid);
        setValidationResult(result);
      }

      return newIsValid;
    },
    [countryCode, validation]
  );

  useEffect(() => {
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  }, [phoneNumber, validatePhoneNumber]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    
    const newIsValid = validatePhoneNumber(newPhone);
    
    if (onChange) {
      onChange(`${countryCode} ${newPhone}`, newIsValid);
    }
  };

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    
    if (onChange && phoneNumber) {
      const newIsValid = validatePhoneNumber(phoneNumber);
      onChange(`${newCode} ${phoneNumber}`, newIsValid);
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
      
      <div className="flex items-center gap-2">
        <Select 
          value={countryCode} 
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="+1" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.code} {country.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
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
      </div>
      
      {(!isValid || !validationResult.isValid) && validationResult.message && (
        <p className="text-sm text-destructive">{validationResult.message || validationResult.error}</p>
      )}
    </div>
  );
};
