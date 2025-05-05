import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { ValidationResult } from "@/lib/validations";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, error: null });
  const [internalValue, setInternalValue] = useState(value);
  const [isInputValid, setIsInputValid] = useState(true);

  // Handle keydown to prevent non-digit characters
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and navigation keys
    if ([8, 9, 13, 27, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) ||
        // Allow: space
        e.keyCode === 32) {
      // Let it happen, don't do anything
      return;
    }
    
    // Ensure that it is a number and stop the keypress if not
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  // Initialize intl-tel-input
  useEffect(() => {
    if (inputRef.current) {
      // Initialize the plugin
      itiRef.current = intlTelInput(inputRef.current, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        separateDialCode: true,
        autoPlaceholder: "aggressive", // Show example number
        preferredCountries: ["us", "gb", "ca", "au", "ae", "in", "pk", "sa"],
        initialCountry: "auto",
        formatOnDisplay: true,
        nationalMode: false, // Always include the country code
        allowDropdown: true, // Allow country selection
        autoHideDialCode: false, // Always show the dial code
        customPlaceholder: (selectedCountryPlaceholder, selectedCountryData) => {
          return "e.g. " + selectedCountryPlaceholder;
        },
        // Set the path to the flag images
        customContainer: "iti-container",
        dropdownContainer: document.body,
        // Use the CDN version of utils.js
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
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

      // Add event listeners
      inputRef.current.addEventListener("countrychange", handleCountryChange);
    }

    // Cleanup
    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
      }
      if (inputRef.current) {
        inputRef.current.removeEventListener("countrychange", handleCountryChange);
      }
    };
  }, []);

  // Handle country change
  const handleCountryChange = () => {
    if (itiRef.current && inputRef.current) {
      const countryData = itiRef.current.getSelectedCountryData();
      const isValid = itiRef.current.isValidNumber();
      const phoneNumber = itiRef.current.getNumber();
      
      setIsInputValid(isValid);
      onChange(phoneNumber, isValid, countryData.iso2);
      setInternalValue(phoneNumber);
      
      // Validate if touched
      if (touched && validate) {
        setValidationResult(validate(isValid));
      }
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (itiRef.current && inputRef.current) {
      // Only allow digits and spaces in the input
      const inputValue = e.target.value;
      const sanitizedValue = inputValue.replace(/[^\d\s]/g, '');
      
      // If the sanitized value is different from the input value, update the input
      if (sanitizedValue !== inputValue) {
        e.target.value = sanitizedValue;
      }
      
      // Get the formatted phone number
      const phoneNumber = itiRef.current.getNumber();
      
      // Check if the number is valid for the selected country
      const isValid = itiRef.current.isValidNumber();
      
      // Get the country data
      const countryData = itiRef.current.getSelectedCountryData();
      
      // Format the number according to the selected country's format
      if (phoneNumber) {
        // Use the intl-tel-input formatting
        const formattedNumber = itiRef.current.getNumber(intlTelInput.numberFormat.INTERNATIONAL);
        
        // Update state
        setIsInputValid(isValid);
        onChange(formattedNumber, isValid, countryData.iso2);
        setInternalValue(formattedNumber);
      } else {
        // If the input is empty
        setIsInputValid(false);
        onChange("", false, countryData.iso2);
        setInternalValue("");
      }
      
      // Validate if touched
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
      setIsInputValid(isValid);
      setValidationResult(validate(isValid));
    }
    if (onBlur) onBlur();
  };

  const hasError = touched && !validationResult.isValid;

  // Update the input value when the value prop changes
  useEffect(() => {
    if (inputRef.current && itiRef.current && value !== internalValue) {
      inputRef.current.value = value;
      setInternalValue(value);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-foreground ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}`}
      >
        {label}
      </Label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="tel"
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          inputMode="numeric" // Show numeric keyboard on mobile
          pattern="[0-9\s]+" // HTML5 pattern for digits and spaces only
          className={`h-12 w-full rounded-md border bg-background px-3 py-1 text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            hasError
              ? "border-red-500 focus:border-red-500"
              : touched && isInputValid
                ? "border-green-500 focus:border-green-500"
                : "border-input focus:border-primary"
          } ${className}`}
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