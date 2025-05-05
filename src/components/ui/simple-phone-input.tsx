import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { ValidationResult } from "@/lib/validations";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

interface SimplePhoneInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string, isValid: boolean, countryCode: string) => void;
  onBlur?: () => void;
  validate?: (isValid: boolean) => ValidationResult;
  required?: boolean;
  className?: string;
}

export function SimplePhoneInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  validate,
  required = false,
  className = "",
}: SimplePhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, error: null });

  // Initialize intl-tel-input
  useEffect(() => {
    if (inputRef.current) {
      // Initialize the plugin with minimal options
      itiRef.current = intlTelInput(inputRef.current, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        separateDialCode: true,
        preferredCountries: ["us", "gb", "ca", "au"],
        initialCountry: "auto",
        geoIpLookup: (callback) => {
          fetch("https://ipapi.co/json")
            .then((res) => res.json())
            .then((data) => callback(data.country_code))
            .catch(() => callback("us")); // Default to US if lookup fails
        },
      });

      // Set initial value if provided
      if (value) {
        inputRef.current.value = value;
      }
    }

    // Cleanup
    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (itiRef.current) {
      // Only allow digits
      const inputValue = e.target.value;
      const sanitizedValue = inputValue.replace(/[^\d]/g, '');
      
      if (sanitizedValue !== inputValue) {
        e.target.value = sanitizedValue;
      }
      
      const phoneNumber = itiRef.current.getNumber();
      const isValid = itiRef.current.isValidNumber();
      const countryData = itiRef.current.getSelectedCountryData();
      
      onChange(phoneNumber || "", isValid, countryData.iso2);
      
      if (touched && validate) {
        setValidationResult(validate(isValid));
      }
    }
  };

  // Handle blur
  const handleBlur = () => {
    setTouched(true);
    if (validate && itiRef.current) {
      const isValid = itiRef.current.isValidNumber();
      setValidationResult(validate(isValid));
    }
    if (onBlur) onBlur();
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
        <input
          ref={inputRef}
          id={id}
          type="tel"
          inputMode="numeric"
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`h-12 w-full rounded-md border bg-background px-3 py-1 text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            hasError
              ? "border-destructive focus:border-destructive"
              : "border-input focus:border-primary"
          } ${className}`}
        />
      </div>
      {hasError && (
        <p className="text-destructive text-xs mt-1">{validationResult.error}</p>
      )}
    </div>
  );
}