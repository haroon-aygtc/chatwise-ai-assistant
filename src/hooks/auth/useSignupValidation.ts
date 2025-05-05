
import { useState, useEffect } from "react";
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
  isPhoneValid: boolean;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export function useSignupValidation(formData: SignupFormData) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({
    name: null,
    email: null,
    phone: null,
    password: null,
    confirmPassword: null,
  });

  // Validate form when data changes
  useEffect(() => {
    if (touchedFields.name) {
      const { isValid, message } = validateRequired(formData.name);
      setErrors(prev => ({ ...prev, name: isValid ? null : message }));
    }

    if (touchedFields.email) {
      const { isValid, message } = validateEmail(formData.email);
      setErrors(prev => ({ ...prev, email: isValid ? null : message }));
    }

    if (touchedFields.phone) {
      const { isValid, message } = validatePhoneNumber(formData.phone, formData.isPhoneValid);
      setErrors(prev => ({ ...prev, phone: isValid ? null : message }));
    }

    if (touchedFields.password) {
      const { isValid, message } = validatePassword(formData.password);
      setErrors(prev => ({ ...prev, password: isValid ? null : message }));
    }

    if (touchedFields.confirmPassword) {
      const { isValid, message } = validatePasswordMatch(
        formData.password,
        formData.confirmPassword
      );
      setErrors(prev => ({ ...prev, confirmPassword: isValid ? null : message }));
    }
  }, [formData, touchedFields]);

  const validateForm = () => {
    // Mark all fields as touched
    setTouchedFields({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const nameValidation = validateRequired(formData.name);
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhoneNumber(formData.phone, formData.isPhoneValid);
    const passwordValidation = validatePassword(formData.password);
    const confirmPasswordValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );

    // Update errors
    setErrors({
      name: nameValidation.isValid ? null : nameValidation.message,
      email: emailValidation.isValid ? null : emailValidation.message,
      phone: phoneValidation.isValid ? null : phoneValidation.message,
      password: passwordValidation.isValid ? null : passwordValidation.message,
      confirmPassword: confirmPasswordValidation.isValid ? null : confirmPasswordValidation.message,
    });

    // Return whether the form is valid
    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      phoneValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      formData.agreeTerms
    );
  };

  return {
    touchedFields,
    setTouchedFields,
    errors,
    validateForm,
  };
}

export default useSignupValidation;
