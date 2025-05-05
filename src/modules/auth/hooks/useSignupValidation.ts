
import { useState } from "react";

export function useSignupValidation() {
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    });
  };

  const getPasswordStrengthScore = () => {
    const { hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = passwordStrength;
    let score = 0;
    
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    
    return score;
  };

  const getPasswordStrengthText = () => {
    const score = getPasswordStrengthScore();
    
    if (score <= 2) return "Weak";
    if (score <= 4) return "Moderate";
    return "Strong";
  };

  return {
    passwordStrength,
    validatePassword,
    getPasswordStrengthScore,
    getPasswordStrengthText,
  };
}
