
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhoneNumber,
} from "@/lib/validations";

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export function useSignupValidation(formData: SignupFormData) {
  const { toast } = useToast();
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const markAllFieldsAsTouched = () => {
    setTouchedFields({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
  };

  const validateForm = () => {
    // Mark all fields as touched
    markAllFieldsAsTouched();
    
    // Validate all fields
    const nameValidation = validateRequired(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhoneNumber(formData.phone);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    
    if (!formData.agreeTerms) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms and privacy policy.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if any validation errors exist
    if (
      !nameValidation.isValid ||
      !emailValidation.isValid ||
      !phoneValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmPasswordValidation.isValid
    ) {
      // Collect all error messages
      const errorMessages = [];
      if (!nameValidation.isValid) errorMessages.push(`Full Name: ${nameValidation.error}`);
      if (!emailValidation.isValid) errorMessages.push(`Email: ${emailValidation.error}`);
      if (!phoneValidation.isValid) errorMessages.push(`Phone Number: ${phoneValidation.error}`);
      if (!passwordValidation.isValid) errorMessages.push(`Password: ${passwordValidation.error}`);
      if (!confirmPasswordValidation.isValid) errorMessages.push(`Confirm Password: ${confirmPasswordValidation.error}`);
      
      // Show toast with all errors
      toast({
        title: "Please fix the following errors:",
        description: (
          <ul className="list-disc pl-4 space-y-1">
            {errorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return {
    touchedFields,
    setTouchedFields,
    validateForm,
    markAllFieldsAsTouched
  };
}
