
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Github } from "lucide-react";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { OrganizationStep } from "./OrganizationStep";
import { ReviewStep } from "./ReviewStep";

interface SignupStepsProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    orgName: string;
    jobTitle: string;
    agreeTerms: boolean;
  };
  updateFormData: (key: string, value: string | boolean) => void;
  isLoading: boolean;
  handleSignup: (e: React.FormEvent) => void;
}

export function SignupSteps({ formData, updateFormData, isLoading, handleSignup }: SignupStepsProps) {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password error",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };
    
    // Simple password strength check
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { 
      strength, 
      label: labels[strength - 1] || "" 
    };
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-blue-500" : "w-2 bg-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <PersonalInfoStep 
            formData={formData} 
            updateFormData={updateFormData}
            passwordStrength={getPasswordStrength()}
          />
        );
      
      case 2:
        return <OrganizationStep formData={formData} updateFormData={updateFormData} />;
      
      case 3:
        return <ReviewStep formData={formData} updateFormData={updateFormData} />;
        
      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    if (step < 3) {
      return (
        <div className="flex justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
              onClick={handlePrevStep}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div> // Empty div for spacing
          )}
          
          <Button
            type="button"
            className="h-12 bg-blue-600 hover:bg-blue-700"
            onClick={handleNextStep}
          >
            Next Step
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800"
          onClick={handlePrevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="submit"
          className="h-12 bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : (
            <>
              Create Account <Check className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
        <p className="text-gray-400">
          Step {step} of 3: {step === 1 ? "Personal Information" : step === 2 ? "Organization Details" : "Review & Submit"}
        </p>
      </div>
      
      {renderStepIndicator()}
      
      <form onSubmit={handleSignup} className="space-y-6">
        {renderFormStep()}
        
        <div className="pt-4">
          {renderStepButtons()}
        </div>
      </form>
      
      {step === 1 && (
        <>
          <div className="relative my-8">
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
        </>
      )}
    </>
  );
}
