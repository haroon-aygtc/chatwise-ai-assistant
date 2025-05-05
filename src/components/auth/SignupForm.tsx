
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/components/ui/form-field";
import { PhoneInput } from "@/components/ui/phone-input";
import { SocialSignIn } from "@/components/auth/SocialSignIn";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox";
import { LoginLink } from "@/components/auth/LoginLink";
import { useSignupValidation, SignupFormData } from "@/hooks/use-signup-validation";
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhoneNumber,
} from "@/lib/validations";

export function SignupForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phone: "",
    countryCode: "US",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const { touchedFields, setTouchedFields, validateForm } = useSignupValidation(formData);

  const updateFormField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please sign in.",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-400">Enter your details to sign up</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="name"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(value) => updateFormField("name", value)}
          validate={() => validateRequired(formData.name)}
          required
          icon={<User className="h-4 w-4" />}
        />
        
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={(value) => updateFormField("email", value)}
          validate={() => validateEmail(formData.email)}
          required
          icon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        
        <PhoneInput
          id="phone"
          label="Phone Number"
          value={formData.phone}
          countryCode={formData.countryCode}
          onChange={(value, countryCode) => {
            updateFormField("phone", value);
            updateFormField("countryCode", countryCode);
          }}
          validate={() => validatePhoneNumber(formData.phone)}
          required
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(value) => updateFormField("password", value)}
          validate={() => validatePassword(formData.password)}
          required
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />
        
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(value) => updateFormField("confirmPassword", value)}
          validate={() => validatePasswordMatch(formData.password, formData.confirmPassword)}
          required
          icon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />
        
        <TermsCheckbox 
          checked={formData.agreeTerms}
          onCheckedChange={(checked) => updateFormField("agreeTerms", checked)}
        />
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : (
            <>
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        
        <SocialSignIn />
      </form>
      
      <LoginLink />
    </>
  );
}
