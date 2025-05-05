
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { ValidationResult } from "@/lib/validations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// A subset of countries for the demo
const countries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
];

interface PhoneInputProps {
  id: string;
  label: string;
  value: string;
  countryCode: string;
  onChange: (value: string, countryCode: string) => void;
  onBlur?: () => void;
  validate?: () => ValidationResult;
  required?: boolean;
  className?: string;
}

export function PhoneInput({
  id,
  label,
  value,
  countryCode,
  onChange,
  onBlur,
  validate,
  required = false,
  className = "",
}: PhoneInputProps) {
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true, error: null });
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === countryCode) || countries[0]
  );

  useEffect(() => {
    // Update selected country when countryCode prop changes
    const country = countries.find((c) => c.code === countryCode);
    if (country) setSelectedCountry(country);
  }, [countryCode]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      setValidationResult(validate());
    }
    if (onBlur) onBlur();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, spaces, and some special characters like +, -, (, )
    const sanitizedValue = e.target.value.replace(/[^\d\s()\-+]/g, '');
    onChange(sanitizedValue, selectedCountry.code);
    
    // If field has been touched, validate on change for immediate feedback
    if (touched && validate) {
      setValidationResult(validate());
    }
  };

  const handleCountryChange = (code: string) => {
    const country = countries.find((c) => c.code === code) || countries[0];
    setSelectedCountry(country);
    onChange(value, country.code);
  };

  const hasError = touched && !validationResult.isValid;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-gray-300 ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}`}
      >
        {label}
      </Label>
      <div className="flex gap-2">
        <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[110px] h-12 bg-[#131B2E] border-[#2A3349] focus:border-gray-500 text-white">
            <SelectValue>
              <div className="flex items-center gap-1">
                <span className="text-lg">{selectedCountry.flag}</span>
                <span>{selectedCountry.dialCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                  <span className="text-sm text-gray-500 ml-auto">{country.dialCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id={id}
            type="tel"
            placeholder="Phone number"
            value={value}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            className={`pl-10 h-12 bg-[#131B2E] border-[#2A3349] ${
              hasError
                ? "border-red-500 focus:border-red-500"
                : "focus:border-gray-500"
            } text-white ${className}`}
          />
        </div>
      </div>
      {hasError && (
        <p className="text-red-500 text-xs mt-1">{validationResult.error}</p>
      )}
    </div>
  );
}
