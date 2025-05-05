
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, ArrowRight, Github, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "@/components/ui/form-field";
import { PhoneInput } from "@/components/ui/phone-input";
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
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "US",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const updateFormField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={formData.agreeTerms}
            onCheckedChange={(checked) => updateFormField("agreeTerms", checked as boolean)}
            className="border-gray-500 data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="terms" className="text-sm font-normal text-gray-400">
            I agree to the <Button variant="link" className="p-0 h-auto text-blue-400">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-blue-400">Privacy Policy</Button>
          </Label>
        </div>
        
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
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[#0A101F] px-2 text-gray-500">OR SIGN UP WITH</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800">
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </Button>
          <Button variant="outline" className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </div>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{" "}
        <Button variant="link" className="p-0 h-auto font-normal text-blue-400" onClick={() => navigate("/login")}>
          Sign in
        </Button>
      </p>
    </>
  );
}
